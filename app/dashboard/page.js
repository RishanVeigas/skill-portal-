"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Dashboard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      // Fetch current user's profile
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setCurrentProfile(snap.data());
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  /* ---------------- FETCH OTHER USERS ---------------- */
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs
        .map((d) =>({
          uid : d.id, ...d.data(),
        }))
        .filter((u) => u.uid !== currentUser.uid);

      setUsers(data);
    };

    fetchUsers();
  }, [currentUser]);

  /* ---------------- MATCHING LOGIC ---------------- */
  const computeMatchScore = (me, other) => {
    const myRequested = (me?.requestedSkills || []).map((s) =>
      s.toLowerCase()
    );
    const theirOffered = (other?.offeredSkills || []).map((s) =>
      s.toLowerCase()
    );

    return myRequested.filter((skill) =>
      theirOffered.includes(skill)
    ).length;
  };

  const matchedUsers = currentProfile
    ? users
        .map((u) => ({
          ...u,
          matchScore: computeMatchScore(currentProfile, u),
        }))
        .filter((u) => u.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
    : [];

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.offeredSkills?.join(",").toLowerCase().includes(q) ||
      user.requestedSkills?.join(",").toLowerCase().includes(q)
    );
  });

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="space-x-3">
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 border rounded-md"
            >
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* BEST MATCHES */}
        {matchedUsers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Best Matches for You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedUsers.map((user) => (
                <div
                  key={user.uid}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Offers:</strong>{" "}
                    {user.offeredSkills?.join(", ") || "None"}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Wants:</strong>{" "}
                    {user.requestedSkills?.join(", ") || "None"}
                  </p>

                  <p className="text-green-600 text-sm mb-4">
                    Match Score: {user.matchScore}
                  </p>

                  <button
                    onClick={() => router.push(`/profile/${user.uid}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by skill (React, Python, etc.)"
          className="w-full mb-6 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ALL USERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">
                {user.name}
              </h3>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Offers:</strong>{" "}
                {user.offeredSkills?.join(", ") || "None"}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                <strong>Wants:</strong>{" "}
                {user.requestedSkills?.join(", ") || "None"}
              </p>

              <button
                onClick={() => router.push(`/profile/${user.uid}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No students found for this skill.
          </p>
        )}
      </div>
    </div>
  );
}
