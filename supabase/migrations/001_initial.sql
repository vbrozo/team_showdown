create extension if not exists "pgcrypto";
create table teams (id uuid primary key default gen_random_uuid(), name text not null unique, rating numeric(8,2), active boolean not null default true, created_at timestamptz not null default now());
create table players (id uuid primary key default gen_random_uuid(), team_id uuid not null references teams(id) on delete cascade, name text not null, sort_order int not null default 0, active boolean not null default true);
create table flights (id uuid primary key default gen_random_uuid(), round_no int not null check(round_no between 1 and 3), name text not null, start_hole int not null check(start_hole between 1 and 16), access_code text not null unique, active boolean not null default true, created_at timestamptz not null default now());
create table flight_teams (flight_id uuid not null references flights(id) on delete cascade, team_id uuid not null references teams(id) on delete cascade, position int not null default 0, primary key(flight_id,team_id));
create table hole_scores (id uuid primary key default gen_random_uuid(), team_id uuid not null references teams(id), flight_id uuid not null references flights(id), round_no int not null check(round_no between 1 and 3), hole_no int not null check(hole_no between 1 and 16), strokes int not null check(strokes>0), opener_id uuid not null references players(id), updated_at timestamptz not null default now(), unique(team_id,round_no,hole_no));
create table audit_log (id bigint generated always as identity primary key, created_at timestamptz not null default now(), action text not null, flight_id uuid, team_id uuid, payload jsonb not null default '{}'::jsonb);
create index hole_scores_live_idx on hole_scores(round_no,team_id,hole_no);
alter table teams enable row level security; alter table players enable row level security; alter table flights enable row level security; alter table flight_teams enable row level security; alter table hole_scores enable row level security; alter table audit_log enable row level security;

with t as (insert into teams(name,rating) values ('DGK Stubaki',875),('Naziv ekipe naknadno',872.25),('Futur egzaktni',742.75) returning id,name)
insert into players(team_id,name,sort_order)
select id,p.name,p.n from t cross join lateral (values
 (case name when 'DGK Stubaki' then 'Tomislav' when 'Naziv ekipe naknadno' then 'Tilen' else 'Branimir' end,1),
 (case name when 'DGK Stubaki' then 'Anđelko' when 'Naziv ekipe naknadno' then 'Mario' else 'Sanja' end,2),
 (case name when 'DGK Stubaki' then 'Mario' when 'Naziv ekipe naknadno' then 'Barbara' else 'Ljubo' end,3),
 (case name when 'DGK Stubaki' then 'Tina' when 'Naziv ekipe naknadno' then 'Marko' else 'Ivan' end,4)
) as p(name,n);
