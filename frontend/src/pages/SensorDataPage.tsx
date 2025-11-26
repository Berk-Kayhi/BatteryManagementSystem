import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useUserAuth } from "../hooks/useUserAuth";
import { useSocketData } from "../hooks/useSocketData";
import UserNavbar from "../components/userNavbar";

const getTrend = (current?: string, previous?: string) => {
  const curr = Number(current);
  const prev = Number(previous);

  const invalid = Number.isNaN(curr) || Number.isNaN(prev);
  if (invalid) return "stable";

  if (curr > prev) return "up";
  if (curr < prev) return "down";
  return "stable";
};

export default function MainPage() {
  const { userName, userEmail, isLoading } = useUserAuth();
  const navigate = useNavigate();
  const rawData = useSocketData("live_data");
  const [rows, setRows] = useState<Record<string, string> | null>(null);
  const [prevRows, setPrevRows] = useState<Record<string, string> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    key: string;
    label: string;
    unit: string;
  } | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [initialHistoryData, setInitialHistoryData] = useState<any[]>([]);

  useEffect(() => {
    if (!rawData) return;
    setPrevRows(rows);
    setRows(rawData);
    setLastUpdated(new Date().toLocaleTimeString("tr-TR"));
  }, [rawData]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/data/latest");
        const data = response.data.reverse();
        setHistoryData(data);
        setInitialHistoryData(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };
    fetchHistoryData();
  }, []);

  useEffect(() => {
    if (!rawData) return;

    const normalizedData = {
      voltage_v: rawData.voltage_V,
      current_a: rawData.current_A,
      power_kw: rawData.power_kW,
      reading_timestamp: new Date().toISOString(),
    };

    setHistoryData((prev) => {
      const updated = [...prev, normalizedData];
      return updated.slice(-10);
    });
  }, [rawData]);

  const handleCardClick = (key: string, config: any) => {
    if (key === "soc_pct" || key === "soh_pct") {
      navigate("/status");
      return;
    }

    if (key === "voltage_V" || key === "current_A" || key === "power_kW") {
      setSelectedMetric({
        key,
        label: config.label,
        unit: config.unit,
      });
      setModalOpen(true);
    }
  };

  const isClickable = (key: string) => {
    return ["soc_pct", "soh_pct", "voltage_V", "current_A", "power_kW"].includes(key);
  };

  const formatTimeTick = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getChartDataKey = (key: string) => {
    if (key === "voltage_V") return "voltage_v";
    if (key === "current_A") return "current_a";
    if (key === "power_kW") return "power_kw";
    return key;
  };

  const chartDomain = useMemo(() => {
    if (!selectedMetric || initialHistoryData.length === 0) {
      return [0, 100];
    }

    const dataKey = getChartDataKey(selectedMetric.key);
    const values = initialHistoryData
      .map((item) => parseFloat(item[dataKey]))
      .filter((val) => !isNaN(val));

    if (values.length === 0) {
      return [0, 100];
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    return [min - 10, max + 10];
  }, [selectedMetric, initialHistoryData]);

  const sensorConfig: Record<
    string,
    { label: string; icon: string; unit: string }
  > = {
    discharge_current_limit_A: {
      label: "Deşarj Akım Limiti",
      icon: "ri-flashlight-line",
      unit: "A",
    },
    min_module_temp_C: {
      label: "Min. Modül Sıcaklığı",
      icon: "ri-temp-cold-line",
      unit: "°C",
    },
    avg_module_temp_C: {
      label: "Ort. Modül Sıcaklığı",
      icon: "ri-temp-hot-line",
      unit: "°C",
    },
    plc_ac_temp_ref_C: {
      label: "PLC AC Ref. Sıcaklık",
      icon: "ri-temp-hot-line",
      unit: "°C",
    },
    voltage_V: { label: "Gerilim", icon: "ri-flashlight-line", unit: "V" },
    discharge_power_limit_kW: {
      label: "Deşarj Güç Limiti",
      icon: "ri-battery-charge-line",
      unit: "kW",
    },
    soc_pct: {
      label: "Şarj Durumu (SOC)",
      icon: "ri-battery-2-line",
      unit: "%",
    },
    charge_power_limit_kW: {
      label: "Şarj Güç Limiti",
      icon: "ri-battery-charge-line",
      unit: "kW",
    },
    max_module_temp_C: {
      label: "Maks. Modül Sıcaklığı",
      icon: "ri-temp-hot-line",
      unit: "°C",
    },
    soh_pct: {
      label: "Batarya Sağlığı (SOH)",
      icon: "ri-heart-pulse-line",
      unit: "%",
    },
    charge_current_limit_A: {
      label: "Şarj Akım Limiti",
      icon: "ri-plug-line",
      unit: "A",
    },
    max_cell_voltage_V: {
      label: "Maks. Hücre Gerilimi",
      icon: "ri-arrow-up-circle-line",
      unit: "V",
    },
    min_cell_voltage_V: {
      label: "Min. Hücre Gerilimi",
      icon: "ri-arrow-down-circle-line",
      unit: "V",
    },
    voltage_diff_V: {
      label: "Gerilim Farkı",
      icon: "ri-contrast-line",
      unit: "V",
    },
    current_A: { label: "Akım", icon: "ri-swap-line", unit: "A" },
    power_kW: { label: "Güç", icon: "ri-flashlight-fill", unit: "kW" },
  };

  if (isLoading) return <h2>Yükleniyor...</h2>;
  return (
    <div className="min-h-screen bg-amber-50/40">
      <UserNavbar userName={userName} userEmail={userEmail} />

      <div className="mx-auto flex max-w-7xl flex-1 flex-col px-6 pb-16 pt-24">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
              Canlı Sensör Verisi
            </p>
            <h1 className="text-3xl font-black text-gray-900">
              Batarya Telemetri Ekranı
            </h1>
            <p className="mt-1 text-base text-gray-600">
              Tüm kritik parametrelerin sade bir listesi; değişim olduğunda
              kartlar anında güncellenir.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-lg text-amber-600"></i>
              <span>Son güncelleme: {lastUpdated ?? "Bekleniyor"}</span>
            </div>
            <span className="hidden h-5 w-px bg-gray-200 md:block"></span>
            <div className="flex items-center gap-2">
              <i className="ri-dashboard-3-line text-lg text-amber-600"></i>
              <span>
                {rows
                  ? `${Object.keys(rows).length} sensör aktif`
                  : "Sensör bekleniyor"}
              </span>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
                Sensör Kartları
              </p>
              <h2 className="text-2xl font-black text-gray-900">
                Tüm Canlı Değerler
              </h2>
            </div>
          </div>

          {rows ? (
            <div className="mt-6 grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Object.entries(rows).map(([key, value]) => {
                const config = sensorConfig[key] || {
                  label: key,
                  icon: "ri-line-chart-line",
                  unit: "",
                };

                const trend = getTrend(value, prevRows?.[key]);
                const trendClasses =
                  trend === "up"
                    ? "border-green-300 shadow-[0_0_12px_rgba(134,239,172,0.4)]"
                    : trend === "down"
                      ? "border-red-300 shadow-[0_0_12px_rgba(252,165,165,0.4)]"
                      : "border-gray-200 shadow-sm";

                const clickable = isClickable(key);

                return (
                  <motion.div
                    key={key}
                    className={`group rounded-2xl border bg-white/95 p-5 transition ${trendClasses} ${clickable
                      ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                      : "hover:-translate-y-1"
                      }`}
                    layout
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    onClick={() => clickable && handleCardClick(key, config)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-600">
                          <i className={config.icon}></i>
                        </span>
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            {config.label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {key.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                          {config.unit}
                        </span>
                        {clickable && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-all group-hover:scale-110 group-hover:bg-amber-100">
                            <i className="ri-arrow-right-up-line text-sm"></i>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex items-end gap-3">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={`${key}-${value}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="text-4xl font-black text-gray-900"
                        >
                          {value}
                          <span className="ml-2 text-xl font-semibold text-gray-500">
                            {config.unit}
                          </span>
                        </motion.p>
                      </AnimatePresence>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={`${key}-${trend}`}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center gap-1 text-sm font-semibold ${trend === "up"
                            ? "text-green-600"
                            : trend === "down"
                              ? "text-red-600"
                              : "text-gray-400"
                            }`}
                        >
                          {trend === "up" && (
                            <>
                              <i className="ri-arrow-up-s-fill"></i> Artış
                            </>
                          )}
                          {trend === "down" && (
                            <>
                              <i className="ri-arrow-down-s-fill"></i> Düşüş
                            </>
                          )}
                          {trend === "stable" && <span>Sabit</span>}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border-2 border-dashed border-gray-300 bg-white/60 p-10 text-center shadow-inner">
              <div className="mx-auto flex w-max items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-amber-700">
                <i className="ri-radar-line text-2xl animate-pulse"></i>
                <span className="text-lg font-semibold">
                  Sensör verisi bekleniyor...
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                MQTT hattı hazır, her 5 saniyede kontrol edilerek yeni paket
                geldiğinde kartlar dolacak.
              </p>
            </div>
          )}
        </section>
      </div>
      <AnimatePresence>
        {modalOpen && selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
              >
                <i className="ri-close-line text-xl"></i>
              </button>

              <div className="rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-400">
                      {selectedMetric.label} Grafiği
                    </p>
                    <h2 className="text-2xl font-black text-gray-900">
                      {selectedMetric.label} ({selectedMetric.unit})
                    </h2>
                  </div>
                  <div className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    Son 10 veri kaydı
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6ecf4" />
                      <XAxis
                        dataKey="reading_timestamp"
                        tickFormatter={formatTimeTick}
                        tick={{ fill: "#334155", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={chartDomain}
                        tick={{ fill: "#334155", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={getChartDataKey(selectedMetric.key)}
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={600}
                        animationEasing="ease-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
