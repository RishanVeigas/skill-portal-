"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function SendRequest() {
  const router = useRouter();
  const { uid: toUserId } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [peer, setPeer] = useState(null);

  const [skillRequested, setSkillRequested] = useState("");
  const [skillOffered, setSkillOffered] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setCurrentUser(user);
      }
    });

    return () => unsub();
  }, [router]);

  /* ---------- FETCH PEER PROFILE ---------- */
  useEffect(() => {
    if (!toUserId) return;

    const fetchPeer = async () => {
      const snap = await getDoc(doc(db, "users", toUserId));
      if (snap.exists()) {
        setPeer(snap.data());
      }
    };

    fetchPeer();
  }, [toUserId]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!skillRequested || !skillOffered) {
      setError("Please select both skills.");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        fromUserId: currentUser.uid,
        toUserId,
        skillRequested,
        skillOffered,
        message,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("Request Sent Successfully")
      router.push("/dashboard");

    } catch (err) {
      setError("Failed to send request.");
    }
  };

  if (!currentUser || !peer) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {peer.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Send Skill Request
              </h1>
              <p className="text-gray-600 mt-1">
                Connect with <span className="font-semibold text-blue-600">{peer.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Requested */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                I want to learn
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-gray-50 hover:bg-white text-gray-900"
                value={skillRequested}
                onChange={(e) => setSkillRequested(e.target.value)}
              >
                <option value="">Select a skill they offer</option>
                {peer.offeredSkills?.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {peer.offeredSkills?.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No skills offered by this user</p>
              )}
            </div>

           
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>

            {/* Skill Offered */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                I offer in return
              </label>
              <select
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none bg-gray-50 hover:bg-white text-gray-900"
                value={skillOffered}
                onChange={(e) => setSkillOffered(e.target.value)}
              >
                <option value="">Select a skill they need</option>
                {peer.requestedSkills?.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {peer.requestedSkills?.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No skills requested by this user</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message (Optional)
              </label>
              <textarea
                placeholder="Introduce yourself and explain why you'd like to connect..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 hover:bg-white resize-none text-gray-900"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Adding a personal message increases your chances of getting accepted
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              Your request will be sent to {peer.name}. They'll be notified and can choose to accept or decline your skill exchange proposal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}