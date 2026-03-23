import { X } from 'lucide-react';
import type { Hat } from '../types/hat';
import { hatHesapla, formatNumber, formatDate } from '../utils/calculations';

interface HatDetayProps {
  hat: Hat;
  onKapat: () => void;
}

export default function HatDetay({ hat, onKapat }: HatDetayProps) {
  const hesaplamalar = hatHesapla(hat);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            Hat Detayı: {hat.hat_adi}
          </h2>
          <button
            onClick={onKapat}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Blok</div>
              <div className="text-xl font-semibold text-gray-800">{hat.blok}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Halat Metresi</div>
              <div className="text-xl font-semibold text-gray-800">{hat.halat_metresi} m</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Metrede Midye</div>
              <div className="text-xl font-semibold text-gray-800">{formatNumber(hat.metrede_midye)} kg</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Ekim Tarihi</div>
              <div className="text-xl font-semibold text-gray-800">{formatDate(hat.ekim_tarihi)}</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Hesaplamalar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">Toplam Ekilen Midye</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatNumber(hesaplamalar.toplam_ekilen_midye)} kg
                </div>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Büyüme Sonrası Tahmini</div>
                <div className="text-2xl font-bold text-green-700">
                  {formatNumber(hesaplamalar.buyume_sonrasi)} kg
                </div>
              </div>

              <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                <div className="text-sm text-orange-600 mb-1">Yavru Midye</div>
                <div className="text-2xl font-bold text-orange-700">
                  {formatNumber(hesaplamalar.yavru_midye)} kg
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  ({hat.yavru_orani}% oran)
                </div>
              </div>

              <div className="bg-teal-50 p-5 rounded-lg border border-teal-200">
                <div className="text-sm text-teal-600 mb-1">Güncel Midye</div>
                <div className="text-2xl font-bold text-teal-700">
                  {formatNumber(hesaplamalar.guncel_kg)} kg
                </div>
                <div className="text-xs text-teal-600 mt-1">
                  ({hesaplamalar.gecen_gun} gün geçti)
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Büyüme Durumu</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>İlerleme: {formatNumber(hesaplamalar.guncel_kg)} kg</span>
                <span>Hedef: {formatNumber(hesaplamalar.buyume_sonrasi)} kg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${hesaplamalar.buyume_yuzdesi}%` }}
                >
                  {hesaplamalar.buyume_yuzdesi.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {hat.hedef_kg && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Hasat Tahmini</h3>
              <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-amber-600 mb-1">Hedef Miktar</div>
                    <div className="text-xl font-bold text-amber-700">
                      {formatNumber(hat.hedef_kg)} kg
                    </div>
                  </div>
                  {hesaplamalar.hedef_gun_kala !== null && (
                    <>
                      <div>
                        <div className="text-sm text-amber-600 mb-1">Kalan Süre</div>
                        <div className="text-xl font-bold text-amber-700">
                          {hesaplamalar.hedef_gun_kala} gün
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-amber-600 mb-1">Tahmini Hasat Tarihi</div>
                        <div className="text-xl font-bold text-amber-700">
                          {hesaplamalar.tahmini_hasat_tarihi
                            ? formatDate(hesaplamalar.tahmini_hasat_tarihi)
                            : '-'}
                        </div>
                      </div>
                    </>
                  )}
                  {hesaplamalar.hedef_gun_kala === null && (
                    <div className="col-span-2 text-green-600 font-medium">
                      Hedef kg'a ulaşıldı!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onKapat}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
