"use client";

import { useEffect, useState } from "react";
import { Menu, Bell, User } from "lucide-react";
import { authService } from "@/services/authService";
import contactService from "@/services/contactService"; // ✅ ensure this is a named export
import type { User as UserType } from "@/types/auth";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentUser, count] = await Promise.all([
          authService.getCurrentUser(),
          contactService.getUnreadMsgCount(),
        ]);

        setUser(currentUser);
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch navbar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4">
      <div className="h-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            {!loading && unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {user?.fullName || "Admin User"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
