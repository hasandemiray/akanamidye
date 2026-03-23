import type { Hat, HatHesaplamalar, BlokOzet, DashboardOzet } from '../types/hat';

const ARA = 56;
const MAX_METRE = 2000;

// 🔥 AYLIK BÜYÜME
function getAylikBuyume(ay: number): number {
  if (ay >= 11 || ay <= 5) return 0.5;
  return 0.25;
}

// 🔥 HAT İÇİN TÜM HESAPLAMA
export function hatDurumunuHesapla(
  hat: Hat,
  activities: any[]
) {
  const hatAktiviteleri = activities.filter(
    (a) => a.line_id === hat.id
  );

  let toplam_metre = 0;
  let toplam_kg = 0;
  let toplam_yavru = 0;

  hatAktiviteleri.forEach((a) => {
    const metre = a.ara_sayisi * ARA;
    const kg = metre * a.metrede_kg;

    if (a.type === "PLANTING") {
      toplam_metre += metre;
      toplam_kg += kg;
    }

    if (a.type === "HARVEST") {
      toplam_metre -= metre;

      const hasatKg = kg;
      const yavru = (hasatKg * (a.yavru_orani || 0)) / 100;

      toplam_kg -= hasatKg;
      toplam_yavru += yavru;
    }
  });

  const kalan_metre = MAX_METRE - toplam_metre;
  const kalan_ara = Math.floor(kalan_metre / ARA);

  return {
    toplam_metre,
    toplam_kg,
    kalan_metre,
    kalan_ara,
    toplam_yavru
  };
}

// 🔥 BÜYÜME + HASAT TARİHİ
export function buyumeHesapla(
  baslangic_boy: number,
  ekim_tarihi: string
) {
  let boy = baslangic_boy;

  const baslangic = new Date(ekim_tarihi);
  const bugun = new Date();

  let current = new Date(baslangic);

  while (current < bugun) {
    const ay = current.getMonth() + 1;
    const aylik = getAylikBuyume(ay);

    boy += aylik / 30;

    current.setDate(current.getDate() + 1);
  }

  // 🔥 hasat tahmini (6 cm)
  let hasatTarihi: string | null = null;

  if (boy < 6) {
    let tempBoy = boy;
    let tempDate = new Date(bugun);

    let gun = 0;

    while (tempBoy < 6 && gun < 1000) {
      const ay = tempDate.getMonth() + 1;
      const aylik = getAylikBuyume(ay);

      tempBoy += aylik / 30;

      tempDate.setDate(tempDate.getDate() + 1);
      gun++;
    }

    hasatTarihi = tempDate.toISOString().split("T")[0];
  }

  return {
    guncel_boy: boy,
    hasatTarihi
  };
}

// 🔥 DASHBOARD
export function dashboardHesapla(
  hatlar: Hat[],
  activities: any[]
) {
  let toplam_kg = 0;
  let toplam_yavru = 0;

  const blokMap = new Map();

  hatlar.forEach((hat) => {
    const durum = hatDurumunuHesapla(hat, activities);

    toplam_kg += durum.toplam_kg;
    toplam_yavru += durum.toplam_yavru;

    if (!blokMap.has(hat.blok)) {
      blokMap.set(hat.blok, {
        blok: hat.blok,
        toplam_kg: 0,
        toplam_yavru: 0,
        hat_sayisi: 0
      });
    }

    const blok = blokMap.get(hat.blok);

    blok.toplam_kg += durum.toplam_kg;
    blok.toplam_yavru += durum.toplam_yavru;
    blok.hat_sayisi += 1;
  });

  return {
    toplam_tum_hatlar_kg: toplam_kg,
    toplam_yavru_midye_kg: toplam_yavru,
    toplam_hat_sayisi: hatlar.length,
    blok_ozetleri: Array.from(blokMap.values())
  };
}

// 🔥 FORMAT
export function formatNumber(num: number): string {
  if (isNaN(num)) return "0";
  return num.toFixed(0);
}