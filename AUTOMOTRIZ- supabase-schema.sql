-- ============================================================================
-- ESQUEMA DE BASE DE DATOS - CATÁLOGO DE VEHÍCULOS
-- ============================================================================
-- Proyecto: Catálogo Hyundai/JMC/RAM
-- Base de datos: PostgreSQL (Supabase)
-- Fecha: 2025-12-20
-- ============================================================================

-- ============================================================================
-- EXTENSIONES
-- ============================================================================

-- Habilitar extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLAS BASE (sin dependencias)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabla: fuel_types (Tipos de combustible)
-- ----------------------------------------------------------------------------
CREATE TABLE fuel_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    slug text UNIQUE NOT NULL,
    icon_name text,
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fuel_types_slug ON fuel_types(slug);

COMMENT ON TABLE fuel_types IS 'Catálogo de tipos de combustible';

-- ----------------------------------------------------------------------------
-- Tabla: categories (Categorías de vehículos)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    icon_url text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_is_active ON categories(is_active);

COMMENT ON TABLE categories IS 'Categorías de vehículos (SUV, Sedán, Hatchback, etc.)';

-- ----------------------------------------------------------------------------
-- Tabla: brands (Marcas de vehículos)
-- ----------------------------------------------------------------------------
CREATE TABLE brands (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    slug text UNIQUE NOT NULL,
    logo_url text,
    description text,
    website_url text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_display_order ON brands(display_order);
CREATE INDEX idx_brands_is_active ON brands(is_active);

COMMENT ON TABLE brands IS 'Marcas de vehículos (Hyundai, JMC, RAM, etc.)';

-- ----------------------------------------------------------------------------
-- Tabla: colors (Catálogo global de colores)
-- ----------------------------------------------------------------------------
CREATE TABLE colors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    hex_code text,
    color_family text,
    is_metallic boolean DEFAULT false,
    is_premium boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_colors_slug ON colors(slug);
CREATE INDEX idx_colors_family ON colors(color_family);

COMMENT ON TABLE colors IS 'Catálogo global de colores disponibles para todos los vehículos';

-- ============================================================================
-- TABLA DE USUARIOS (referencia a auth.users de Supabase)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabla: users (Perfiles de usuarios administradores)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    role text CHECK (role IN ('administrador', 'personal')) DEFAULT 'personal' NOT NULL,
    is_active boolean DEFAULT true,
    last_login_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

COMMENT ON TABLE users IS 'Perfiles extendidos de usuarios administradores del sistema';
COMMENT ON COLUMN users.role IS 'administrador: acceso total | personal: puede crear/editar pero no eliminar';

-- ============================================================================
-- TABLAS DE VEHÍCULOS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabla: cars (Vehículos principales)
-- ----------------------------------------------------------------------------
CREATE TABLE cars (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id uuid REFERENCES brands(id) ON DELETE RESTRICT,
    category_id uuid REFERENCES categories(id) ON DELETE RESTRICT,
    fuel_type_id uuid REFERENCES fuel_types(id) ON DELETE RESTRICT,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    year integer NOT NULL,
    price_usd numeric(10,2) NOT NULL,
    price_pen numeric(10,2) NOT NULL,
    image_url text NOT NULL,
    image_frontal_url text,
    description text,
    highlights text[],
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id)
);

CREATE INDEX idx_cars_brand_id ON cars(brand_id);
CREATE INDEX idx_cars_category_id ON cars(category_id);
CREATE INDEX idx_cars_fuel_type_id ON cars(fuel_type_id);
CREATE INDEX idx_cars_slug ON cars(slug);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_is_active ON cars(is_active);
CREATE INDEX idx_cars_is_featured ON cars(is_featured);

COMMENT ON TABLE cars IS 'Vehículos principales del catálogo';
COMMENT ON COLUMN cars.is_featured IS 'Si está marcado como destacado para homepage';

-- ----------------------------------------------------------------------------
-- Tabla: versions (Versiones de modelos)
-- ----------------------------------------------------------------------------
CREATE TABLE versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
    name text NOT NULL,
    slug text NOT NULL,
    short_description text,
    full_description text,
    price_usd numeric(10,2),
    price_pen numeric(10,2),
    highlights text[],
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id),
    CONSTRAINT unique_car_version_slug UNIQUE (car_id, slug)
);

CREATE INDEX idx_versions_car_id ON versions(car_id);
CREATE INDEX idx_versions_display_order ON versions(display_order);
CREATE INDEX idx_versions_is_active ON versions(is_active);

COMMENT ON TABLE versions IS 'Versiones de cada modelo de vehículo (Limited, Sport, Premium, etc.)';

-- ----------------------------------------------------------------------------
-- Tabla: version_colors (Relación versión-color)
-- ----------------------------------------------------------------------------
CREATE TABLE version_colors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id uuid REFERENCES versions(id) ON DELETE CASCADE,
    color_id uuid REFERENCES colors(id) ON DELETE RESTRICT,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_version_color UNIQUE (version_id, color_id)
);

CREATE INDEX idx_version_colors_version_id ON version_colors(version_id);
CREATE INDEX idx_version_colors_color_id ON version_colors(color_id);

COMMENT ON TABLE version_colors IS 'Relación muchos a muchos entre versiones y colores';
COMMENT ON COLUMN version_colors.is_default IS 'Marca el color por defecto para esta versión';

-- ----------------------------------------------------------------------------
-- Tabla: color_images (Galería de imágenes por color)
-- ----------------------------------------------------------------------------
CREATE TABLE color_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    version_color_id uuid REFERENCES version_colors(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    image_type text,
    display_order integer DEFAULT 0,
    alt_text text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_color_images_version_color_id ON color_images(version_color_id);
CREATE INDEX idx_color_images_display_order ON color_images(display_order);

COMMENT ON TABLE color_images IS 'Galería de imágenes de cada versión-color (exterior, interior, detalles, 360°)';

-- ============================================================================
-- SISTEMA DE BANNERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Tabla: hero_banners (Carousel de homepage)
-- ----------------------------------------------------------------------------
CREATE TABLE hero_banners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
    title text NOT NULL,
    subtitle text,
    description text,
    image_url text,
    image_mobile_url text,
    background_color text DEFAULT '#020617',
    text_color text DEFAULT 'white',
    cta_primary_text text DEFAULT 'Ver Catálogo Completo',
    cta_primary_link text DEFAULT '#modelos',
    cta_secondary_text text DEFAULT 'Quiero cotizar',
    cta_secondary_link text DEFAULT '#contacto',
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    start_date timestamptz,
    end_date timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id)
);

CREATE INDEX idx_hero_banners_car_id ON hero_banners(car_id);
CREATE INDEX idx_hero_banners_display_order ON hero_banners(display_order);
CREATE INDEX idx_hero_banners_is_active ON hero_banners(is_active);
CREATE INDEX idx_hero_banners_dates ON hero_banners(start_date, end_date);

COMMENT ON TABLE hero_banners IS 'Banners del carousel rotativo en la página principal';
COMMENT ON COLUMN hero_banners.car_id IS 'Puede ser NULL para banners promocionales sin auto específico';

-- ----------------------------------------------------------------------------
-- Tabla: model_detail_banners (Banner de página de detalle)
-- ----------------------------------------------------------------------------
CREATE TABLE model_detail_banners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    car_id uuid UNIQUE REFERENCES cars(id) ON DELETE CASCADE,
    hero_image_url text,
    hero_mobile_url text,
    background_color text DEFAULT '#0b1d35',
    text_color text DEFAULT 'white',
    custom_title text,
    custom_description text,
    show_price_badge boolean DEFAULT true,
    show_fuel_badge boolean DEFAULT true,
    show_category_badge boolean DEFAULT true,
    show_year_badge boolean DEFAULT true,
    show_versions_badge boolean DEFAULT true,
    custom_badges jsonb,
    highlight_features text[],
    cta_text text DEFAULT 'Ir a Contacto',
    cta_link text DEFAULT '/#contacto',
    cta_phone_text text DEFAULT 'Llamar',
    cta_phone_number text DEFAULT '+51944532822',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES users(id),
    updated_by uuid REFERENCES users(id)
);

CREATE INDEX idx_model_detail_banners_car_id ON model_detail_banners(car_id);
CREATE INDEX idx_model_detail_banners_is_active ON model_detail_banners(is_active);

COMMENT ON TABLE model_detail_banners IS 'Banner hero personalizado para cada página de detalle de modelo';
COMMENT ON COLUMN model_detail_banners.car_id IS 'Relación 1:1 con cars (cada auto tiene máximo 1 banner de detalle)';
COMMENT ON COLUMN model_detail_banners.custom_badges IS 'Badges personalizados en formato JSON: [{"icon": "Award", "text": "SUV del Año"}]';

-- ============================================================================
-- TRIGGERS PARA ACTUALIZAR updated_at
-- ============================================================================

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colors_updated_at BEFORE UPDATE ON colors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_versions_updated_at BEFORE UPDATE ON versions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_version_colors_updated_at BEFORE UPDATE ON version_colors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_color_images_updated_at BEFORE UPDATE ON color_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_banners_updated_at BEFORE UPDATE ON hero_banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_detail_banners_updated_at BEFORE UPDATE ON model_detail_banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_types_updated_at BEFORE UPDATE ON fuel_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER PARA AUTO-CREAR USUARIO EN public.users
-- ============================================================================

-- Función que se ejecuta cuando se crea un usuario en auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'personal' -- Por defecto es personal, un admin debe cambiar el rol
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Políticas básicas
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE fuel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE version_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_detail_banners ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Políticas: Lectura pública (para el catálogo público)
-- ----------------------------------------------------------------------------

-- fuel_types: lectura pública
CREATE POLICY "fuel_types_select_public" ON fuel_types
    FOR SELECT USING (true);

-- categories: solo categorías activas son públicas
CREATE POLICY "categories_select_public" ON categories
    FOR SELECT USING (is_active = true);

-- brands: solo marcas activas son públicas
CREATE POLICY "brands_select_public" ON brands
    FOR SELECT USING (is_active = true);

-- colors: lectura pública
CREATE POLICY "colors_select_public" ON colors
    FOR SELECT USING (true);

-- cars: solo autos activos son públicos
CREATE POLICY "cars_select_public" ON cars
    FOR SELECT USING (is_active = true);

-- versions: solo versiones activas son públicas
CREATE POLICY "versions_select_public" ON versions
    FOR SELECT USING (is_active = true);

-- version_colors: lectura pública
CREATE POLICY "version_colors_select_public" ON version_colors
    FOR SELECT USING (true);

-- color_images: lectura pública
CREATE POLICY "color_images_select_public" ON color_images
    FOR SELECT USING (true);

-- hero_banners: solo banners activos y dentro de fechas
CREATE POLICY "hero_banners_select_public" ON hero_banners
    FOR SELECT USING (
        is_active = true AND
        (start_date IS NULL OR start_date <= now()) AND
        (end_date IS NULL OR end_date >= now())
    );

-- model_detail_banners: solo banners activos
CREATE POLICY "model_detail_banners_select_public" ON model_detail_banners
    FOR SELECT USING (is_active = true);

-- ----------------------------------------------------------------------------
-- Políticas: Administradores tienen acceso total
-- ----------------------------------------------------------------------------

-- Helper function para verificar si el usuario es administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'administrador' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function para verificar si el usuario está autenticado
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para administradores (acceso total)
CREATE POLICY "admin_all_categories" ON categories
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_brands" ON brands
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_colors" ON colors
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_cars" ON cars
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_versions" ON versions
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_version_colors" ON version_colors
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_color_images" ON color_images
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_hero_banners" ON hero_banners
    FOR ALL USING (is_admin());

CREATE POLICY "admin_all_model_detail_banners" ON model_detail_banners
    FOR ALL USING (is_admin());

-- ----------------------------------------------------------------------------
-- Políticas: Personal puede crear/editar (no eliminar)
-- ----------------------------------------------------------------------------

CREATE POLICY "personal_insert_cars" ON cars
    FOR INSERT WITH CHECK (is_authenticated());

CREATE POLICY "personal_update_cars" ON cars
    FOR UPDATE USING (is_authenticated());

CREATE POLICY "personal_insert_versions" ON versions
    FOR INSERT WITH CHECK (is_authenticated());

CREATE POLICY "personal_update_versions" ON versions
    FOR UPDATE USING (is_authenticated());

CREATE POLICY "personal_insert_colors" ON colors
    FOR INSERT WITH CHECK (is_authenticated());

CREATE POLICY "personal_insert_version_colors" ON version_colors
    FOR INSERT WITH CHECK (is_authenticated());

CREATE POLICY "personal_update_version_colors" ON version_colors
    FOR UPDATE USING (is_authenticated());

CREATE POLICY "personal_insert_color_images" ON color_images
    FOR INSERT WITH CHECK (is_authenticated());

CREATE POLICY "personal_update_color_images" ON color_images
    FOR UPDATE USING (is_authenticated());

-- ----------------------------------------------------------------------------
-- Políticas: Users (solo pueden ver su propio perfil)
-- ----------------------------------------------------------------------------

CREATE POLICY "users_select_own" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (id = auth.uid());

-- Administradores pueden ver y gestionar todos los usuarios
CREATE POLICY "admin_all_users" ON users
    FOR ALL USING (is_admin());

-- ============================================================================
-- COMENTARIOS FINALES Y NOTAS
-- ============================================================================

COMMENT ON DATABASE postgres IS 'Base de datos del catálogo de vehículos';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
--
-- INSTRUCCIONES DE USO:
-- 1. Copia todo este archivo
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega el contenido completo
-- 4. Haz clic en "Run"
-- 5. Verifica que todas las tablas se crearon correctamente
--
-- PRÓXIMOS PASOS:
-- 1. Configurar Supabase Storage para imágenes
-- 2. Instalar @supabase/supabase-js en el proyecto Next.js
-- 3. Crear cliente de Supabase
-- 4. Migrar datos hardcodeados a la base de datos
-- ============================================================================
