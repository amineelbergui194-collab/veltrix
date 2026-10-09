-- ==============================================================================
-- VELTRIX TECH - PRODUCTION DATABASE SCHEMA & MIGRATION SÉCURISÉE
-- Script auto-réparateur : fonctionne que les tables existent déjà ou non.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table des profils utilisateurs (profiles)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  tier TEXT DEFAULT 'Obsidian Insider',
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir la présence de toutes les colonnes si la table existait déjà
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Obsidian Insider';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs peuvent consulter leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent consulter leur propre profil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Insertion de profil autorisée pour le propriétaire" ON public.profiles;
CREATE POLICY "Insertion de profil autorisée pour le propriétaire"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Table des commandes (orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  provider_order_id TEXT,
  provider_payment_id TEXT,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'MAD',
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  receipt_url TEXT,
  idempotency_key TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GARANTIR que toutes les colonnes requises existent même si la table orders existait déjà
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'stripe';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MAD';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Contrainte d'unicité sur provider_payment_id (évite les doublons de capture)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_provider_payment_id_key'
  ) THEN
    ALTER TABLE public.orders ADD CONSTRAINT orders_provider_payment_id_key UNIQUE (provider_payment_id);
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Index sur orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider_payment_id ON public.orders(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- RLS sur orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs voient uniquement leurs commandes" ON public.orders;
CREATE POLICY "Les utilisateurs voient uniquement leurs commandes"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Création de commande autorisée pour utilisateur connecté ou invité" ON public.orders;
CREATE POLICY "Création de commande autorisée pour utilisateur connecté ou invité"
  ON public.orders FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- ------------------------------------------------------------------------------
-- 3. Table des articles de commande (order_items)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  color_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir la présence des colonnes sur order_items
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_id TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS color_name TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Index sur order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- RLS sur order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Les utilisateurs voient les articles de leurs propres commandes" ON public.order_items;
CREATE POLICY "Les utilisateurs voient les articles de leurs propres commandes"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Insertion d'articles autorisée pour commande liée" ON public.order_items;
CREATE POLICY "Insertion d'articles autorisée pour commande liée"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

-- ------------------------------------------------------------------------------
-- 4. Synchronisation automatique des utilisateurs (auth.users -> profiles)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
