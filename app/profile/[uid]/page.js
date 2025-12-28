"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";

export default function PeerProfile() {
  const router = useRouter();
  const { uid } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      }
    });

    return () => unsub();
  }, [router]);

  // Fetch peer profile
  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", uid));

        if (snap.exists()) {
          setUser(snap.data());
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">This user profile doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto">
  
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
         
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">👤</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {user.name}
                </h1>
                <p className="text-indigo-100">{user.email}</p>
              </div>
            </div>
          </div>

          
          <div className="p-8 space-y-8">
            {/* Skills I Can Teach */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎓</span>
                <h3 className="text-xl font-bold text-gray-900">
                  Skills I can teach
                </h3>
              </div>
              {user.offeredSkills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.offeredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100 hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed yet</p>
              )}
            </div>

            
            <div className="border-t border-gray-200"></div>

            {/* Skills I Want to Learn */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-bold text-gray-900">
                  Skills I want to learn
                </h3>
              </div>
              {user.requestedSkills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.requestedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100 hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills listed yet</p>
              )}
            </div>

           
            <div className="pt-4">
              <button
                onClick={() => router.push(`/send-request/${uid}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <span className="text-xl">📤</span>
                Send Skill Exchange Request
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Skill Exchange</h4>
              <p className="text-sm text-blue-800">
                Send a request to connect and start learning from each other. Build meaningful peer-to-peer learning relationships!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}