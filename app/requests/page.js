"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  /* ---------- AUTH GUARD ---------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, [router]);

  /* ---------- FETCH REQUESTS ---------- */
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      const incomingQuery = query(
        collection(db, "requests"),
        where("toUserId", "==", user.uid)
      );

      const outgoingQuery = query(
        collection(db, "requests"),
        where("fromUserId", "==", user.uid)
      );

      const incomingSnap = await getDocs(incomingQuery);
      const outgoingSnap = await getDocs(outgoingQuery);

      setIncoming(
        incomingSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
      setOutgoing(
        outgoingSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    };

    fetchRequests();
  }, [user]);

  /* ---------- ACCEPT ---------- */
  const acceptRequest = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "accepted",
    });
  };

  /* ---------- REJECT ---------- */
  const rejectRequest = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "rejected",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Requests</h1>
          <p className="text-gray-600">Manage your skill exchange requests</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* INCOMING REQUESTS */}
          <section>
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-blue-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Incoming Requests
              </h2>
              {incoming.length > 0 && (
                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {incoming.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {incoming.length === 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No incoming requests</p>
                </div>
              )}

              {incoming.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                        Wants
                      </span>
                      <p className="text-gray-900 font-medium flex-1">{req.skillRequested}</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                        Offers
                      </span>
                      <p className="text-gray-900 font-medium flex-1">{req.skillOffered}</p>
                    </div>
                  </div>

                  {req.message && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700 italic">"{req.message}"</p>
                    </div>
                  )}

                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(req.id)}
                        className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                      req.status === "accepted" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* OUTGOING REQUESTS */}
          <section>
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-purple-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Outgoing Requests
              </h2>
              {outgoing.length > 0 && (
                <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                  {outgoing.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {outgoing.length === 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No outgoing requests</p>
                </div>
              )}

              {outgoing.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
                        Requested
                      </span>
                      <p className="text-gray-900 font-medium flex-1">{req.skillRequested}</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">
                        Offered
                      </span>
                      <p className="text-gray-900 font-medium flex-1">{req.skillOffered}</p>
                    </div>
                  </div>

                  <div className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                    req.status === "pending" 
                      ? "bg-amber-50 text-amber-700" 
                      : req.status === "accepted"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}