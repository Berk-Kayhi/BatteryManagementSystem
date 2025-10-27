import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Tüm alanlar zorunludur!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        {
          email,
          password,
          remember,
        },
        { withCredentials: true }
      );
      alert(response.data.message);
      navigate("/main");
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error);
      } else {
        alert("Bilinmeyen bir hata oluştu!");
      }
    }
  };

  return (
    <div className="flex w-screen h-screen font-sans">
      <div className="flex justify-center items-center flex-1 p-4 w-full">
        <div className="flex w-full max-w-md flex-col items-center relative">
          <div className="w-11/12 p-8 rounded-xl  bg-white md:border-4 border-gray-900">
            <h1 className="text-3xl mb-6 font-extrabold text-gray-900 md:hidden">
              Giriş Yap
            </h1>
            <h1 className="hidden md:block text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Giriş Yap
            </h1>
            <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
              <input
                type="text"
                name="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta"
                className="p-3 rounded-lg border-2 border-gray-900 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
              />

              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="p-3 rounded-lg border-2 border-gray-900 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
              />
              <div className="justify-start flex ">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-5 h-5"
                />
                <label className="ml-2 text-gray-700 text-center">
                  Beni Hatırla
                </label>
              </div>

              <button className="p-3 rounded-lg bg-gray-600 text-white font-extrabold text-lg border-2 border-gray-900 hover:bg-gray-700 transition">
                Giriş Yap
              </button>
              <p className="text-center text-sm text-gray-700">
                Hesabın yok mu?{" "}
                <a
                  onClick={() => navigate("/register")}
                  className="cursor-pointer text-orange-600 hover:text-orange-700 font-bold underline transition"
                >
                  Kayıt Ol
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
