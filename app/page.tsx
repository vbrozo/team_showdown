import { Trophy, Users, Target, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLeaderboard } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const leaderboard = await getLeaderboard();
  return (
    <main>
      <header className="nav shell">
        <Link href="/" className="brand"><Image src="/lagoda-logo.jpg" alt="Lagoda Disc Golf" width={52} height={52} /><span>TEAM<br/><b>SHOWDOWN</b></span></Link>
        <nav><Link href="#rezultati">Rezultati</Link><Link href="/scoring" className="btn small">Unos rezultata</Link></nav>
      </header>

      <section className="hero">
        <div className="shell heroGrid">
          <div><span className="eyebrow">Lagoda Disc Golf predstavlja</span><h1>Lagoda Team<br/><em>Showdown 2026</em></h1><p>Četiri igrača. Jedan disk u igri. Šesnaest staza za savršenu timsku taktiku.</p><div className="heroActions"><Link href="#rezultati" className="btn">Prati rezultate <ArrowRight size={18}/></Link><Link href="/scoring" className="textLink">Prijava flighta</Link></div></div>
          <div className="scoreCard"><div className="cardTop"><span>FORMAT TURNIRA</span><Target/></div><strong>4 × 16</strong><p>4 igrača · 16 staza · sve par 3</p><div className="miniStats"><div><Users/><b>2</b><span>ekipe po flightu</span></div><div><Trophy/><b>3</b><span>runde</span></div></div></div>
        </div>
      </section>

      <section id="rezultati" className="shell section">
        <div className="sectionTitle"><div><span className="eyebrow">UŽIVO</span><h2>Leaderboard</h2></div><span className="live"><i/> Automatsko osvježavanje</span></div>
        <div className="leaderboard">
          <div className="leaderHead"><span>#</span><span>Ekipa</span><span>R1</span><span>R2</span><span>R3</span><span>Ukupno</span><span>± Par</span></div>
          {leaderboard.map((team, i) => <div className="leaderRow" key={team.id}><span className={`rank r${i+1}`}>{i+1}</span><span className="teamName"><b>{team.name}</b><small>{team.players.join(" · ")}</small></span>{team.rounds.map((score, n)=><span key={n}>{score ?? "—"}</span>)}<strong>{team.total || "—"}</strong><span className={team.toPar < 0 ? "under" : team.toPar > 0 ? "over" : ""}>{team.total ? (team.toPar > 0 ? `+${team.toPar}` : team.toPar) : "—"}</span></div>)}
          {!leaderboard.length && <div className="empty">Rezultati će se pojaviti nakon prvog unosa.</div>}
        </div>
      </section>

      <footer><div className="shell"><span>Lagoda Team Showdown 2026</span><Link href="/admin">Administracija</Link></div></footer>
    </main>
  );
}
