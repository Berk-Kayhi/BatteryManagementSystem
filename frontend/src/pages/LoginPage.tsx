import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast, { Toaster } from "react-hot-toast";

const inputStyles =
  "w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-base text-gray-900 placeholder-gray-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/network", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Tüm alanlar zorunludur!");
      return;
    }
    try {
      await login(email, password);
      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/network"), 1000);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error || "Giriş başarısız!");
      } else {
        toast.error("Bilinmeyen bir hata oluştu!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-white to-amber-100">
      <Toaster position="top-right" />
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center px-8 py-12 lg:px-12">
          <div className="p-12 border-3 shadow-2xl rounded-3xl">
            <div className="w-full max-w-sm">
              <h1 className="text-3xl font-black text-gray-900 underline underline-offset-12 decoration-gray-500/50">
                Giriş Yap
              </h1>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@firma.com"
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputStyles}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    Beni hatırla
                  </label>
                </div>

                <button className="w-full rounded-2xl bg-amber-500 py-3 text-lg font-semibold text-white transition hover:bg-amber-600">
                  Devam Et
                </button>

                <p className="text-center text-sm text-gray-600">
                  Hesabın yok mu?{" "}
                  <button
                    type="button"
                    className="font-semibold text-amber-600 hover:text-amber-500"
                    onClick={() => navigate("/register")}
                  >
                    Kayıt ol
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
