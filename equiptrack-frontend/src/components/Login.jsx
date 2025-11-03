import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentando login com:", { email, senha });
    // Aqui futuramente conectaremos ao backend
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#006c66] to-[#009688]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <img
          src="/logo.png"
          alt="Ensitec Tecnologia"
          className="mx-auto h-20 mb-4"
        />
        <h1 className="text-2xl font-semibold text-[#006c66] mb-6">
          EquipTrack
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006c66]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006c66]"
          />
          <button
            type="submit"
            className="w-full bg-[#006c66] hover:bg-[#009688] text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Entrar
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} EquipTrack · Ensitec Tecnologia
        </p>
      </div>
    </div>
  );
}
