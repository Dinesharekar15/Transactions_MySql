import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../url";

export const Appbar = () => {
  const navigate=useNavigate();
  const [showUserInfo,setShowUserInfo]=useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogout=()=>{
    localStorage.removeItem("token");  // Remove token from localStorage
    navigate("/signin");
  }
  const handleAvatarClick=()=>{
    setShowUserInfo(!showUserInfo)
    if (!userInfo) {
      fetchUserInfo(); // Fetch user info only if it's not already fetched
    }
  }
  const fetchUserInfo= async()=>{
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${baseUrl}/api/users/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(res.data); // Set user info from the response
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Handle error (e.g., show a notification)
    }
  }
  return (
    <div>
      <div className="sticky top-0 shadow h-14 flex justify-between items-center bg-blue-600 text-white px-4 z-10">
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-base md:text-lg">
            Payments App
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col justify-center mr-2 md:mr-4">
            <span className="text-sm md:text-base">Hello</span>
          </div>
          <div
            onClick={handleAvatarClick}
            className="rounded-full h-10 w-10 md:h-12 md:w-12 bg-green-500 flex justify-center items-center cursor-pointer"
          >
            <span className="text-lg md:text-xl font-bold text-white">U</span>
          </div>

          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Logout
          </button>
        </div>
        {showUserInfo && userInfo && ( // Show user info only if it exists
          <div className="absolute top-16 right-4 bg-black shadow-lg rounded-lg p-4 w-64">
            <h2 className="font-semibold text-lg mb-2">User Information</h2>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Account Balance:</strong> Rs:{userInfo.balance}</p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
