import { db } from "./supabase";

export type LeaderTeam = { id: string; name: string; players: string[]; rounds: (number|null)[]; total: number; toPar: number };

const demo: LeaderTeam[] = [
  { id:"1", name:"DGK Stubaki", players:["Tomislav","Anđelko","Mario","Tina"], rounds:[null,null,null], total:0, toPar:0 },
  { id:"2", name:"Naziv ekipe naknadno", players:["Tilen","Mario","Barbara","Marko"], rounds:[null,null,null], total:0, toPar:0 },
  { id:"3", name:"Futur egzaktni", players:["Branimir","Sanja","Ljubo","Ivan"], rounds:[null,null,null], total:0, toPar:0 },
];

export async function getLeaderboard(): Promise<LeaderTeam[]> {
  const client = db();
  if (!client) return demo;
  const { data: teams } = await client.from("teams").select("id,name,players(name)").eq("active", true);
  const [{ data: scores }, { data: holes }] = await Promise.all([client.from("hole_scores").select("team_id,round_no,hole_no,strokes"),client.from("holes").select("number,par")]);
  if (!teams) return demo;
  return teams.map((t:any) => {
    const rounds = [1,2,3].map(r => { const s=(scores||[]).filter((x:any)=>x.team_id===t.id&&x.round_no===r); return s.length ? s.reduce((a:number,x:any)=>a+x.strokes,0) : null; });
    const teamScores=(scores||[]).filter((x:any)=>x.team_id===t.id);const parByHole=new Map((holes||[]).map((h:any)=>[h.number,h.par]));
    const total=rounds.reduce((a:number,x:any)=>a+(x||0),0);
    return { id:t.id, name:t.name, players:t.players.map((p:any)=>p.name), rounds, total, toPar:total-teamScores.reduce((sum:number,score:any)=>sum+(parByHole.get(score.hole_no)||3),0) };
  }).sort((a,b)=>(a.total||999)-(b.total||999));
}
