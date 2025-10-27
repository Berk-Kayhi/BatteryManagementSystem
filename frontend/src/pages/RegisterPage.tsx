import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      alert(response.data.message);
      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Bilinmeyen bir hata oluştu!");
      }
    }
  };
  return (
    <div className="flex w-screen h-screen font-sans">
      <div className="flex justify-center items-center flex-1 p-4 w-full">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="w-11/12 p-8 rounded-xl bg-white md:border-4 border-gray-900 ">
            <h1 className="text-3xl mb-6 font-extrabold text-gray-900 md:hidden">
              Kayıt Ol
            </h1>
            <h1 className="hidden md:block text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Kayıt Ol
            </h1>
            <form className="flex flex-col gap-7 " onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Ad"
                className="p-3 rounded-lg border-2 border-gray-900 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
              />

              <input
                type="email"
                name="email"
                placeholder="E-Posta"
                className="p-3 rounded-lg border-2 border-gray-900 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
              />

              <input
                type="password"
                name="password"
                placeholder="Şifre"
                className="p-3 rounded-lg border-2 border-gray-900 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]"
              />

              <button className="p-3 rounded-lg bg-gray-600 text-white font-extrabold text-lg  border-2 border-gray-900 hover:bg-gray-700 transition">
                Kayıt Ol
              </button>

              <p className="text-center text-sm text-gray-700">
                Zaten hesabın var mı?{" "}
                <a
                  onClick={() => {
                    navigate("/login");
                  }}
                  className=" cursor-pointer text-orange-600 hover:text-orange-700 font-bold underline transition"
                >
                  Giriş Yap
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
