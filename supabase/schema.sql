-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Apartments table
create table public.apartments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description_en text,
  description_al text,
  area_m2 integer,
  bedrooms integer,
  bathrooms integer,
  distance_to_sea integer,
  amenities text[] default '{}',
  photos text[] default '{}',
  is_published boolean default false,
  created_at timestamp with time zone default now()
);

-- Contact submissions table
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

-- Row Level Security
alter table public.apartments enable row level security;
alter table public.contacts enable row level security;

-- Public can read published apartments
create policy "Public can view published apartments"
  on public.apartments for select
  using (is_published = true);

-- Authenticated users (admin) can do everything with apartments
create policy "Admin full access to apartments"
  on public.apartments for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Authenticated users can read contacts
create policy "Admin can view contacts"
  on public.contacts for select
  using (auth.role() = 'authenticated');

-- Anyone can insert contacts (public form)
create policy "Anyone can submit contact form"
  on public.contacts for insert
  with check (true);

-- Create storage bucket for apartment photos
insert into storage.buckets (id, name, public)
values ('apartments', 'apartments', true);

-- Allow public read access to apartment photos
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'apartments');

-- Allow authenticated users to upload/delete photos
create policy "Admin upload access"
  on storage.objects for insert
  with check (bucket_id = 'apartments' and auth.role() = 'authenticated');

create policy "Admin delete access"
  on storage.objects for delete
  using (bucket_id = 'apartments' and auth.role() = 'authenticated');

-- Seed data: 4 sample apartments for development
insert into public.apartments (name, slug, description_en, description_al, area_m2, bedrooms, bathrooms, distance_to_sea, amenities, photos, is_published) values
(
  'The Horizon Suite',
  'the-horizon-suite',
  'Unobstructed panoramic views of the Adriatic, featuring a wrap-around terrace and premium Italian furnishings. The open-plan living area seamlessly integrates with the dining space.',
  'Pamje panoramike e papenguar e Adriatikut, me tarracë rrethore dhe mobilje premium italiane. Zona e jetesës me plan të hapur integrohet pa probleme me hapësirën e ngrënies.',
  120, 3, 2, 20,
  ARRAY['Ocean View Balcony', 'High-Speed Wi-Fi', 'Fully Equipped Kitchen', 'Air Conditioning', 'Smart TV', 'Free Parking', 'Washing Machine', 'Beach Access'],
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'https://images.unsplash.com/photo-1560185127-6a8c6c5f6e7a?w=1200'],
  true
),
(
  'Azure Studio',
  'azure-studio',
  'Perfect for couples, minimalist design with floor-to-ceiling windows and a private balcony overlooking the marina. Compact yet luxurious.',
  'Perfekte për çifte, dizajn minimalist me dritare nga dyshemeja deri në tavan dhe ballkon privat me pamje nga marina. Kompakte por luksoze.',
  55, 1, 1, 50,
  ARRAY['Sea View', 'Wi-Fi', 'Kitchenette', 'Air Conditioning', 'Smart TV', 'Beach Access'],
  ARRAY['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200', 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=1200'],
  true
),
(
  'Coral Beach Loft',
  'coral-beach-loft',
  'A bright, airy loft steps from the sand. Open-concept living with a mezzanine sleeping area and full kitchen. Ideal for beach lovers.',
  'Një loft i ndritshëm dhe i ajrosur, disa hapa nga rëra. Jetesë me koncept të hapur me zonë gjumi në mezaninë dhe kuzhinë të plotë. Ideale për dashuruesit e plazhit.',
  65, 1, 1, 10,
  ARRAY['Beachfront', 'Wi-Fi', 'Full Kitchen', 'Air Conditioning', 'Terrace', 'Beach Access', 'Washing Machine'],
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200'],
  true
),
(
  'Sunset Bay Apartment',
  'sunset-bay-apartment',
  'Spacious two-bedroom apartment with stunning sunset views over the bay. Features a large terrace, modern kitchen, and elegant living area.',
  'Apartament i gjerë me dy dhoma gjumi me pamje mahnitëse të perëndimit të diellit mbi gjirin. Ka një tarracë të madhe, kuzhinë moderne dhe zonë elegante jetese.',
  95, 2, 1, 100,
  ARRAY['Bay View', 'Large Terrace', 'Wi-Fi', 'Full Kitchen', 'Air Conditioning', 'Smart TV', 'Free Parking', 'Washing Machine'],
  ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200'],
  true
);
