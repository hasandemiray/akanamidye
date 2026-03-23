import type { Hat, HatHesaplamalar, BlokOzet, DashboardOzet } from '../types/hat';

// 🔥 AY BAZLI BÜYÜME
function getAylikBuyume(ay: number): number {
  if (ay >= 11 || ay <= 5) return 0.5;
  return 0.25;
}

export function hatHesapla(hat: Hat): HatHesaplamalar {
  const yavru_orani = hat.yavru_orani ?? 0;
  const baslangic_boy = hat.midye_boyu_cm ?? 1;

  const toplam_ekilen_midye = hat.metrede_midye * hat.halat_metresi;

  const ekimTarihi = new Date(hat.ekim_tarihi);
  const bugun = new Date();

  let currentDate = new Date(ekimTarihi);
  let boy = baslangic_boy;

  while (currentDate < bugun) {
    const ay = currentDate.getMonth() + 1;
    const aylik = getAylikBuyume(ay);

    boy += aylik / 30;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const guncel_boy = boy;

  const buyume_katsayisi = guncel_boy / baslangic_boy;
  const guncel_kg = toplam_ekilen_midye * buyume_katsayisi;

  const yavru_midye = (guncel_kg * yavru_orani) / 100;

  let tahmini_hasat_tarihi: string | null = null;
  let hedef_gun_kala: number | null = null;

  if (guncel_boy < 6) {
    let tempDate = new Date(bugun);
    let tempBoy = guncel_boy;
    let gun = 0;

    while (tempBoy < 6 && gun < 1000) {
      const ay = tempDate.getMonth() + 1;
      const aylik = getAylikBuyume(ay);

      tempBoy += aylik / 30;
      tempDate.setDate(tempDate.getDate() + 1);
      gun++;
    }

    hedef_gun_kala = gun;
    tahmini_hasat_tarihi = tempDate.toISOString().split('T')[0];
  }

  const gecen_gun = Math.floor(
    (bugun.getTime() - ekimTarihi.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    toplam_ekilen_midye,
    gecen_gun,
    buyume_sonrasi: guncel_kg,
    yavru_midye,
    guncel_kg,
    tahmini_hasat_tarihi,
    hedef_gun_kala,
    buyume_yuzdesi: Math.min((guncel_boy / 6) * 100, 100),
    guncel_boy
  };
}

export function dashboardHesapla(hatlar: Hat[]): DashboardOzet {
  const blokMap = new Map<string, BlokOzet>();

  let toplam_tum_hatlar_kg = 0;
  let toplam_yavru_midye_kg = 0;

  hatlar.forEach(hat => {
    const hesap = hatHesapla(hat);

    toplam_tum_hatlar_kg += hesap.guncel_kg;
    toplam_yavru_midye_kg += hesap.yavru_midye;

    if (!blokMap.has(hat.blok)) {
      blokMap.set(hat.blok, {
        blok: hat.blok,
        toplam_kg: 0,
        toplam_yavru: 0,
        hat_sayisi: 0
      });
    }

    const blok = blokMap.get(hat.blok)!;
    blok.toplam_kg += hesap.guncel_kg;
    blok.toplam_yavru += hesap.yavru_midye;
    blok.hat_sayisi += 1;
  });

  return {
    toplam_tum_hatlar_kg,
    toplam_yavru_midye_kg,
    toplam_hat_sayisi: hatlar.length,
    blok_ozetleri: Array.from(blokMap.values())
  };
}