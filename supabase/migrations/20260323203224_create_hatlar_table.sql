/*
  # Midye Üretim Takip Sistemi - Hatlar Tablosu

  1. Yeni Tablo
    - `hatlar` - Midye üretim hatlarını takip eder
      - `id` (uuid, primary key) - Benzersiz hat ID'si
      - `hat_adi` (text, not null) - Hat adı (örn: A1, A2, B1)
      - `blok` (text, not null) - Blok (A, B, C, D, E, F)
      - `halat_metresi` (integer, not null) - Halat uzunluğu (metre)
      - `metrede_midye` (numeric, not null) - Metrede midye miktarı (kg)
      - `ekim_tarihi` (date, not null) - Ekim tarihi
      - `yavru_orani` (numeric, not null, default 0) - Yavru midye oranı (%)
      - `hedef_kg` (numeric, nullable) - Hedef hasat kg (opsiyonel)
      - `created_at` (timestamptz) - Oluşturulma tarihi
      - `updated_at` (timestamptz) - Güncellenme tarihi

  2. Güvenlik
    - RLS etkinleştirildi
    - Herkes okuyabilir (SELECT)
    - Herkes ekleyebilir (INSERT)
    - Herkes güncelleyebilir (UPDATE)
    - Herkes silebilir (DELETE)
    
  3. Notlar
    - Blok değerleri A-F arasında olmalı
    - Halat metresi maksimum 2000 metre
    - Tüm hesaplamalar uygulama tarafında yapılacak
*/

CREATE TABLE IF NOT EXISTS hatlar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hat_adi text NOT NULL,
  blok text NOT NULL CHECK (blok IN ('A', 'B', 'C', 'D', 'E', 'F')),
  halat_metresi integer NOT NULL CHECK (halat_metresi > 0 AND halat_metresi <= 2000),
  metrede_midye numeric(10, 2) NOT NULL CHECK (metrede_midye >= 0),
  ekim_tarihi date NOT NULL,
  yavru_orani numeric(5, 2) NOT NULL DEFAULT 0 CHECK (yavru_orani >= 0 AND yavru_orani <= 100),
  hedef_kg numeric(10, 2) CHECK (hedef_kg IS NULL OR hedef_kg > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hatlar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes hatlari gorebilir"
  ON hatlar
  FOR SELECT
  USING (true);

CREATE POLICY "Herkes hat ekleyebilir"
  ON hatlar
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Herkes hat guncelleyebilir"
  ON hatlar
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Herkes hat silebilir"
  ON hatlar
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_hatlar_blok ON hatlar(blok);
CREATE INDEX IF NOT EXISTS idx_hatlar_ekim_tarihi ON hatlar(ekim_tarihi);