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

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setCurrentProfile(snap.data());
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs
        .map((d) => ({
          uid: d.id,
          ...d.data(),
        }))
        .filter((u) => u.uid !== currentUser.uid);

      setUsers(data);
    };

    fetchUsers();
  }, [currentUser]);


  const computeMatchScore = (me, other) => {
    const myRequested = (me?.requestedSkills || []).map((s) => s.toLowerCase());
    const theirOffered = (other?.offeredSkills || []).map((s) =>
      s.toLowerCase()
    );

    return myRequested.filter((skill) => theirOffered.includes(skill)).length;
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

 
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.offeredSkills?.join(",").toLowerCase().includes(q) ||
      user.requestedSkills?.join(",").toLowerCase().includes(q)
    );
  });

 
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {currentProfile?.name || "Student"}!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push("/requests")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
              >
                <span className="text-lg">📬</span>
                Requests
              </button>

              <button
                onClick={() => router.push("/profile-setup")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
              >
                <span className="text-lg">👤</span>
                My Profile
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm"
              >
                <span className="text-lg">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Best Matches Section */}
        {matchedUsers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Best Matches for You
                </h2>
                <p className="text-sm text-gray-600">
                  Students who can teach what you want to learn
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedUsers.map((user) => (
                <div
                  key={user.uid}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
                >
                  <div className="p-6">
                    {/* Header with match score badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {user.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-sm">
                        ⭐ {user.matchScore}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-3 mb-5">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Can Teach
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.offeredSkills?.length > 0 ? (
                            user.offeredSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Wants to Learn
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {user.requestedSkills?.length > 0 ? (
                            user.requestedSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/profile/${user.uid}`)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8 text-black">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold te">
                All Students
              </h2>
              <p className="text-sm text-gray-600">
                Browse and connect with other learners
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by skill (React, Python, etc.)"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* All Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {user.name}
                </h3>

                
                <div className="space-y-3 mb-5">
                  <div>
                    <p className="text-xs font-semibold  uppercase tracking-wide mb-2">
                      Can Teach
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.offeredSkills?.length > 0 ? (
                        user.offeredSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs">None</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Wants to Learn
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.requestedSkills?.length > 0 ? (
                        user.requestedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                </div>

               
                <button
                  onClick={() => router.push(`/profile/${user.uid}`)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No students found for this skill
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Try searching for a different skill
            </p>
          </div>
        )}
      </div>
    </div>
  );
}