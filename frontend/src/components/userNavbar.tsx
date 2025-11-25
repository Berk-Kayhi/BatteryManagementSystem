import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";
import toast from "react-hot-toast";

type UserNavbarProps = {
  userName: string;
  userEmail: string;
};

export default function UserNavbar({ userName, userEmail }: UserNavbarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [showProfileDetails, setProfileDetails] = useState(false);
  const userInitial = useMemo(
    () => userName?.charAt(0)?.toUpperCase() ?? "?",
    [userName]
  );
  const primaryActions = [
    {
      label: "Şebeke Haritası",
      icon: "ri-node-tree",
      description: "Network topolojisi ve ESS bağlantıları",
      path: "/network",
    },
    {
      label: "Sistem Durumu",
      icon: "ri-dashboard-line",
      description: "Batarya sağlık ve durum bilgisi",
      path: "/status",
    },
    {
      label: "Tahmin Paneli",
      icon: "ri-line-chart-line",
      description: "AI destekli analiz ve tahminler",
      path: "/predictions",
    },
    {
      label: "Geçmiş Kayıtlar",
      icon: "ri-history-line",
      description: "Zaman damgalı veri geçmişi",
      path: "/history",
    },
  ];
  const handleShowPopup = () => {
    if (showProfileDetails) {
      setProfileDetails(false);
    } else {
      setShowPopup(!showPopup);
    }
  };
  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Çıkış yapmak istediğinizden emin misiniz?"
    );
    if (!confirmed) return;
    try {
      await logout();
      toast.success("Çıkış başarılı!");
      navigate("/login");
    } catch (error) {
      console.error("Çıkış yaparken bir hata oluştu:", error);
      toast.error("Çıkış yaparken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed1 = window.confirm(
      "Hesabınızı silmek istediğinizden emin misiniz?"
    );
    if (!confirmed1) {
      return;
    }
    const confirmed2 = window.confirm(
      "Hesabınızı sildiğiniz zaman verileriniz tamamen silinecektir. Bu işlem geri alınamaz. Onaylıyor musunuz?"
    );
    if (!confirmed2) {
      return;
    }
    try {
      await axios.delete("http://localhost:3001/auth/delete", {
        withCredentials: true,
      });
      toast.success("Hesabınız başarılı bir şekilde silindi.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Hesabınız silinemedi:", error);
      toast.error("Hesabınız silinemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed left-6 top-6 z-50">
      <button
        onClick={() => handleShowPopup()}
        className="group flex items-center gap-3 rounded-2xl border-3  bg-white px-5 py-3 text-gray-900 shadow-lg transition-all duration-200 hover:border-amber-500 hover:bg-amber-50"
        aria-label="Kullanıcı Menüsünü Aç"
      >
        <i className="ri-menu-line text-2xl text-gray-900 transition-colors group-hover:text-amber-600"></i>
        <span className="text-lg font-semibold tracking-wide text-gray-900 transition-colors group-hover:text-amber-600">
          {userName}
        </span>
      </button>

      <AnimatePresence mode="wait">
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
            className="absolute top-15 mt-4 w-96 rounded-3xl border-3  bg-white px-6 py-6 text-gray-900 shadow-2xl"
            style={{ originX: 0, originY: 0 }}
          >
            <div className="rounded-2xl border-2 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-semibold text-amber-700">
                  {userInitial}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Hoş geldin</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {userName}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-700">
                    Kontrol Paneli
                  </span>
                </div>
              </div>
            </div>

            <nav className="mt-5 flex flex-col gap-3 text-base font-semibold text-gray-900">
              {primaryActions.map((item) => (
                <button
                  key={item.label}
                  className="group flex items-center justify-between rounded-2xl border-2 bg-white px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500 hover:bg-amber-50"
                  onClick={() => navigate(item.path)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-amber-50 text-2xl text-amber-600 transition-all group-hover:border-amber-500 group-hover:bg-amber-100">
                      <i className={item.icon}></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-900">{item.label}</span>
                      <span className="text-xs font-normal text-gray-500 group-hover:text-amber-700">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <i className="ri-arrow-right-up-line text-lg text-gray-500 transition group-hover:text-amber-700"></i>
                </button>
              ))}

              <div className="mt-2 rounded-2xl border-2 bg-amber-50/80 p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-800">
                      Profil
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Hesap detayları
                    </p>
                  </div>
                  <button
                    className="group flex items-center gap-2 rounded-xl border-2 border-amber-500 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
                    onClick={() => {
                      setProfileDetails(true);
                      setShowPopup(false);
                    }}
                  >
                    <i className="ri-profile-line text-lg"></i>
                    Görüntüle
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="group mt-3 flex items-center justify-between rounded-2xl  bg-red-50 border-2 px-4 py-3 text-left text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border text-2xl text-red-600 transition group-hover:bg-red-50">
                    <i className="ri-logout-box-line"></i>
                  </div>
                  <span>Çıkış Yap</span>
                </div>
                <i className="ri-arrow-right-down-line text-lg text-red-500 transition group-hover:text-red-700"></i>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showProfileDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
            className="absolute top-15 mt-4 w-96 rounded-3xl border-3  bg-white px-6 py-6 text-gray-900 shadow-2xl"
            style={{ originX: 0, originY: 0 }}
          >
            <nav className="flex flex-col gap-5 text-base font-medium text-gray-900">
              <div className="grid gap-3">
                <div className="rounded-2xl border-2 /70 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Ad
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userName}
                  </p>
                </div>
                <div className="rounded-2xl border-2 /70 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    E-Posta
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userEmail}
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="group mt-3 flex items-center justify-between rounded-2xl  bg-red-50 border-2 px-4 py-3 text-left text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border text-2xl text-red-600 transition group-hover:bg-red-50">
                      <i className="ri-close-line"></i>
                    </div>
                    <span>Hesabı Kalıcı Olarak Kapat!</span>
                  </div>
                  <i className="ri-arrow-right-down-line text-lg text-red-500 transition group-hover:text-red-700"></i>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
