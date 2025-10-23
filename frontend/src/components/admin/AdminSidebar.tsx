import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Award,
  LogOut,
  Mail,
  Code,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // ✅ import useAuth

interface AdminSidebarProps {
  isOpen: boolean;
}

const sidebarLinks = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/blogs', icon: FileText, label: 'Blog' },
  { path: '/admin/projects', icon: FolderKanban, label: 'Project' },
  { path: '/admin/certificates', icon: Award, label: 'Certificate' },
  { path: '/admin/skills', icon: Code, label: 'Skills' },
  { path: '/admin/contacts', icon: Mail, label: 'Messages' },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ from context

  const handleLogout = async () => {
    try {
      await logout(); // ✅ calls context logout (which calls authService.logout internally)
      navigate('/'); // ✅ redirect to home
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.aside
      initial={{ x: -264 }}
      animate={{ x: isOpen ? 0 : -264 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-20"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-orange-500">Admin Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
