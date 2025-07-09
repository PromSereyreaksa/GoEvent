"use client"
import {
  User,
  Mail,
  Phone,
  Edit3,
  Settings,
  Star,
  Trophy,
  Users,
  CalendarHeart,
  ArrowLeft,
  Shield,
  Briefcase,
  UserCheck,
} from "lucide-react"



// export default function UserProfile() {

//   const h = "hello"
//   const userStats = [
//     {
//       icon: <CalendarHeart className="w-6 h-6" />,
//       title: "Events Created",
//       value: "24",
//       description: "Total events organized",
//     },
//     {
//       icon: <Users className="w-6 h-6" />,
//       title: "Total Guests",
//       value: "1,247",
//       description: "People invited across all events",
//     },
//     {
//       icon: <Star className="w-6 h-6" />,
//       title: "Average Rating",
//       value: "4.9",
//       description: "Based on guest feedback",
//     },
//     {
//       icon: <Trophy className="w-6 h-6" />,
//       title: "Success Rate",
//       value: "98%",
//       description: "Events completed successfully",
//     },
//   ]

//   const recentActivity = [
//     {
//       type: "event_created",
//       title: "Created 'Summer Wedding Reception'",
//       time: "2 hours ago",
//       icon: <CalendarHeart className="w-4 h-4" />,
//     },
//     {
//       type: "guest_rsvp",
//       title: "15 new RSVPs received",
//       time: "5 hours ago",
//       icon: <Users className="w-4 h-4" />,
//     },
//     {
//       type: "event_completed",
//       title: "Corporate Gala 2024 completed",
//       time: "2 days ago",
//       icon: <Trophy className="w-4 h-4" />,
//     },
//   ]

//   return (
//     // <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-neutral-600">
//     //   <style jsx>{`
//     //     .simple-hover {
//     //       transition: all 0.2s ease;
//     //     }
        
//     //     .simple-hover:hover {
//     //       transform: translateY(-2px);
//     //       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     //     }
//     //   `}</style>

//     //   {/* Header Section */}
//     //   <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-20 overflow-hidden">
//     //     {/* Background Pattern */}
//     //     <div className="absolute inset-0 bg-[url('/cta-grid.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>
//     //     <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('/cloud.svg')] bg-repeat-x bg-bottom opacity-30"></div>

//     //     <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
//     //       {/* Back Button */}
//     //       <div className="mb-8">
//     //         <button className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
//     //           <ArrowLeft className="w-5 h-5" />
//     //           <span className="font-medium">Back to Dashboard</span>
//     //         </button>
//     //       </div>

//     //       {/* Profile Header */}
//     //       <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
//     //         {/* Profile Image */}
//     //         <div>
//     //           <div className="relative">
//     //             <img
//     //               src={userData.profile_picture || "/placeholder.svg"}
//     //               alt="Profile Picture"
//     //               className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white shadow-xl"
//     //             />
//     //             <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
//     //               <Edit3 className="w-4 h-4 text-blue-600" />
//     //             </button>

//     //             {/* Status Badges */}
//     //             <div className="absolute -top-2 -right-2 flex flex-col gap-2">
//     //               {userData.is_vendor && (
//     //                 <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
//     //                   <Briefcase className="w-3 h-3" />
//     //                   Vendor
//     //                 </div>
//     //               )}
//     //               {userData.is_partner && (
//     //                 <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
//     //                   <Shield className="w-3 h-3" />
//     //                   Partner
//     //                 </div>
//     //               )}
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Profile Info */}
//     //         <div className="flex-1 text-center lg:text-left">
//     //           <div className="mb-6">
//     //             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
//     //               {userData.first_name} {userData.last_name}
//     //             </h1>
//     //             <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-4">
//     //               <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
//     //                 <Mail className="w-4 h-4 text-blue-100" />
//     //                 <span className="text-blue-100 font-medium">{userData.email}</span>
//     //               </div>
//     //               <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
//     //                 <Phone className="w-4 h-4 text-blue-100" />
//     //                 <span className="text-blue-100 font-medium">{userData.phone_number}</span>
//     //               </div>
//     //             </div>
//     //             <p className="text-white/80 text-lg max-w-2xl">{userData.bio.substring(0, 120)}...</p>
//     //           </div>

//     //           {/* Quick Actions */}
//     //           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//     //             <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 shadow-lg">
//     //               <Edit3 className="w-4 h-4" />
//     //               Edit Profile
//     //             </button>
//     //             <button className="backdrop-blur-sm bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors inline-flex items-center justify-center gap-2 border border-white/20">
//     //               <Settings className="w-4 h-4" />
//     //               Settings
//     //             </button>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Bottom Gradient Overlay */}
//     //     <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-30"></div>
//     //   </section>

//     //   {/* User Information Section */}
//     //   <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
//     //     <div className="max-w-7xl mx-auto">
//     //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
//     //         {/* Personal Information */}
//     //         <div className="lg:col-span-2">
//     //           <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 shadow-lg">
//     //             <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-8">Personal Information</h2>
//     //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//     //               <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition-colors simple-hover">
//     //                 <div className="p-3 bg-blue-100 rounded-xl">
//     //                   <User className="w-5 h-5 text-blue-600" />
//     //                 </div>
//     //                 <div>
//     //                   <p className="text-sm text-neutral-500 font-medium">Full Name</p>
//     //                   <p className="text-black font-semibold">
//     //                     {userData.first_name} {userData.last_name}
//     //                   </p>
//     //                 </div>
//     //               </div>
//     //               <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition-colors simple-hover">
//     //                 <div className="p-3 bg-green-100 rounded-xl">
//     //                   <Mail className="w-5 h-5 text-green-600" />
//     //                 </div>
//     //                 <div>
//     //                   <p className="text-sm text-neutral-500 font-medium">Email</p>
//     //                   <p className="text-black font-semibold">{userData.email}</p>
//     //                 </div>
//     //               </div>
//     //               <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition-colors simple-hover">
//     //                 <div className="p-3 bg-purple-100 rounded-xl">
//     //                   <Phone className="w-5 h-5 text-purple-600" />
//     //                 </div>
//     //                 <div>
//     //                   <p className="text-sm text-neutral-500 font-medium">Phone</p>
//     //                   <p className="text-black font-semibold">{userData.phone_number}</p>
//     //                 </div>
//     //               </div>
//     //               <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition-colors simple-hover">
//     //                 <div className="p-3 bg-orange-100 rounded-xl">
//     //                   <UserCheck className="w-5 h-5 text-orange-600" />
//     //                 </div>
//     //                 <div>
//     //                   <p className="text-sm text-neutral-500 font-medium">Account Status</p>
//     //                   <div className="flex gap-2">
//     //                     {userData.is_vendor && <span className="text-green-600 font-semibold text-sm">Vendor</span>}
//     //                     {userData.is_partner && <span className="text-purple-600 font-semibold text-sm">Partner</span>}
//     //                     {!userData.is_vendor && !userData.is_partner && (
//     //                       <span className="text-blue-600 font-semibold text-sm">Regular User</span>
//     //                     )}
//     //                   </div>
//     //                 </div>
//     //               </div>
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Recent Activity */}
//     //         <div>
//     //           <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
//     //             <h3 className="text-xl font-semibold text-black mb-6">Recent Activity</h3>
//     //             <div className="space-y-4">
//     //               {recentActivity.map((activity, index) => (
//     //                 <div
//     //                   key={index}
//     //                   className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors simple-hover"
//     //                 >
//     //                   <div className="p-2 bg-blue-100 rounded-lg mt-1">{activity.icon}</div>
//     //                   <div className="flex-1">
//     //                     <p className="text-black font-medium text-sm">{activity.title}</p>
//     //                     <p className="text-neutral-500 text-xs mt-1">{activity.time}</p>
//     //                   </div>
//     //                 </div>
//     //               ))}
//     //             </div>
//     //             <button className="w-full mt-6 text-blue-600 font-medium hover:text-blue-700 transition-colors py-2 rounded-xl hover:bg-blue-50">
//     //               View All Activity
//     //             </button>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </section>

//     // </div>
  
//     <div>
//       <h1> {h}</h1>
//     </div>
//   )
  
// }

import React, { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>User Profile</h2>
      <div style={styles.profileCard}>
        <img
          src={profileData.profile_picture || "https://via.placeholder.com/150"}
          alt="Profile"
          style={styles.profileImage}
        />
        <div style={styles.info}>
          <p><strong>ID:</strong> {profileData.id}</p>
          <p><strong>Name:</strong> {profileData.first_name} {profileData.last_name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Phone:</strong> {profileData.phone_number || "N/A"}</p>
          <p><strong>Bio:</strong> {profileData.bio || "No bio available"}</p>
          <p><strong>Is Vendor:</strong> {profileData.is_ventor ? "Yes" : "No"}</p>
          <p><strong>Is Partner:</strong> {profileData.is_partner ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
  },
  profileCard: {
    display: "flex",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "50%",
    marginRight: "1.5rem",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
};

export default UserProfile;
