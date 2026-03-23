"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Hat } from "./types/hat";
import HatTable from "./components/HatTable";
import {
  dashboardHesapla,
  hatDurumunuHesapla,
} from "./utils/calculations";

export default function App() {
  const [hatlar, setHatlar] = useState<Hat[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 VERİLERİ ÇEK
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);

    const { data: hatData } = await supabase
      .from("hatlar")
      .select("*");

    const { data: actData } = await supabase
      .from("activities")
      .select("*");

    setHatlar(hatData || []);
    setActivities(actData || []);

    setLoading(false);
  };

  // 🔥 EKİM (ARA İLE)
  const handleEkim = async (data: any) => {
    await supabase.from("activities").insert([
      {
        line_id: data.line_id,
        type: "PLANTING",
        tarih: new Date(),

        ara_sayisi: data.ara_sayisi,
        metrede_kg: data.metrede_kg,
        boy_cm: data.boy_cm,
      },
    ]);

    await loadAll();
  };

  if (loading) return <div>Yükleniyor...</div>;

  const dashboard = dashboardHesapla(hatlar, activities);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Midye Üretim Sistemi
      </h1>

      {/* DASHBOARD */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Toplam KG: {dashboard.toplam_tum_hatlar_kg.toFixed(0)}
        </div>

        <div className="bg-white p-4 rounded shadow">
          Yavru KG: {dashboard.toplam_yavru_midye_kg.toFixed(0)}
        </div>

        <div className="bg-white p-4 rounded shadow">
          Hat Sayısı: {dashboard.toplam_hat_sayisi}
        </div>
      </div>

      {/* HAT TABLO */}
      <HatTable
        hatlar={hatlar}
        activities={activities}
        onEkim={handleEkim}
        hatDurumunuHesapla={hatDurumunuHesapla}
      />
    </div>
  );
}