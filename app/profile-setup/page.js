"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
          >
            <span>←</span> Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your profile information and skills
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills I Can Teach
              </label>
              <input
                type="text"
                placeholder="e.g., React, Photography, Cooking"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={offeredSkills}
                onChange={(e) => setOfferedSkills(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500">Separate multiple skills with commas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills I Want to Learn
              </label>
              <input
                type="text"
                placeholder="e.g., Python, Spanish, Guitar"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={requestedSkills}
                onChange={(e) => setRequestedSkills(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}