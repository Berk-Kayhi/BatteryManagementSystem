import { useEffect, useState } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import { useSocketData } from "../hooks/useSocketData";
import UserNavbar from "../components/userNavbar";

export default function MainPage() {
  const { userName, userEmail, isLoading } = useUserAuth();
  const rawData = useSocketData("live_data");
  const [rows, setRows] = useState<Record<string, string> | null>(null);
  
  useEffect(() => {
    if (rawData) {
      setRows(rawData);
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
    <div className="flex h-screen font-sans overflow-auto">
      <UserNavbar userName={userName} userEmail={userEmail} />
      <div className="flex flex-1 p-6 justify-center">
        <div className="flex flex-col items-center w-full pt-20">
          {rows ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {Object.entries(rows).map(([key, value]) => {
                const config = sensorConfig[key] || {
                  label: key,
                  icon: "ri-line-chart-line",
                  unit: "",
                };
                return (
                  <div
                    key={key}
                    className="rounded-xl bg-white border-4 border-gray-900 p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <i
                        className={`${config.icon} text-3xl text-amber-600`}
                      ></i>
                      <p className="font-bold text-gray-900 text-base">
                        {config.label}
                      </p>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-800">
                      {value}{" "}
                      <span className="text-2xl text-gray-600">
                        {config.unit}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-white border-4 border-gray-900 p-8">
              <div className="flex items-center gap-3 text-gray-600">
                <i className="ri-radar-line text-3xl animate-pulse"></i>
                <p className="text-xl font-semibold">Veri Bekleniyor...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
