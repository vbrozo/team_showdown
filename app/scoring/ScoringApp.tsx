"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Wifi } from "lucide-react";

type Score={team_id:string,hole_no:number,strokes:number,opener_id:string};
type FlightData={flight:{id:string,name:string,round_no:number,start_hole:number},teams:{id:string,name:string,players:{id:string,name:string}[]}[],scores:Score[]};
type Draft={openerId:string,strokes:number};

export default function ScoringApp(){
  const [code,setCode]=useState(""),[data,setData]=useState<FlightData|null>(null),[hole,setHole]=useState(1),[msg,setMsg]=useState(""),[drafts,setDrafts]=useState<Record<string,Draft>>({}),[saving,setSaving]=useState(false);
  const key=(teamId:string,holeNo:number)=>`${teamId}:${holeNo}`;

  async function login(e:React.FormEvent){e.preventDefault();const r=await fetch("/api/scoring",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"login",code})});if(r.ok){const d=await r.json();setData(d);setHole(d.flight.start_hole)}else setMsg("Šifra nije ispravna ili runda nije aktivna.")}
  function updateDraft(teamId:string,value:Draft){setDrafts(current=>({...current,[key(teamId,hole)]:value}))}
  function currentDraft(teamId:string):Draft|undefined{const draft=drafts[key(teamId,hole)];if(draft)return draft;const saved=data?.scores.find(s=>s.team_id===teamId&&s.hole_no===hole);return saved?{openerId:saved.opener_id,strokes:saved.strokes}:undefined}
  function openerCounts(teamId:string){const byHole=new Map<number,string>();data?.scores.filter(s=>s.team_id===teamId).forEach(s=>byHole.set(s.hole_no,s.opener_id));Object.entries(drafts).filter(([draftKey])=>draftKey.startsWith(`${teamId}:`)).forEach(([draftKey,draft])=>{if(draft.openerId)byHole.set(Number(draftKey.split(":")[1]),draft.openerId)});const counts:Record<string,number>={};byHole.forEach(openerId=>{counts[openerId]=(counts[openerId]||0)+1});return counts}

  async function persist(scores:{teamId:string,hole:number,openerId:string,strokes:number}[],message:string){
    if(!scores.length)return true;
    setSaving(true);setMsg("Spremanje rezultata…");
    const r=await fetch("/api/scoring",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"scores",scores})});
    setSaving(false);
    if(r.ok){setData(await r.json());setMsg(message);return true}
    const error=await r.json().catch(()=>({}));setMsg(error.error==="opener limit reached"?"Igrač već ima četiri početna bacanja. Odaberite drugog igrača.":"Rezultat nije spremljen. Provjerite vezu i pokušajte ponovno.");return false;
  }
  async function nextHole(){
    const currentHole=hole;
    const complete=(data?.teams||[]).map(team=>({team,draft:currentDraft(team.id)})).filter(x=>x.draft?.openerId).map(x=>({teamId:x.team.id,hole:currentHole,openerId:x.draft!.openerId,strokes:x.draft!.strokes}));
    setHole(currentHole===16?1:currentHole+1);
    await persist(complete,"Rezultati prethodne staze automatski su spremljeni.");
  }

  if(!data)return <main className="authPage green"><form className="loginCard" onSubmit={login}><Image src="/lagoda-logo.jpg" alt="Lagoda" width={82} height={68}/><span className="eyebrow">ZAPISNIČAR</span><h1>Prijava flighta</h1><p>Unesite šifru koju ste dobili od organizatora.</p><label>Šifra flighta<input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="R1-F01-4821" required/></label>{msg&&<div className="notice error">{msg}</div>}<button className="btn">Otvori scorecard</button><Link href="/">← Povratak na leaderboard</Link></form></main>;

  return <main className="scorePage"><header className="scoreNav"><div className="brand light"><Image src="/lagoda-logo.jpg" alt="Lagoda" width={44} height={44}/><span>TEAM <b>SHOWDOWN</b></span></div><div><b>{data.flight.name}</b><span>Runda {data.flight.round_no}</span></div><span className="sync"><Wifi/> {saving?"Spremanje…":"Online"}</span></header><section className="scoreShell"><div className="holeNav"><button onClick={()=>setHole(hole===1?16:hole-1)} aria-label="Prethodna staza"><ChevronLeft/></button><div><span>STAZA</span><b>{hole}</b><small>PAR 3</small></div><button onClick={nextHole} disabled={saving} aria-label="Sljedeća staza"><ChevronRight/></button></div>{msg&&<div className="notice">{msg}</div>}{data.teams.map(team=><ScoreTeam key={`${team.id}-${hole}`} team={team} current={currentDraft(team.id)} counts={openerCounts(team.id)} saved={data.scores.some(s=>s.team_id===team.id&&s.hole_no===hole)} onChange={value=>updateDraft(team.id,value)}/>) }<div className="scoreFoot"><span>{data.scores.filter(s=>s.hole_no===hole).length}/{data.teams.length} rezultata uneseno</span><button className="btn" disabled={saving} onClick={nextHole}>{saving?"Spremanje…":"Sljedeća staza"} <ChevronRight/></button></div></section></main>;
}

function ScoreTeam({team,current,counts,saved,onChange}:{team:FlightData["teams"][0],current:Draft|undefined,counts:Record<string,number>,saved:boolean,onChange:(value:Draft)=>void}){
  const [opener,setOpener]=useState(current?.openerId||""),[strokes,setStrokes]=useState(current?.strokes||3);
  function chooseOpener(id:string){if((counts[id]||0)>=4&&opener!==id)return;setOpener(id);onChange({openerId:id,strokes})}
  function changeStrokes(value:number){const next=Math.max(1,value);setStrokes(next);onChange({openerId:opener,strokes:next})}
  return <article className="scoreTeam"><div className="scoreTeamHead"><div><span>EKIPA</span><h2>{team.name}</h2></div>{saved&&<span className="saved"><Check/> Spremljeno</span>}</div><div className="fieldLabel">Početno bacanje</div><div className="playerButtons">{team.players.map(p=>{const full=(counts[p.id]||0)>=4&&opener!==p.id;return <button onClick={()=>chooseOpener(p.id)} disabled={full} className={opener===p.id?"active":full?"limit":""} key={p.id}>{p.name}{full&&<small>4/4</small>}</button>})}</div><div className="fieldLabel">Broj bacanja</div><div className="strokePicker"><button onClick={()=>changeStrokes(strokes-1)}>−</button><b>{strokes}</b><button onClick={()=>changeStrokes(strokes+1)}>+</button></div><div className="openerSummary"><div className="fieldLabel">Početna bacanja u rundi</div><div>{team.players.map(p=><span className={(counts[p.id]||0)>=4?"complete":""} key={p.id}><b>{p.name}</b><strong>{counts[p.id]||0}/4</strong></span>)}</div></div></article>;
}
