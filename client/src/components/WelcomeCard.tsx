import { useAuthStore } from "../store/authStore";

export default function WelcomeCard() {
  const { user } = useAuthStore();

  return (
    <div className="bg-gray-50 rounded-lg p-5 mb-6">
      <h2 className="text-lg font-bold mb-2">Welcome, {user?.name}</h2>
      <p className="text-sm text-gray-600">Email: {user?.email}</p>
    </div>
  );
}
