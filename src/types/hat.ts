export interface Hat {
  id: string;
  hat_adi: string;
  blok: string;
  halat_metresi: number;
  metrede_midye: number;
  ekim_tarihi: string;

  // 🔥 ZORUNLU ALAN
  midye_boyu_cm: number;

  yavru_orani?: number;
  hedef_kg?: number;

  created_at?: string;
  updated_at?: string;
}

export interface HatHesaplamalar {
  toplam_ekilen_midye: number;
  gecen_gun: number;
  buyume_sonrasi: number;
  yavru_midye: number;
  guncel_kg: number;
  tahmini_hasat_tarihi: string | null;
  hedef_gun_kala: number | null;
  buyume_yuzdesi: number;
  guncel_boy: number;
}

export interface BlokOzet {
  blok: string;
  toplam_kg: number;
  toplam_yavru: number;
  hat_sayisi: number;
}

export interface DashboardOzet {
  toplam_tum_hatlar_kg: number;
  toplam_yavru_midye_kg: number;
  toplam_hat_sayisi: number;
  blok_ozetleri: BlokOzet[];
}