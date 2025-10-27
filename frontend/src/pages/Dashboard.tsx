import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { io } from "socket.io-client";
import UserNavbar from "../components/userNavbar";
type ChartDataPoint = {
  time: string;
  sensorSoc: number;
  aiSoc: number;
};

type LogEntry = {
  timestamp: string;
  aiSoc: string;
  sensorSoc: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-lg">
        <p className="text-sm font-semibold text-gray-600">{`Zaman: ${label}`}</p>
        <p className="text-sm text-[#00529B]">{`Sensor SOC: ${payload[0].value.toFixed(
          2
        )}%`}</p>
        <p className="text-sm text-[#FF6C00]">{`AI Tahmini: ${payload[1].value.toFixed(
          2
        )}%`}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [logData, setLogData] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth/me", {
          withCredentials: true,
        });
        if (response.status === 200) {
          const user = response.data;
          setUserName(user.username);
          setUserEmail(user.email);
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      withCredentials: true,
    });

    socket.on("connect", () => {});

    socket.on("ai_prediction_data", (data) => {
      const { sensorData, aiPrediction, timestamp } = data;

      const now = new Date(timestamp);
      const timeLabel = now.toLocaleTimeString("tr-TR");

      const newChartPoint: ChartDataPoint = {
        time: timeLabel,
        sensorSoc: parseFloat(sensorData.soc_pct),
        aiSoc: aiPrediction.predicted_soc,
      };

      setChartData((prevData) => {
        const updatedData = [...prevData, newChartPoint];
        return updatedData.length > 4 ? updatedData.slice(1) : updatedData;
      });

      const newLogEntry: LogEntry = {
        timestamp: now.toLocaleString("tr-TR"),
        sensorSoc: `${parseFloat(sensorData.soc_pct).toFixed(2)}%`,
        aiSoc: `${aiPrediction.predicted_soc.toFixed(2)}%`,
      };

      setLogData((prevLog) => [newLogEntry, ...prevLog].slice(0, 10));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const logout = async () => {
    if (!window.confirm("Çıkış yapmak istediğinizden emin misiniz?")) return;
    try {
      await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] font-['Inter',_sans-serif]">
      <UserNavbar userName={userName} userEmail={userEmail} onLogout={logout} />
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        <div className="flex h-full grow flex-col">
          <div className="px-4 md:px-10 flex flex-1 justify-center py-5">
            <div className="flex flex-col w-full max-w-7xl flex-1">
              <main className="flex-1 flex flex-col pt-24">
                <div className="w-full h-96 bg-white p-4 rounded-lg border border-[#ced9e9]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6ecf4" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "#476a9e", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#476a9e", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        domain={["dataMin - 2", "dataMax + 2"]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
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
                          {logData.map((entry, index) => (
                            <tr
                              key={index}
                              className="border-t border-t-[#ced9e9]"
                            >
                              <td className="h-[60px] px-4 py-2 text-[#212529] text-sm font-normal leading-normal text-center md:text-left ">
                                {entry.timestamp}
                              </td>
                              <td className="h-[60px] px-4 py-2 text-[#FF6C00] text-sm font-normal leading-normal">
                                {entry.aiSoc}
                              </td>
                              <td className="h-[60px] px-4 py-2 text-[#00529B] text-sm font-normal leading-normal">
                                {entry.sensorSoc}
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
