"use client";

import { useState } from "react";
import type { Hat } from "../types/hat";

export default function HatTable({
  hatlar,
  activities,
  onEkim,
  hatDurumunuHesapla,
}: any) {
  const [showEkim, setShowEkim] = useState(false);

  const [ekim, setEkim] = useState({
    line_id: "",
    ara_sayisi: 0,
    metrede_kg: 0,
    boy_cm: 4,
  });

  return (
    <div className="space-y-6">

      {/* 🔥 ÜST BAR */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Hat Listesi</h2>

        <button
          onClick={() => setShowEkim(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ekim Yap
        </button>
      </div>

      {/* 🔥 TABLO */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Hat</th>
              <th>Blok</th>
              <th>Toplam KG</th>
              <th>Kullanılan Metre</th>
              <th>Kalan Ara</th>
            </tr>
          </thead>

          <tbody>
            {hatlar.map((hat: Hat) => {
              const durum = hatDurumunuHesapla(
                hat,
                activities
              );

              return (
                <tr key={hat.id} className="border-b">
                  <td>{hat.hat_adi}</td>
                  <td>{hat.blok}</td>

                  <td>{durum.toplam_kg.toFixed(0)} kg</td>

                  <td>{durum.toplam_metre.toFixed(0)} m</td>

                  <td>{durum.kalan_ara}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔥 POPUP EKİM */}
      {showEkim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">

            <h2 className="font-bold text-lg">Ekim Yap</h2>

            <select
              className="border p-2 w-full"
              onChange={(e) =>
                setEkim({ ...ekim, line_id: e.target.value })
              }
            >
              <option value="">Hat seç</option>
              {hatlar.map((h: Hat) => (
                <option key={h.id} value={h.id}>
                  {h.hat_adi}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Ara sayısı"
              className="border p-2 w-full"
              onChange={(e) =>
                setEkim({
                  ...ekim,
                  ara_sayisi: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Metrede kg"
              className="border p-2 w-full"
              onChange={(e) =>
                setEkim({
                  ...ekim,
                  metrede_kg: Number(e.target.value),
                })
              }
            />

            <input
              type="number"
              placeholder="Boy (cm)"
              className="border p-2 w-full"
              onChange={(e) =>
                setEkim({
                  ...ekim,
                  boy_cm: Number(e.target.value),
                })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!ekim.line_id)
                    return alert("Hat seç!");

                  onEkim(ekim);
                  setShowEkim(false);
                }}
                className="bg-black text-white px-4 py-2 rounded w-full"
              >
                Kaydet
              </button>

              <button
                onClick={() => setShowEkim(false)}
                className="bg-gray-300 px-4 py-2 rounded w-full"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}