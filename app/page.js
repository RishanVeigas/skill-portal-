"use client"
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              PS
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Peer Skill Exchange
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
          <span className="text-lg">✨</span>
          Connect. Learn. Grow Together.
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Peer Skill Exchange
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
            Platform
          </span>
        </h1>
        
        <p className="text-gray-600 text-lg max-w-2xl mb-10 leading-relaxed">
          A college-based platform where students can showcase their skills,
          request skills they want to learn, and connect with peers for
          collaborative learning experiences.
        </p>
        
        <button
          onClick={() => router.push("/register")}
          className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 flex items-center gap-2"
        >
          Get Started
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </button>
      </main>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with fellow students and build a collaborative learning community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform text-white text-2xl font-bold">
                📚
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Showcase Skills</h3>
              <p className="text-gray-600 leading-relaxed">
                List the skills you already have and help peers learn from your expertise.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform text-white text-2xl font-bold">
                💡
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Request Skills</h3>
              <p className="text-gray-600 leading-relaxed">
                Mention skills you want to learn and find the right peers to guide you.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform text-white text-2xl font-bold">
                🔍
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Discover Peers</h3>
              <p className="text-gray-600 leading-relaxed">
                Search students based on offered or requested skills and connect instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 text-center py-6">
        <p className="text-sm text-gray-500">
          College Peer Skill Exchange Platform – Academic Project
        </p>
      </footer>
    </div>
  );
}