"use client";

import { Trophy, Users, Target, ArrowRight, Languages } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LeaderTeam } from "@/lib/data";

const copy = {
  hr: {
    results: "Rezultati", scoring: "Unos rezultata", presented: "Lagoda Disc Golf predstavlja",
    intro: "Četiri igrača. Jedan disk u igri. Šesnaest staza za savršenu timsku taktiku.",
    follow: "Prati rezultate", flightLogin: "Prijava flighta", format: "FORMAT TURNIRA",
    formatLine: "4 igrača · 16 staza", teamScore: "ekipni rezultat", rounds: "runde",
    live: "UŽIVO", autoRefresh: "Automatsko osvježavanje", team: "Ekipa", total: "Ukupno",
    empty: "Rezultati će se pojaviti nakon prvog unosa.", admin: "Administracija", language: "Jezik",
  },
  en: {
    results: "Results", scoring: "Enter scores", presented: "Lagoda Disc Golf presents",
    intro: "Four players. One disc in play. Sixteen holes for the perfect team strategy.",
    follow: "Follow results", flightLogin: "Flight login", format: "TOURNAMENT FORMAT",
    formatLine: "4 players · 16 holes", teamScore: "team score", rounds: "rounds",
    live: "LIVE", autoRefresh: "Refreshes automatically", team: "Team", total: "Total",
    empty: "Results will appear after the first score is entered.", admin: "Administration", language: "Language",
  },
} as const;

type Language = keyof typeof copy;

export default function HomeClient({ leaderboard }: { leaderboard: LeaderTeam[] }) {
  const [language, setLanguage] = useState<Language>("hr");
  useEffect(() => { const saved = localStorage.getItem("lts-language"); if (saved === "hr" || saved === "en") setLanguage(saved); }, []);
  function switchLanguage(next: Language) { setLanguage(next); localStorage.setItem("lts-language", next); document.documentElement.lang = next; }
  const t = copy[language];

  return <main>
    <header className="nav shell">
      <Link href="/" className="brand"><Image src="/lagoda-logo.jpg" alt="Lagoda Disc Golf" width={52} height={52}/><span>TEAM<br/><b>SHOWDOWN</b></span></Link>
      <nav>
        <Link href="#rezultati">{t.results}</Link>
        <label className="languageSelect"><Languages size={16}/><span className="srOnly">{t.language}</span><select value={language} onChange={e=>switchLanguage(e.target.value as Language)} aria-label={t.language}><option value="hr">HR</option><option value="en">EN</option></select></label>
        <Link href="/scoring" className="btn small">{t.scoring}</Link>
      </nav>
    </header>

    <section className="hero"><div className="shell heroGrid">
      <div><span className="eyebrow">{t.presented}</span><h1>Lagoda Team<br/><em>Showdown 2026</em></h1><p>{t.intro}</p><div className="heroActions"><Link href="#rezultati" className="btn">{t.follow} <ArrowRight size={18}/></Link><Link href="/scoring" className="textLink">{t.flightLogin}</Link></div></div>
      <div className="scoreCard"><div className="cardTop"><span>{t.format}</span><Target/></div><strong>4 × 16</strong><p>{t.formatLine}</p><div className="miniStats"><div><Users/><b>1</b><span>{t.teamScore}</span></div><div><Trophy/><b>3</b><span>{t.rounds}</span></div></div></div>
    </div></section>

    <section id="rezultati" className="shell section">
      <div className="sectionTitle"><div><span className="eyebrow">{t.live}</span><h2>Leaderboard</h2></div><span className="live"><i/> {t.autoRefresh}</span></div>
      <div className="leaderboard">
        <div className="leaderHead"><span>#</span><span>{t.team}</span><span>R1</span><span>R2</span><span>R3</span><span>{t.total}</span><span>± Par</span></div>
        {leaderboard.map((team,i)=><div className="leaderRow" key={team.id}><span className={`rank r${i+1}`}>{i+1}</span><span className="teamName"><b>{team.name}</b><small>{team.players.join(" · ")}</small></span>{team.rounds.map((score,n)=><span key={n}>{score??"—"}</span>)}<strong>{team.total||"—"}</strong><span className={team.toPar<0?"under":team.toPar>0?"over":""}>{team.total?(team.toPar>0?`+${team.toPar}`:team.toPar):"—"}</span></div>)}
        {!leaderboard.length&&<div className="empty">{t.empty}</div>}
      </div>
    </section>
    <footer><div className="shell"><span>Lagoda Team Showdown 2026</span><Link href="/admin">{t.admin}</Link></div></footer>
  </main>;
}
