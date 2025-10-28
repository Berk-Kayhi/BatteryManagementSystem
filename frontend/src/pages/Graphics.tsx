import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import UserNavbar from "../components/userNavbar";
import { useUserAuth } from "../hooks/useUserAuth";
import { useSocketData } from "../hooks/useSocketData";

const calculateVoltageDropPercentage = (
  liveData: Record<string, any>
): number => {
  const voltageDiffV = parseFloat(liveData.voltage_diff_V || "0");
  const maxCellV = parseFloat(liveData.max_cell_voltage_V || "1");

  const dropPercentage = (voltageDiffV / maxCellV) * 100;
  return parseFloat(dropPercentage.toFixed(1));
};

export default function DetailedGraphs() {
  const { userName, userEmail, isLoading } = useUserAuth();
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("null");
  const [batteryHealthData, setBatteryHealthData] = useState<any[]>([
    { name: "SOH", value: 0 },
  ]);
  const [voltageDropData, setVoltageDropData] = useState<any[]>([
    { name: "DROP", value: 0 },
  ]);
  const [StateOfChargeData, setStateOfChargeData] = useState<any[]>([
    { name: "SOC", value: 0 },
  ]);

  const liveData = useSocketData("live_data");
  useEffect(() => {
    if (!liveData) return;

    if (liveData.soh_pct !== undefined) {
      const sohValue = parseFloat(liveData.soh_pct).toFixed(1);
      setBatteryHealthData([{ name: "SOH", value: parseFloat(sohValue) }]);
    }

    if (liveData.voltage_diff_V && liveData.max_cell_voltage_V) {
      const calculatedDrop = calculateVoltageDropPercentage(liveData);
      setVoltageDropData([{ name: "DROP", value: calculatedDrop }]);
    }

    if (liveData.soc_pct !== undefined) {
      const socValue = parseFloat(liveData.soc_pct).toFixed(1);
      setStateOfChargeData([{ name: "SOC", value: parseFloat(socValue) }]);
    }
    const now = new Date();
    setLastUpdateTime(now.toLocaleTimeString("tr-TR"));
  }, [liveData]);

  if (isLoading) return <h2>Yükleniyor...</h2>;
  return (
    <div className="min-h-screen mt-20">
      <UserNavbar userName={userName} userEmail={userEmail} />
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2 md:mb-0">
            Batarya Sistem Durumu
          </div>
          <div className="flex items-center text-sm font-medium text-gray-500">
            <div className="mx-1 flex items-center">
              <p className="ri-time-line mx-1"></p>
              Son Güncelleme Zamanı:{" "}
              <span className="font-semibold mx-1 text-gray-700">
                {lastUpdateTime}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Batarya Sağlık Durumu (SOH)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={20}
                data={batteryHealthData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#008000"
                  background={{ fill: "#E5E7EB" }}
                  maxBarSize={100}
                  angleAxisId={0}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={32}
                  fontWeight="bold"
                  fill="#008000"
                >
                  {batteryHealthData?.[0]?.value ?? 0}%
                </text>
                <text
                  x="50%"
                  y="70%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14}
                  fill="#6B7280"
                ></text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Gerilim Düşüş Yüzdesi
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={20}
                data={voltageDropData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#92000a"
                  background={{ fill: "#E5E7EB" }}
                  maxBarSize={100}
                  angleAxisId={0}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={32}
                  fontWeight="bold"
                  fill="#92000a"
                >
                  {voltageDropData?.[0]?.value ?? 0}%
                </text>
                <text
                  x="50%"
                  y="70%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14}
                  fill="#6B7280"
                ></text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Şarj Durumu (SOC)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="80%"
                outerRadius="100%"
                barSize={20}
                data={StateOfChargeData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#734a12"
                  background={{ fill: "#E5E7EB" }}
                  maxBarSize={100}
                  angleAxisId={0}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={32}
                  fontWeight="bold"
                  fill="#734a12"
                >
                  {StateOfChargeData?.[0]?.value ?? 0}%
                </text>
                <text
                  x="50%"
                  y="70%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14}
                  fill="#6B7280"
                ></text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
