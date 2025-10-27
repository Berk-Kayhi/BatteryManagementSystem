import { useState, useEffect } from "react";
import UserNavbar from "../components/userNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type TimestampData = {
  id: number;
  reading_timestamp: string;
  ai_soc: string;
  sensor_soc: string;
};

export default function TimestampPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<TimestampData[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<number | null>(20);

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
      } catch {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchTimestamps = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/data/timestamp",
          { withCredentials: true }
        );
        const reversed = [...response.data].reverse();
        setData(limit ? reversed.slice(0, limit) : reversed);
      } catch (error) {
        console.error("Timestamp verileri alınamadı:", error);
      }
    };

    fetchTimestamps();
    const interval = setInterval(fetchTimestamps, 4500);
    return () => clearInterval(interval);
  }, [limit]);

  if (isLoading) return <h2>Yükleniyor...</h2>;

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

  return (
    <>
      <UserNavbar userName={userName} userEmail={userEmail} onLogout={logout} />
      <div className="flex mx-50 justify-around">
        <div className="rounded-full flex bg-[#f8f9fa] border w-fit border-[#ced9e9] gap-5 mt-20 p-1">
          <button
            onClick={() => setLimit(20)}
            className={`cursor-pointer py-2 rounded-full px-20 ${
              limit === 20 ? "bg-[#FF6C00] text-black" : "hover:bg-gray-200 text-black"
            }`}
          >
            Son 20
          </button>
          <button
            onClick={() => setLimit(50)}
            className={`cursor-pointer py-2 rounded-full px-20 ${
              limit === 50 ? "bg-[#FF6C00] text-black" : "hover:bg-gray-200 text-black"
            }`}
          >
            Son 50
          </button>
          <button
            onClick={() => setLimit(null)}
            className={`cursor-pointer py-2 rounded-full px-20 ${
              limit === null ? "bg-[#FF6C00] text-black" : "hover:bg-gray-200 text-black"
            }`}
          >
            Tüm veriler
          </button>
        </div>
      </div>
      <div className="px-4 py-3 md:w-9/12 mx-auto mt-5 w-full">
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
              {data.map((entry, index) => (
                <tr key={index} className="border-t border-t-[#ced9e9]">
                  <td className="h-[60px] px-4 py-2 text-[#212529] text-center md:text-left text-sm font-normal leading-normal">
                    {new Date(entry.reading_timestamp).toLocaleString("tr-TR")}
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
    </>
  );
}