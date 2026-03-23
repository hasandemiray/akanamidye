import type { DashboardOzet } from '../types/hat';
import { formatNumber } from '../utils/calculations';

interface DashboardProps {
  ozet: DashboardOzet;
}

export default function Dashboard({ ozet }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Midye (kg)</h3>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(ozet.toplam_tum_hatlar_kg)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Yavru (kg)</h3>
          <p className="text-3xl font-bold text-green-600">{formatNumber(ozet.toplam_yavru_midye_kg)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Hat</h3>
          <p className="text-3xl font-bold text-gray-700">{ozet.toplam_hat_sayisi}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Blok Özeti</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ozet.blok_ozetleri.map(blok => (
            <div key={blok.blok} className="border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700 mb-2">Blok {blok.blok}</div>
                <div className="text-sm text-gray-500 mb-1">{blok.hat_sayisi} hat</div>
                <div className="text-lg font-semibold text-blue-600">{formatNumber(blok.toplam_kg)} kg</div>
                <div className="text-sm text-green-600">{formatNumber(blok.toplam_yavru)} kg yavru</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
