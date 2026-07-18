import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-blue-600 dark:text-blue-400 tracking-tight">
          ระบบประชุมทางไกลด้วยเสียงแบบ self-hosted
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          The Web-based Real-time Voice Meeting Platform. Members can join instantly through shared links without registering. Hosts can log in to create rooms, manage meetings, and access AI-generated summaries.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/login" 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200"
          >
            Host Login
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-200"
          >
            Create Account
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-500">
        &copy; {new Date().getFullYear()} ระบบประชุมทางไกลด้วยเสียงแบบ self-hosted. All rights reserved.
      </footer>
    </div>
  );
}
