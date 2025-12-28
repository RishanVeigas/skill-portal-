"use client"; 
 
import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { collection, getDocs } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { auth, db } from "../firebase"; 
 
export default function Dashboard() { 
  const router = useRouter(); 
 
  const [users, setUsers] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [currentUser, setCurrentUser] = useState(null); 
 
  // Auth guard 
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
 
  // Fetch users 
  useEffect(() => { 
    if (!currentUser) return; 
 
    const fetchUsers = async () => { 
      const querySnapshot = await getDocs(collection(db, "users")); 
 
      const data = querySnapshot.docs 
        .map((doc) => ({ 
          uid: doc.id,
          ...doc.data(), 
        })) 
        .filter((u) => u.uid !== currentUser.uid); 
 
      setUsers(data); 
    }; 
 
    fetchUsers(); 
  }, [currentUser]); 
 
  // Filter logic 
  const filteredUsers = users.filter((user) => { 
    const skillText = search.toLowerCase(); 
 
    return ( 
      user.offeredSkills?.join(",").toLowerCase().includes(skillText) || 
      user.requestedSkills?.join(",").toLowerCase().includes(skillText) 
    ); 
  }); 
 
  if (!currentUser) return null; 
 
  return ( 
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-8 text-black"> 
      <div className="max-w-6xl mx-auto"> 
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Discover Skills</h1>
          <button
            onClick={() => router.push(`/profile/${currentUser.uid}`)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            My Profile
          </button>
        </div>
 
        
        <div className="relative mb-8">
          <input 
            type="text" 
            placeholder="Search by skill (e.g. React, Python, Guitar...)" 
            className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm text-gray-700 bg-white" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
 
        {/* User Cards */} 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
          {filteredUsers.map((user) => ( 
            <div 
              key={user.uid} 
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100"
            > 
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold ml-3 text-gray-800"> 
                  {user.name} 
                </h3> 
              </div>
 
              <div className="space-y-3 mb-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Offers</p>
                  <div className="flex flex-wrap gap-1">
                    {user.offeredSkills?.length > 0 ? (
                      user.offeredSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Wants to Learn</p>
                  <div className="flex flex-wrap gap-1">
                    {user.requestedSkills?.length > 0 ? (
                      user.requestedSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </div>
                </div>
              </div>
 
              <button 
                onClick={() => router.push(`/profile/${user.uid}`)} 
                className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm" 
              > 
                View Profile 
              </button> 
            </div> 
          ))} 
        </div>
 
        {filteredUsers.length === 0 && ( 
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No students found for this skill.</p>
            <p className="text-gray-400 text-sm mt-2">Try searching for a different skill</p>
          </div>
        )}
      </div> 
    </div> 
  ); 
}
