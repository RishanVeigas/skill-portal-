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

  // Auth guard
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
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>User profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-4">{user.name}</h2>

        <p className="text-gray-600 mb-4">
          <strong>Contact Email:</strong> {user.email}
        </p>

        <div className="mb-4">
          <h3 className="font-semibold">Skills Offered</h3>
          <p className="text-gray-600">
            {user.offeredSkills?.length
              ? user.offeredSkills.join(", ")
              : "None"}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold">Skills Requested</h3>
          <p className="text-gray-600">
            {user.requestedSkills?.length
              ? user.requestedSkills.join(", ")
              : "None"}
          </p>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
        >
          Back
        </button>
      </div>
    </div>
  );
}