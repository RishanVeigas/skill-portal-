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

  /* ---------- AUTH GUARD ---------- */
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

  /* ---------- SUBMIT REQUEST ---------- */
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
    <div className="min-h-screen bg-gray-100 px-6 py-10 text-black">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Send Skill Request to {peer.name}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Requested */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Skill you want to learn
            </label>
            <select
              className="w-full px-4 py-3 border rounded-lg"
              value={skillRequested}
              onChange={(e) => setSkillRequested(e.target.value)}
            >
              <option value="">Select</option>
              {peer.offeredSkills?.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Offered */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Skill you offer in return
            </label>
            <select
              className="w-full px-4 py-3 border rounded-lg"
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
            >
              <option value="">Select</option>
              {peer.requestedSkills?.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <textarea
            placeholder="Optional message"
            className="w-full px-4 py-3 border rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}
