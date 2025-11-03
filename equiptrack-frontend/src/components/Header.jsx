export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow-md p-3">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo Ensitec Tecnologia" className="h-10 mr-3" />
        <h1 className="text-2xl font-semibold text-[#006c66]">EquipTrack</h1>
      </div>
      <span className="text-gray-500 text-sm pr-3">v1.0.0</span>
    </header>
  );
}

