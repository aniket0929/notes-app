import { useAuthStore } from "../store/authStore";
import logo from "../assets/icon.png"

export default function DashboardHeader() {
  const { signout } = useAuthStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <button
        onClick={signout}
        className="text-blue-500 underline hover:text-blue-700 text-sm "
      >
        Sign Out
      </button>
    </div>
  );
}
