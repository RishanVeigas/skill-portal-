"use client"
import { useRouter } from "next/navigation";

export default function Landing() {
  const router=useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">
            Peer Skill Exchange
          </h2>
          <div className="space-x-3">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Peer Skill Exchange Platform
        </h1>
        <p className="text-gray-600 max-w-xl mb-6">
          A college-based platform where students can showcase their skills,
          request skills they want to learn, and connect with peers for
          collaborative learning.
        </p>
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Get Started
        </button>
      </main>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-2">Showcase Skills</h3>
            <p className="text-gray-600 text-sm">
              List the skills you already have and help peers learn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-2">Request Skills</h3>
            <p className="text-gray-600 text-sm">
              Mention skills you want to learn and find the right peers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-2">Discover Peers</h3>
            <p className="text-gray-600 text-sm">
              Search students based on offered or requested skills.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 text-center py-4">
        <p className="text-sm text-gray-500">
          College Peer Skill Exchange Platform – Academic Project
        </p>
      </footer>
    </div>
  );
}
