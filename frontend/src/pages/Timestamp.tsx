import { useState, useEffect } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import UserNavbar from "../components/userNavbar";
import axios from "axios";

type TimestampData = {
  id: number;
  reading_timestamp: string;
  ai_soc: string;
  sensor_soc: string;
};

export default function TimestampPage() {
  const { userName, userEmail, isLoading } = useUserAuth();

  const [data, setData] = useState<TimestampData[]>([]);
  const [limit, setLimit] = useState<number | null>(20);
  const [lastUpdated, setLastUpdated] = useState<string>("null");

  useEffect(() => {
    const fetchTimestamps = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/data/timestamp",
          { withCredentials: true }
        );
        const reversed = [...response.data].reverse();
        setData(limit ? reversed.slice(0, limit) : reversed);
        setLastUpdated(new Date().toLocaleTimeString("tr-TR"));
      } catch (error) {
        console.error("Timestamp verileri alınamadı:", error);
      }
    };

    fetchTimestamps();
    const interval = setInterval(fetchTimestamps, 4500);
    return () => clearInterval(interval);
  }, [limit]);

  if (isLoading) return <h2>Yükleniyor...</h2>;
  return (
    <div className="min-h-screen bg-amber-50/40">
      <UserNavbar userName={userName} userEmail={userEmail} />
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
              Timestamp Kayıtları
            </p>
            <h1 className="text-3xl font-black text-gray-900">
              SOC Geçmiş Kayıtlar
            </h1>
            <p className="mt-1 text-base text-gray-600">
              En yeni zaman damgası kayıtlarını filtreleyerek görüntüle.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700">
            <i className="ri-time-line text-lg text-amber-600"></i>
            <span>Son güncelleme: {lastUpdated}</span>
          </div>
        </header>

        <section className="mt-8">
          <div className="rounded-full border border-gray-200 bg-white px-2 py-1">
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Son 20", value: 20 },
                { label: "Son 50", value: 50 },
                { label: "Tüm veriler", value: null },
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setLimit(option.value)}
                  className={`flex-1 rounded-full px-6 py-2 text-sm font-semibold transition ${
                    limit === option.value
                      ? "bg-amber-500 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">AI SOC</th>
                  <th className="px-6 py-4">Sensör SOC</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr
                    key={entry.id ?? index}
                    className="border-t border-gray-200 text-sm text-gray-700"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {new Date(entry.reading_timestamp).toLocaleString(
                        "tr-TR"
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-600">
                      {entry.ai_soc}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {entry.sensor_soc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
