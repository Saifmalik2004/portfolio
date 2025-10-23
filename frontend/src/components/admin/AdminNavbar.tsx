import { useEffect, useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { authService } from '@/services/authService'; // ✅ adjust the path as needed
import type { User as UserType } from '@/types/auth';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
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

          <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 w-48"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {user?.fullName || 'Admin User'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
