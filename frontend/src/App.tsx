import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import PublicLayout from "@/components/public/layout/PublicLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/RegisterPage";
import VerifyEmail from "./pages/auth/VerifyEmailPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/public/NotFound";

import HomePage from "@/pages/public/HomePage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetail from "@/pages/public/ProjectDetail";
import BlogPage from "@/pages/public/BlogPage";
import BlogDetail from "@/pages/public/BlogDetail";
import CertificatesPage from "@/pages/public/CertificatesPage";

import BlogManagement from "@/pages/admin/BlogsManagementPage";
import SkillManagement from "@/pages/admin/SkillsManagementPage";
import BlogEditorPage from "@/pages/admin/blogs/BlogEditorPage";
import Dashboard from "@/pages/admin/Dashboard";

import AdminLayout from "./components/public/layout/AdminLayout";
import ProjectManagement from "./pages/admin/ProjectsManagementPage";
import CertificateManagement from "./pages/admin/CertificatesManagementPage";
import ContactManagement from "./pages/admin/ContactsManagementPage";
import { useBackendWakeup } from "./hooks/use-loader";
import BackendLoader from "./components/Loading";

const queryClient = new QueryClient();

const App = () => {
  const loading = useBackendWakeup();

  if (loading) {
    return <BackendLoader />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* Global Toasters */}
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* ✅ Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
                <Route
                  path="/auth/reset-password"
                  element={<ResetPassword />}
                />

                {/* ✅ Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:slug" element={<ProjectDetail />} />
                  <Route path="/blogs" element={<BlogPage />} />
                  <Route path="/blogs/:slug" element={<BlogDetail />} />
                  <Route path="/certificates" element={<CertificatesPage />} />
                </Route>

                {/* ✅ Admin Routes (protected) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="projects" element={<ProjectManagement />} />
                  <Route path="blogs">
                    <Route index element={<BlogManagement />} />
                    <Route path="new" element={<BlogEditorPage />} />
                    <Route path=":id/edit" element={<BlogEditorPage />} />
                  </Route>
                  <Route path="skills" element={<SkillManagement />} />
                  <Route
                    path="certificates"
                    element={<CertificateManagement />}
                  />
                  <Route path="contacts" element={<ContactManagement />} />
                  <Route
                    path="settings"
                    element={<div>Settings Coming Soon</div>}
                  />
                </Route>

                {/* Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
