import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="text-red-500 mb-4">
        <ShieldAlert size={60} />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">401 Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-6">
        You don't have permission to view this page.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
