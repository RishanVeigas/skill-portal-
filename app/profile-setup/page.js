"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
// Added Lucide icons for a professional look
import { User, BookOpen, Sparkles, Save, ArrowLeft, Loader2 } from "lucide-react";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [offeredSkills, setOfferedSkills] = useState("");
  const [requestedSkills, setRequestedSkills] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setOfferedSkills((data.offeredSkills || []).join(", "));
        setRequestedSkills((data.requestedSkills || []).join(", "));
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name,
          email: user.email,
          offeredSkills: offeredSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          requestedSkills: requestedSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Profile updated successfully!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Top Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Decoration */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
          
          <div className="px-8 pb-8">
            {/* Avatar Placeholder */}
            <div className="relative -mt-12 mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-md border-4 border-white text-blue-600">
                <User size={48} />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {name ? "Update Profile" : "Complete Your Profile"}
              </h2>
              <p className="text-gray-500 text-sm">
                Share your expertise and find what you want to learn.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Offered Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills I Can Teach</label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="React, Cooking, Graphic Design..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={offeredSkills}
                    onChange={(e) => setOfferedSkills(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400 italic">Separate skills with commas</p>
              </div>

              {/* Requested Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills I Want To Learn</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Python, Public Speaking, Spanish..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    value={requestedSkills}
                    onChange={(e) => setRequestedSkills(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}