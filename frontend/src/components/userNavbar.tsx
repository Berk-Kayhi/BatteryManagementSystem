import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type UserNavbarProps = {
  userName: string;
  userEmail: string;
};

export default function UserNavbar({ userName, userEmail }: UserNavbarProps) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showProfileDetails, setProfileDetails] = useState(false);
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
      await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Çıkış yaparken bir hata oluştu:", error);
      alert("Çıkış yaparken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="top-4 fixed left-4 z-50">
      <button
        onClick={() => handleShowPopup()}
        className="group flex items-center gap-3 rounded-xl bg-white border-4 border-gray-900 px-4 py-3 transition-all duration-200 hover:border-amber-600 hover:bg-amber-50"
        aria-label="Kullanıcı Menüsünü Aç"
      >
        <i className="ri-menu-line text-2xl text-gray-900 transition-colors group-hover:text-amber-600"></i>
        <span className="font-semibold text-lg text-gray-900 transition-colors group-hover:text-amber-600">
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
            className="w-max rounded-xl bg-white border-4 absolute top-15 border-gray-900 mt-4 px-6 py-6 text-gray-800"
            style={{ originX: 0, originY: 0 }}
          >
            <nav className="flex flex-col space-y-4 text-3xl  font-semibold gap-4 ">
              <button
                className="text-left hover:text-amber-600 hover:translate-x-2 transition-all duration-200"
                onClick={() => navigate("/main")}
              >
                <i className="ri-bar-chart-line"> </i> Canlı Sensör Verisi
              </button>
              <button
                className="text-left hover:text-amber-600 hover:translate-x-2 transition-all duration-200"
                onClick={() => navigate("/graph")}
              >
                <i className="ri-numbers-line"> </i> Batarya Sistem Durumu
              </button>
              <button
                className="text-left hover:text-amber-600 hover:translate-x-2 transition-all duration-200"
                onClick={() => navigate("/predictions")}
              >
                <i className="ri-brain-line"> </i> Grafik Ekranı (AI)
              </button>
              <button
                className="text-left hover:text-amber-600 hover:translate-x-2 transition-all duration-200"
                onClick={() => navigate("/timestamp")}
              >
                <i className="ri-time-line"> </i>Timestamp
              </button>
              <button
                className="text-left hover:text-amber-600 hover:translate-x-2 transition-all duration-200"
                onClick={() => {
                  setProfileDetails(true);
                  setShowPopup(false);
                }}
              >
                <i className="ri-profile-line"> </i> Profil
              </button>

              <button
                onClick={handleLogout}
                className="text-left text-red-600 hover:text-red-800 hover:translate-x-2 transition-all duration-200"
              >
                <i className="ri-logout-box-line"> </i> Çıkış Yap
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
            className="w-max rounded-xl bg-white border-4 absolute top-15 border-gray-900 mt-4 px-6 py-6 text-gray-800"
            style={{ originX: 0, originY: 0 }}
          >
            <nav className="flex flex-col space-y-4 text-3xl font-semibold ">
              <div className="flex justify-between gap-40 ">
                <button
                  className="text-left hover:text-red-600 transition-all duration-200"
                  onClick={() => {
                    setProfileDetails(false);
                    setShowPopup(true);
                  }}
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                <button
                  className="text-left hover:text-red-600 right-0 transition-all duration-200"
                  onClick={() => setProfileDetails(false)}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              <div>Kullanıcı Adı : {userName}</div>
              <div>E Posta : {userEmail}</div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
