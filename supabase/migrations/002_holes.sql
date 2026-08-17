create table if not exists holes (
  number int primary key check (number between 1 and 16),
  par int not null default 3 check (par between 1 and 9),
  updated_at timestamptz not null default now()
);

insert into holes(number, par)
select number, 3 from generate_series(1, 16) as number
on conflict (number) do nothing;

alter table holes enable row level security;
notify pgrst, 'reload schema';
