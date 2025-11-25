import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const inputStyles =
  "w-full rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-base text-gray-900 placeholder-gray-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40";

export default function RegisterPage() {
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        username,
        email,
        password,
      });
      toast.success(response.data.message || "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
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
                Kayıt Ol
              </h1>
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Ad
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Ad Soyad"
                    className={inputStyles}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="ornek@firma.com"
                    className={inputStyles}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Şifre
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="En az 8 karakter"
                    className={inputStyles}
                    required
                  />
                </div>

                <button className="w-full rounded-2xl bg-amber-500 py-3 text-lg font-semibold text-white transition hover:bg-amber-600">
                  Hesap Oluştur
                </button>

                <p className="text-center text-sm text-gray-600">
                  Zaten hesabın var mı?{" "}
                  <button
                    type="button"
                    className="font-semibold text-amber-600 hover:text-amber-500"
                    onClick={() => navigate("/login")}
                  >
                    Giriş yap
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
