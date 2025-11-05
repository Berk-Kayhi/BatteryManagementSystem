import { useState, useEffect } from "react";
import { useUserAuth } from "../hooks/useUserAuth";
import axios from "axios";
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

type TimestampData = {
  id: number;
  reading_timestamp: string;
  ai_soc: string;
  sensor_soc: string;
};

export default function DashboardPage() {
  const { userName, userEmail, isLoading } = useUserAuth();
  const [data, setData] = useState<TimestampData[]>([]);
  const [tableData, setTableData] = useState<TimestampData[]>([]);
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
      } catch (error) {
        console.error("Timestamp verileri alınamadı:", error);
      }
    };

    fetchTimestamps();
    const interval = setInterval(fetchTimestamps, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <h2>Yükleniyor...</h2>;
  return (
    <div>
      <UserNavbar userName={userName} userEmail={userEmail} />
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        <div className="flex h-full grow flex-col">
          <div className="px-4 md:px-10 flex flex-1 justify-center py-5">
            <div className="flex flex-col w-full max-w-7xl flex-1">
              <main className="flex-1 flex flex-col pt-24">
                <div className="w-full h-96 bg-white p-4 rounded-lg border border-[#ced9e9]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.map((item) => ({
                        time: item.reading_timestamp,
                        sensorSoc: parseFloat(item.sensor_soc),
                        aiSoc: parseFloat(item.ai_soc),
                      }))}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6ecf4" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "#476a9e", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatTimeTick}
                      />
                      <YAxis
                        tick={{ fill: "#476a9e", fontSize: 12 }}
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
                        name="Sensor SOC"
                        stroke="#00529B"
                        fill="rgba(0, 82, 155, 0.1)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="aiSoc"
                        name="AI SOC"
                        stroke="#FF6C00"
                        fill="rgba(255, 108, 0, 0.1)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-8">
                  <h2 className="text-[#212529] text-2xl font-bold tracking-tight px-4 pb-3">
                    Timestamp Event Log
                  </h2>
                  <div className="px-4 py-3 ">
                    <div className="flex overflow-hidden rounded-lg border border-[#ced9e9] bg-[#FFFFFF]">
                      <table className="w-full flex-1">
                        <thead className="bg-[#f8f9fa]">
                          <tr>
                            <th className="px-4 py-3 text-left text-[#212529] text-sm font-medium leading-normal w-1/3">
                              Timestamp
                            </th>
                            <th className="px-4 py-3 text-left text-[#212529] text-sm font-medium leading-normal w-1/3">
                              AI SOC
                            </th>
                            <th className="px-4 py-3 text-left text-[#212529] text-sm font-medium leading-normal w-1/3">
                              Sensor SOC
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((entry, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#ced9e9]"
                            >
                              <td className="h-[60px] px-4 py-2 text-[#212529] text-sm font-normal leading-normal text-center md:text-left ">
                                {new Date(
                                  entry.reading_timestamp
                                ).toLocaleString("tr-TR")}
                              </td>
                              <td className="h-[60px] px-4 py-2 text-[#FF6C00] text-sm font-normal leading-normal">
                                {entry.ai_soc}
                              </td>
                              <td className="h-[60px] px-4 py-2 text-[#00529B] text-sm font-normal leading-normal">
                                {entry.sensor_soc}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
