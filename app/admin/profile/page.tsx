// "use client";

// import { useState, useEffect, FormEvent } from "react";
// import { createClient } from "@/lib/supabaseClient";
// import {
//   getUserProfile,
//   updateUserPassword,
//   updateUserProfile,
// } from "@/lib/supabase/profile";

// // A simple placeholder for the Orders tab
// const MyOrders = () => (
//   <div className="p-4 border-t mt-4">
//     <h2 className="text-xl font-semibold">Order History</h2>
//     <p className="text-gray-600 mt-2">You have no past orders.</p>
//   </div>
// );

// export default function ProfilePage() {
//   const supabase = createClient();
//   const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
//   const [loading, setLoading] = useState(true);

//   // State for form fields
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // State for feedback messages
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       console.log("Attempting to fetch profile..."); // Debugging line
//       try {
//         const profile = await getUserProfile(supabase);
//         console.log("Fetched profile data:", profile); // Debugging line
//         if (profile) {
//           setFullName(profile.full_name || "");
//           setEmail(profile.email || "");
//         } else {
//           // Handle case where user is not logged in or profile doesn't exist
//           setError("Could not retrieve profile. Please log in.");
//         }
//       } catch (err) {
//         setError("Failed to load profile data.");
//         console.error(err); // Log the actual error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [supabase]);

//   const handleUpdate = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) {
//         throw new Error("You must be logged in to update your profile.");
//       }

//       // --- Update Profile Name ---
//       await updateUserProfile(supabase, user.id, { full_name: fullName });

//       let successMessage = "Profile updated successfully.";

//       // --- Update Password ---
//       if (password) {
//         if (password !== confirmPassword) {
//           throw new Error("Passwords do not match.");
//         }
//         await updateUserPassword(supabase, password);
//         successMessage = "Profile and password updated successfully.";
//         setPassword("");
//         setConfirmPassword("");
//       }

//       setMessage(successMessage);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !email) {
//     return <div className="text-center p-10">Loading profile...</div>;
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-12 px-4">
//       <div className="max-w-2xl mx-auto">
//         <button
//           onClick={() => window.history.back()}
//           className="text-gray-600 mb-6"
//         >
//           &larr; Back
//         </button>
//         <div className="bg-white p-8 rounded-lg shadow-md">
//           {/* --- Tab Navigation --- */}
//           <div className="flex border-b">
//             <button
//               onClick={() => setActiveTab("profile")}
//               className={`py-2 px-4 text-lg font-medium ${
//                 activeTab === "profile"
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-500"
//               }`}
//             >
//               Update Profile
//             </button>
//             <button
//               onClick={() => setActiveTab("orders")}
//               className={`py-2 px-4 text-lg font-medium ${
//                 activeTab === "orders"
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-500"
//               }`}
//             >
//               My orders
//             </button>
//           </div>

//           {activeTab === "profile" ? (
//             <form onSubmit={handleUpdate} className="mt-8 space-y-6">
//               <input
//                 type="text"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 placeholder="John Doe"
//                 className="w-full p-3 bg-gray-100 border rounded-md"
//               />
//               <input
//                 type="email"
//                 value={email}
//                 disabled
//                 className="w-full p-3 bg-gray-200 border rounded-md cursor-not-allowed"
//               />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="New Password (leave blank to keep unchanged)"
//                 className="w-full p-3 bg-gray-100 border rounded-md"
//               />
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm password"
//                 className="w-full p-3 bg-gray-100 border rounded-md"
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-400"
//               >
//                 {loading ? "Updating..." : "Update"}
//               </button>
//               {message && (
//                 <p className="text-green-600 text-center">{message}</p>
//               )}
//               {error && <p className="text-red-600 text-center">{error}</p>}
//             </form>
//           ) : (
//             <MyOrders />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
