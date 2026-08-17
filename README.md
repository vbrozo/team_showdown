# Lagoda Team Showdown 2026

Web aplikacija za javni leaderboard, administraciju ekipa i flightova te mobilni unos rezultata.

## Pokretanje

1. Napravite Supabase projekt.
2. U Supabase SQL Editoru pokrenite `supabase/migrations/001_initial.sql`.
3. Kopirajte `.env.example` u `.env.local` i unesite vrijednosti.
4. Pokrenite `npm install` i `npm run dev`.

Za Vercel iste vrijednosti dodajte u Project Settings → Environment Variables. `SESSION_SECRET` treba biti duga nasumična vrijednost, a `ADMIN_PASSWORD` lozinka organizatora.

## Funkcije

- javni leaderboard za tri runde
- 16 staza, sve par 3
- četiri člana po ekipi
- automatsko slaganje dvije ekipe po flightu
- odvojena šifra za svaki flight i rundu
- unos ukupnog skora i početnog bacača
- administratorski pregled i povijest promjena rezultata
