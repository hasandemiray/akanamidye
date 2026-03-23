import type { Hat, HatHesaplamalar, BlokOzet, DashboardOzet } from '../types/hat';

const BUYUME_KATSAYISI = 1.5;
const GUNLUK_BUYUME = 0.01;

export function hatHesapla(hat: Hat): HatHesaplamalar {
  const toplam_ekilen_midye = hat.metrede_midye * hat.halat_metresi;

  const ekimTarihi = new Date(hat.ekim_tarihi);
  const bugun = new Date();
  const gecen_gun = Math.floor((bugun.getTime() - ekimTarihi.getTime()) / (1000 * 60 * 60 * 24));

  const buyume_sonrasi = toplam_ekilen_midye * BUYUME_KATSAYISI;

  const yavru_midye = (buyume_sonrasi * hat.yavru_orani) / 100;

  const guncel_kg = toplam_ekilen_midye * (1 + (GUNLUK_BUYUME * gecen_gun));

  let tahmini_hasat_tarihi: string | null = null;
  let hedef_gun_kala: number | null = null;

  if (hat.hedef_kg && hat.hedef_kg > guncel_kg) {
    const kalan_kg = hat.hedef_kg - guncel_kg;
    const gereken_gun = Math.ceil(kalan_kg / (toplam_ekilen_midye * GUNLUK_BUYUME));
    hedef_gun_kala = gereken_gun;

    const hasatTarihi = new Date(bugun);
    hasatTarihi.setDate(hasatTarihi.getDate() + gereken_gun);
    tahmini_hasat_tarihi = hasatTarihi.toISOString().split('T')[0];
  }

  const buyume_yuzdesi = (guncel_kg / buyume_sonrasi) * 100;

  return {
    toplam_ekilen_midye,
    gecen_gun,
    buyume_sonrasi,
    yavru_midye,
    guncel_kg,
    tahmini_hasat_tarihi,
    hedef_gun_kala,
    buyume_yuzdesi: Math.min(buyume_yuzdesi, 100)
  };
}

export function dashboardHesapla(hatlar: Hat[]): DashboardOzet {
  const blokMap = new Map<string, BlokOzet>();

  let toplam_tum_hatlar_kg = 0;
  let toplam_yavru_midye_kg = 0;

  hatlar.forEach(hat => {
    const hesaplamalar = hatHesapla(hat);

    toplam_tum_hatlar_kg += hesaplamalar.guncel_kg;
    toplam_yavru_midye_kg += hesaplamalar.yavru_midye;

    if (!blokMap.has(hat.blok)) {
      blokMap.set(hat.blok, {
        blok: hat.blok,
        toplam_kg: 0,
        toplam_yavru: 0,
        hat_sayisi: 0
      });
    }

    const blokOzet = blokMap.get(hat.blok)!;
    blokOzet.toplam_kg += hesaplamalar.guncel_kg;
    blokOzet.toplam_yavru += hesaplamalar.yavru_midye;
    blokOzet.hat_sayisi += 1;
  });

  const blok_ozetleri = Array.from(blokMap.values()).sort((a, b) =>
    a.blok.localeCompare(b.blok)
  );

  return {
    toplam_tum_hatlar_kg,
    toplam_yavru_midye_kg,
    toplam_hat_sayisi: hatlar.length,
    blok_ozetleri
  };
}

export function formatNumber(num: number): string {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
}
