import { useEffect, useState } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import { useSocketData } from "../hooks/useSocketData";
import UserNavbar from "../components/userNavbar";

export default function MainPage() {
  const { userName, userEmail, isLoading } = useUserAuth();
  const rawData = useSocketData("live_data");
  const [rows, setRows] = useState<Record<string, string> | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (rawData) {
      setRows(rawData);
      setLastUpdated(new Date().toLocaleTimeString("tr-TR"));
    }
  }, [rawData]);

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

                return (
                  <div
                    key={key}
                    className="group rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
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
                      <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                        {config.unit}
                      </span>
                    </div>
                    <p className="mt-6 text-4xl font-black text-gray-900">
                      {value}
                      <span className="ml-2 text-xl font-semibold text-gray-500">
                        {config.unit}
                      </span>
                    </p>
                    <p className="mt-3 text-xs text-gray-400">
                      {lastUpdated
                        ? `Güncelleme: ${lastUpdated}`
                        : "Veri bekleniyor"}
                    </p>
                  </div>
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
    </div>
  );
}
