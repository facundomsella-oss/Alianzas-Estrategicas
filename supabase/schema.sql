-- supabase/schema.sql
-- Esquema para el juego "ALIANZAS".
-- Uso: en Supabase > SQL Editor > New query > pegar > Run.
-- El archivo usa create or replace y add column if not exists: se puede volver a correr.

create extension if not exists pgcrypto;

create table if not exists public.contactos (
  id                      bigint generated always as identity primary key,
  email                   text not null unique,
  nombre                  text not null default '',
  celular                 text not null default '',
  nro_grupo               text not null default '',
  distrito                text not null default '',
  zona                    text not null default '',
  nro_afiliado            text not null default '',
  consentimiento          boolean not null default true,
  version_consentimiento  text not null default 'v1',
  origen                  text not null default 'juego-alianzas',
  creado_en               timestamptz not null default now(),
  actualizado_en          timestamptz not null default now()
);

alter table public.contactos add column if not exists nombre text not null default '';
alter table public.contactos add column if not exists celular text not null default '';
alter table public.contactos add column if not exists nro_grupo text not null default '';
alter table public.contactos add column if not exists distrito text not null default '';
alter table public.contactos add column if not exists zona text not null default '';
alter table public.contactos add column if not exists nro_afiliado text not null default '';

create table if not exists public.partidas (
  id                bigint generated always as identity primary key,
  creado_en         timestamptz not null default now(),
  recurso           text not null default 'rover',
  nombre            text not null,
  email             text not null references public.contactos (email) on update cascade,
  puntaje           integer not null check (puntaje >= 0),
  puntos_decision   integer not null default 0,
  puntaje_maximo    integer not null,
  porcentaje        numeric(5,2) not null,
  rango             text not null,
  decisiones        jsonb not null default '[]'::jsonb,
  estadisticas      jsonb not null default '{}'::jsonb
);

alter table public.partidas add column if not exists recurso text not null default 'rover';

create index if not exists partidas_recurso_puntaje_idx on public.partidas (recurso, puntaje desc, creado_en asc);
create index if not exists partidas_email_idx on public.partidas (email, recurso);
create index if not exists contactos_grupo_idx on public.contactos (nro_grupo, distrito);

alter table public.contactos enable row level security;
alter table public.partidas enable row level security;

drop policy if exists "partidas_publico" on public.partidas;
drop policy if exists "contactos_publico" on public.contactos;

revoke all on table public.contactos from anon, authenticated;
revoke all on table public.partidas from anon, authenticated;

create or replace function public.upsert_contacto(
  p_nombre text,
  p_email text,
  p_celular text,
  p_nro_grupo text,
  p_distrito text,
  p_zona text,
  p_nro_afiliado text,
  p_consentimiento boolean
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
begin
  if p_consentimiento is not true then
    raise exception 'Se requiere consentimiento para guardar los datos';
  end if;
  if length(trim(coalesce(p_nombre, ''))) < 2 then
    raise exception 'Nombre demasiado corto';
  end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$' then
    raise exception 'Mail con formato inválido';
  end if;
  if trim(coalesce(p_celular, '')) <> ''
     and length(regexp_replace(trim(p_celular), '[^0-9]', '', 'g')) < 8 then
    raise exception 'Celular demasiado corto';
  end if;
  if trim(coalesce(p_nro_grupo, '')) !~ '^[0-9]{1,4}$' then
    raise exception 'Número de grupo inválido';
  end if;
  if trim(coalesce(p_distrito, '')) !~ '^[0-9]{1,3}$'
     or trim(p_distrito)::int < 1 or trim(p_distrito)::int > 100 then
    raise exception 'El distrito tiene que ser un número entre 1 y 100';
  end if;
  if trim(coalesce(p_zona, '')) !~ '^[0-9]{1,3}$'
     or trim(p_zona)::int < 1 or trim(p_zona)::int > 100 then
    raise exception 'La zona tiene que ser un número entre 1 y 100';
  end if;
  if trim(coalesce(p_nro_afiliado, '')) !~ '^[0-9]{6,9}$' then
    raise exception 'Número de afiliado inválido';
  end if;

  insert into public.contactos (
    email, nombre, celular, nro_grupo, distrito, zona, nro_afiliado, consentimiento
  )
  values (
    v_email,
    trim(p_nombre),
    trim(coalesce(p_celular, '')),
    trim(coalesce(p_nro_grupo, '')),
    trim(coalesce(p_distrito, '')),
    trim(coalesce(p_zona, '')),
    trim(coalesce(p_nro_afiliado, '')),
    true
  )
  on conflict (email) do update
    set nombre = excluded.nombre,
        celular = excluded.celular,
        nro_grupo = excluded.nro_grupo,
        distrito = excluded.distrito,
        zona = excluded.zona,
        nro_afiliado = excluded.nro_afiliado,
        actualizado_en = now();

  return v_email;
end;
$$;

create or replace function public.registrar_contacto(
  p_nombre text,
  p_email text,
  p_celular text,
  p_nro_grupo text,
  p_distrito text,
  p_zona text,
  p_nro_afiliado text,
  p_consentimiento boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := public.upsert_contacto(
    p_nombre, p_email, p_celular, p_nro_grupo, p_distrito, p_zona, p_nro_afiliado, p_consentimiento
  );
  return jsonb_build_object('email', v_email, 'guardado', true);
end;
$$;

create or replace function public.registrar_partida(
  p_nombre text,
  p_email text,
  p_celular text,
  p_nro_grupo text,
  p_distrito text,
  p_zona text,
  p_nro_afiliado text,
  p_consentimiento boolean,
  p_recurso text,
  p_puntaje integer,
  p_puntos_decision integer,
  p_puntaje_maximo integer,
  p_porcentaje numeric,
  p_rango text,
  p_decisiones jsonb,
  p_estadisticas jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_recurso text;
  v_puesto integer;
  v_total bigint;
  v_ya bigint;
begin
  v_recurso := lower(trim(coalesce(p_recurso, 'rover')));
  if v_recurso not in ('rover', 'educador', 'distrito') then
    raise exception 'Aventura desconocida';
  end if;
  if p_puntaje is null or p_puntaje_maximo is null or p_puntaje_maximo <= 0 then
    raise exception 'Puntaje inválido';
  end if;

  v_email := public.upsert_contacto(
    p_nombre, p_email, p_celular, p_nro_grupo, p_distrito, p_zona, p_nro_afiliado, p_consentimiento
  );

  -- Solo cuenta la primera partida de cada persona en cada aventura.
  select count(*) into v_ya from public.partidas where email = v_email and recurso = v_recurso;
  if v_ya > 0 then
    select count(*) into v_total from public.partidas where recurso = v_recurso;
    select count(*) + 1 into v_puesto
      from public.partidas
     where recurso = v_recurso
       and puntaje > (select puntaje from public.partidas
                       where email = v_email and recurso = v_recurso
                       order by creado_en asc limit 1);
    return jsonb_build_object(
      'puesto', v_puesto,
      'total', v_total,
      'guardado', false,
      'recurso', v_recurso
    );
  end if;

  insert into public.partidas (
    recurso, nombre, email, puntaje, puntos_decision, puntaje_maximo, porcentaje, rango, decisiones, estadisticas
  )
  values (
    v_recurso,
    trim(p_nombre),
    v_email,
    p_puntaje,
    coalesce(p_puntos_decision, 0),
    p_puntaje_maximo,
    coalesce(p_porcentaje, 0),
    coalesce(p_rango, 'Sin rango'),
    coalesce(p_decisiones, '[]'::jsonb),
    coalesce(p_estadisticas, '{}'::jsonb)
  );

  select count(*) into v_total from public.partidas where recurso = v_recurso;
  select count(*) + 1 into v_puesto from public.partidas
   where recurso = v_recurso and puntaje > p_puntaje;

  return jsonb_build_object(
    'puesto', v_puesto,
    'total', v_total,
    'guardado', true,
    'recurso', v_recurso
  );
end;
$$;

create or replace function public.obtener_ranking(p_limite integer default 50, p_recurso text default 'rover')
returns table (
  puesto bigint,
  nombre text,
  puntaje integer,
  porcentaje numeric,
  rango text,
  creado_en timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  with ordenado as (
    select
      p.nombre,
      p.puntaje,
      p.porcentaje,
      p.rango,
      p.creado_en,
      rank() over (order by p.puntaje desc) as puesto
    from public.partidas p
    where p.recurso = lower(trim(coalesce(p_recurso, 'rover')))
  )
  select
    o.puesto,
    o.nombre,
    o.puntaje,
    o.porcentaje,
    o.rango,
    o.creado_en
  from ordenado o
  order by o.puesto asc, o.creado_en asc
  limit greatest(1, least(coalesce(p_limite, 50), 200));
$$;

create or replace function public.obtener_mi_puesto(p_email text, p_recurso text default 'rover')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_recurso text := lower(trim(coalesce(p_recurso, 'rover')));
  v_total bigint;
  v_puesto bigint;
  v_puntaje integer;
  v_porcentaje numeric;
  v_rango text;
begin
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$' then
    return null;
  end if;

  select count(*) into v_total from public.partidas where recurso = v_recurso;

  select p.puntaje, p.porcentaje, p.rango
    into v_puntaje, v_porcentaje, v_rango
    from public.partidas p
    where p.email = v_email and p.recurso = v_recurso
    order by p.creado_en desc
    limit 1;

  if v_puntaje is null then
    return null;
  end if;

  select count(*) + 1 into v_puesto from public.partidas
   where recurso = v_recurso and puntaje > v_puntaje;

  return jsonb_build_object(
    'puesto', v_puesto,
    'total', v_total,
    'puntaje', v_puntaje,
    'porcentaje', v_porcentaje,
    'rango', v_rango
  );
end;
$$;

revoke all on function public.upsert_contacto(text, text, text, text, text, text, text, boolean) from public;
revoke all on function public.registrar_contacto(text, text, text, text, text, text, text, boolean) from public;
revoke all on function public.registrar_partida(text, text, text, text, text, text, text, boolean, text, integer, integer, integer, numeric, text, jsonb, jsonb) from public;
revoke all on function public.obtener_ranking(integer, text) from public;
revoke all on function public.obtener_mi_puesto(text, text) from public;

grant execute on function public.registrar_contacto(text, text, text, text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.registrar_partida(text, text, text, text, text, text, text, boolean, text, integer, integer, integer, numeric, text, jsonb, jsonb) to anon, authenticated;
grant execute on function public.obtener_ranking(integer, text) to anon, authenticated;
grant execute on function public.obtener_mi_puesto(text, text) to anon, authenticated;
