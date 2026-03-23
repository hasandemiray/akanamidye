import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Hat } from './types/hat';
import Dashboard from './components/Dashboard';
import HatTable from './components/HatTable';
import HatDetay from './components/HatDetay';
import { dashboardHesapla } from './utils/calculations';

function App() {
  const [hatlar, setHatlar] = useState<Hat[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [secilenHat, setSecilenHat] = useState<Hat | null>(null);

  useEffect(() => {
    hatlariGetir();
  }, []);

  const hatlariGetir = async () => {
    try {
      const { data, error } = await supabase
        .from('hatlar')
        .select('*')
        .order('blok', { ascending: true })
        .order('hat_adi', { ascending: true });

      if (error) throw error;
      setHatlar(data || []);
    } catch (error) {
      console.error('Hatlar getirilirken hata:', error);
      alert('Hatlar yüklenirken bir hata oluştu!');
    } finally {
      setYukleniyor(false);
    }
  };

  const hatEkle = async (yeniHat: Omit<Hat, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('hatlar')
        .insert([{ ...yeniHat, updated_at: new Date().toISOString() }]);

      if (error) throw error;
      await hatlariGetir();
    } catch (error) {
      console.error('Hat eklenirken hata:', error);
      throw error;
    }
  };

  const hatGuncelle = async (id: string, guncelHat: Partial<Hat>) => {
    try {
      const { error } = await supabase
        .from('hatlar')
        .update({ ...guncelHat, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await hatlariGetir();
    } catch (error) {
      console.error('Hat güncellenirken hata:', error);
      throw error;
    }
  };

  const hatSil = async (id: string) => {
    if (!confirm('Bu hattı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('hatlar')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await hatlariGetir();
    } catch (error) {
      console.error('Hat silinirken hata:', error);
      alert('Hat silinirken bir hata oluştu!');
    }
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  const dashboardOzet = dashboardHesapla(hatlar);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Midye Üretim Takip Sistemi
          </h1>
          <p className="text-gray-600">
            Midye üretim hatlarınızı takip edin ve yönetin
          </p>
        </div>

        <div className="mb-8">
          <Dashboard ozet={dashboardOzet} />
        </div>

        <div>
          <HatTable
            hatlar={hatlar}
            onHatEkle={hatEkle}
            onHatGuncelle={hatGuncelle}
            onHatSil={hatSil}
            onHatDetay={setSecilenHat}
          />
        </div>

        {secilenHat && (
          <HatDetay
            hat={secilenHat}
            onKapat={() => setSecilenHat(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
