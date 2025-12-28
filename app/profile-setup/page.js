"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [offeredSkills, setOfferedSkills] = useState("");
  const [requestedSkills, setRequestedSkills] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Auth guard + fetch profile
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

    setMessage("Profile saved successfully");
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {name ? "Update Profile" : "Complete Your Profile"}
        </h2>

        {message && (
          <p className="text-green-600 text-sm mb-4">{message}</p>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Skills you offer (comma separated)"
            className="w-full px-4 py-3 border rounded-lg"
            value={offeredSkills}
            onChange={(e) => setOfferedSkills(e.target.value)}
          />

          <input
            type="text"
            placeholder="Skills you want to learn (comma separated)"
            className="w-full px-4 py-3 border rounded-lg"
            value={requestedSkills}
            onChange={(e) => setRequestedSkills(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
