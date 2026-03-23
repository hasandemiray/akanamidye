import { useState } from "react";
import type { Hat } from "../types/hat";

export default function HatTable({ hatlar, onHatEkle }: any) {
  const [yeniHat, setYeniHat] = useState({
    hat_adi: "",
    blok: "A",
    halat_metresi: 0,
    metrede_midye: 0,
    ekim_tarihi: "",
    midye_boyu_cm: 1,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onHatEkle(yeniHat);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Hat adı"
          onChange={(e) =>
            setYeniHat({ ...yeniHat, hat_adi: e.target.value })
          }
        />

        <input
          placeholder="Blok"
          onChange={(e) =>
            setYeniHat({ ...yeniHat, blok: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Metre"
          onChange={(e) =>
            setYeniHat({
              ...yeniHat,
              halat_metresi: Number(e.target.value),
            })
          }
        />

        <input
          type="number"
          placeholder="Kg/m"
          onChange={(e) =>
            setYeniHat({
              ...yeniHat,
              metrede_midye: Number(e.target.value),
            })
          }
        />

        <input
          type="date"
          onChange={(e) =>
            setYeniHat({
              ...yeniHat,
              ekim_tarihi: e.target.value,
            })
          }
        />

        {/* 🔥 KRİTİK */}
        <input
          type="number"
          placeholder="Boy (cm)"
          onChange={(e) =>
            setYeniHat({
              ...yeniHat,
              midye_boyu_cm: Number(e.target.value),
            })
          }
        />

        <button type="submit">Hat Ekle</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Hat</th>
            <th>Blok</th>
            <th>Metre</th>
            <th>Kg/m</th>
            <th>Boy</th>
          </tr>
        </thead>

        <tbody>
          {hatlar.map((hat: Hat) => (
            <tr key={hat.id}>
              <td>{hat.hat_adi}</td>
              <td>{hat.blok}</td>
              <td>{hat.halat_metresi}</td>
              <td>{hat.metrede_midye}</td>
              <td>{hat.midye_boyu_cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}