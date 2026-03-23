import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Hat, Blok } from '../types/hat';

interface HatFormProps {
  hat: Hat | null;
  onGonder: (hat: Omit<Hat, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onIptal: () => void;
}

export default function HatForm({ hat, onGonder, onIptal }: HatFormProps) {
  const [formData, setFormData] = useState({
    hat_adi: '',
    blok: 'A' as Blok,
    halat_metresi: '',
    metrede_midye: '',
    ekim_tarihi: new Date().toISOString().split('T')[0],
    yavru_orani: '0',
    hedef_kg: ''
  });

  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (hat) {
      setFormData({
        hat_adi: hat.hat_adi,
        blok: hat.blok,
        halat_metresi: hat.halat_metresi.toString(),
        metrede_midye: hat.metrede_midye.toString(),
        ekim_tarihi: hat.ekim_tarihi,
        yavru_orani: hat.yavru_orani.toString(),
        hedef_kg: hat.hedef_kg?.toString() || ''
      });
    }
  }, [hat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setYukleniyor(true);

    try {
      await onGonder({
        hat_adi: formData.hat_adi,
        blok: formData.blok,
        halat_metresi: parseInt(formData.halat_metresi),
        metrede_midye: parseFloat(formData.metrede_midye),
        ekim_tarihi: formData.ekim_tarihi,
        yavru_orani: parseFloat(formData.yavru_orani),
        hedef_kg: formData.hedef_kg ? parseFloat(formData.hedef_kg) : null
      });
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu!');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {hat ? 'Hat Düzenle' : 'Yeni Hat Ekle'}
          </h2>
          <button
            onClick={onIptal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hat Adı
              </label>
              <input
                type="text"
                required
                value={formData.hat_adi}
                onChange={(e) => setFormData({ ...formData, hat_adi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="örn: A1, A2, B1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blok
              </label>
              <select
                required
                value={formData.blok}
                onChange={(e) => setFormData({ ...formData, blok: e.target.value as Blok })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(['A', 'B', 'C', 'D', 'E', 'F'] as Blok[]).map(blok => (
                  <option key={blok} value={blok}>Blok {blok}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Halat Metresi (max 2000)
              </label>
              <input
                type="number"
                required
                min="1"
                max="2000"
                value={formData.halat_metresi}
                onChange={(e) => setFormData({ ...formData, halat_metresi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metrede Midye (kg)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.metrede_midye}
                onChange={(e) => setFormData({ ...formData, metrede_midye: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ekim Tarihi
              </label>
              <input
                type="date"
                required
                value={formData.ekim_tarihi}
                onChange={(e) => setFormData({ ...formData, ekim_tarihi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yavru Oranı (%)
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.yavru_orani}
                onChange={(e) => setFormData({ ...formData, yavru_orani: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hedef kg (opsiyonel)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.hedef_kg}
              onChange={(e) => setFormData({ ...formData, hedef_kg: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Boş bırakılabilir"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={yukleniyor}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {yukleniyor ? 'Kaydediliyor...' : hat ? 'Güncelle' : 'Ekle'}
            </button>
            <button
              type="button"
              onClick={onIptal}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
