"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check auth on mount
    checkAuth().finally(() => setIsChecking(false));
  }, [checkAuth]);

  useEffect(() => {
    // Redirect if completely finished checking and no user is found
    if (!isChecking && !isLoading && !user) {
      router.push("/login");
    }
  }, [isChecking, isLoading, user, router]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect shortly
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Host Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user.name || user.email}</p>
          </div>
          <button 
            onClick={() => logout()} 
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-500">
          <p>The UI/UX team will design the room management interface here.</p>
        </div>
      </div>
    </div>
  );
}
