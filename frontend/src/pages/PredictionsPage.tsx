import { useState, useEffect, useMemo } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import axios from "axios";
import { useSocketData } from "../hooks/useSocketData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import UserNavbar from "../components/userNavbar";
import { motion, AnimatePresence } from "framer-motion";

type TimestampData = {
  id: number;
  reading_timestamp: string;
  ai_soc: string;
  sensor_soc: string;
};
const rowVariants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto", transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { userName, userEmail, isLoading } = useUserAuth();
  const livePacket = useSocketData("ai_prediction_data");
  const [data, setData] = useState<TimestampData[]>([]);
  const [tableData, setTableData] = useState<TimestampData[]>([]);
  const [lastSync, setLastSync] = useState<string>("null");
  const formatTimeTick = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const fetchTimestamps = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/data/timestamp",
          { withCredentials: true }
        );

        const latestData = response.data.slice(-10);
        setData(latestData);
        const reversedForTable = [...latestData].reverse();
        setTableData(reversedForTable);
        const lastEntry = latestData[latestData.length - 1];
        setLastSync(
          lastEntry
            ? new Date(lastEntry.reading_timestamp).toLocaleTimeString("tr-TR")
            : "Veri yok"
        );
      } catch (error) {
        console.error("Timestamp verileri alınamadı:", error);
      }
    };

    fetchTimestamps();
  }, []);

  useEffect(() => {
    if (livePacket) {
      const newData: TimestampData = {
        id: livePacket.timestamp,
        reading_timestamp: livePacket.timestamp,
        ai_soc: String(livePacket.aiPrediction?.predicted_soc ?? ""),
        sensor_soc: String(livePacket.sensorData?.soc_pct ?? ""),
      };

      setData((prev) => [...prev.slice(-9), newData]);
      setTableData((prev) => [newData, ...prev].slice(0, 10));

      setLastSync(
        new Date(newData.reading_timestamp).toLocaleTimeString("tr-TR")
      );
    }
  }, [livePacket]);

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        time: item.reading_timestamp,
        sensorSoc: parseFloat(item.sensor_soc),
        aiSoc: parseFloat(item.ai_soc),
      })),
    [data]
  );
  if (isLoading) return <h2>Yükleniyor...</h2>;
  return (
    <div className="min-h-screen bg-amber-50/40">
      <UserNavbar userName={userName} userEmail={userEmail} />
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-24">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
              Grafik Ekranı (AI)
            </p>
            <h1 className="text-3xl font-black text-gray-900">
              Yapay Zeka vs Sensör SOC Takibi
            </h1>
            <p className="mt-1 text-base text-gray-600">
              AI tahminleri ile gerçek sensör ölçümlerini görsel olarak kıyasla,
              sapmaları hızlıca yakala.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-lg text-amber-600"></i>
              <span>Son güncelleme: {lastSync}</span>
            </div>
          </div>
        </header>

        <motion.section
          className="mt-8 rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm"
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
                SOC Grafiği
              </p>
              <h2 className="text-2xl font-black text-gray-900">
                AI Tahmini vs Sensör Ölçümü
              </h2>
            </div>
            <div className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600">
              Son 10 veri kaydı
            </div>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e6ecf4" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#334155", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatTimeTick}
                />
                <YAxis
                  tick={{ fill: "#334155", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ top: -10, right: 20 }}
                />
                <Area
                  type="monotone"
                  dataKey="sensorSoc"
                  name="Sensör SOC"
                  stroke="#0f172a"
                  fill="rgba(15, 23, 42, 0.08)"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="aiSoc"
                  name="AI SOC"
                  stroke="#f97316"
                  fill="rgba(249, 115, 22, 0.15)"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          className="mt-8"
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
                Kayıt Listesi
              </p>
              <h2 className="text-2xl font-black text-gray-900">
                Timestamp Event Log
              </h2>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white/95 shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">AI SOC</th>
                  <th className="px-6 py-4">Sensör SOC</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {tableData.map((entry) => (
                    <motion.tr
                      key={entry.reading_timestamp}
                      className="border-t border-gray-200 text-sm text-gray-700"
                      variants={rowVariants}
                      initial="initial"
                      animate="animate"
                      layout
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
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
