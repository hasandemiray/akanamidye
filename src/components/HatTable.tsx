import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { Hat, Blok } from '../types/hat';
import { hatHesapla, formatNumber, formatDate } from '../utils/calculations';
import HatForm from './HatForm';

interface HatTableProps {
  hatlar: Hat[];
  onHatEkle: (hat: Omit<Hat, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onHatGuncelle: (id: string, hat: Partial<Hat>) => Promise<void>;
  onHatSil: (id: string) => Promise<void>;
  onHatDetay: (hat: Hat) => void;
}

export default function HatTable({ hatlar, onHatEkle, onHatGuncelle, onHatSil, onHatDetay }: HatTableProps) {
  const [selectedBlok, setSelectedBlok] = useState<Blok | 'TUM'>('TUM');
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenecekHat, setDuzenlenecekHat] = useState<Hat | null>(null);

  const filtreliHatlar = selectedBlok === 'TUM'
    ? hatlar
    : hatlar.filter(h => h.blok === selectedBlok);

  const handleFormGonder = async (hat: Omit<Hat, 'id' | 'created_at' | 'updated_at'>) => {
    if (duzenlenecekHat) {
      await onHatGuncelle(duzenlenecekHat.id, hat);
    } else {
      await onHatEkle(hat);
    }
    setFormAcik(false);
    setDuzenlenecekHat(null);
  };

  const handleDuzenle = (hat: Hat) => {
    setDuzenlenecekHat(hat);
    setFormAcik(true);
  };

  const handleYeniHat = () => {
    setDuzenlenecekHat(null);
    setFormAcik(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedBlok('TUM')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedBlok === 'TUM'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tümü
          </button>
          {(['A', 'B', 'C', 'D', 'E', 'F'] as Blok[]).map(blok => (
            <button
              key={blok}
              onClick={() => setSelectedBlok(blok)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedBlok === blok
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Blok {blok}
            </button>
          ))}
        </div>

        <button
          onClick={handleYeniHat}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
        >
          <Plus size={18} />
          Yeni Hat Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hat Adı</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blok</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Halat (m)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metrede (kg)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ekim Tarihi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geçen Gün</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Güncel (kg)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yavru (%)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hedef (kg)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtreliHatlar.map(hat => {
                const hesaplamalar = hatHesapla(hat);
                return (
                  <tr
                    key={hat.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onHatDetay(hat)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{hat.hat_adi}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{hat.blok}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{hat.halat_metresi}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(hat.metrede_midye)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(hat.ekim_tarihi)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{hesaplamalar.gecen_gun}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                      {formatNumber(hesaplamalar.guncel_kg)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{hat.yavru_orani}%</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {hat.hedef_kg ? formatNumber(hat.hedef_kg) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDuzenle(hat)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onHatSil(hat.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtreliHatlar.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Henüz hat bulunmuyor. Yeni hat ekleyerek başlayın.
            </div>
          )}
        </div>
      </div>

      {formAcik && (
        <HatForm
          hat={duzenlenecekHat}
          onGonder={handleFormGonder}
          onIptal={() => {
            setFormAcik(false);
            setDuzenlenecekHat(null);
          }}
        />
      )}
    </div>
  );
}
