import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import PublicLayout from "@/components/public/layout/PublicLayout";
import BackendLoader from "@/components/Loading";
import { useBackendWakeup } from "@/hooks/use-loader";

/* =======================
   Auth & Public Pages
======================= */
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/RegisterPage";
import VerifyEmail from "@/pages/auth/VerifyEmailPage";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import NotFound from "@/pages/public/NotFound";

import HomePage from "@/pages/public/HomePage";
import ProjectsPage from "@/pages/public/ProjectsPage";
import ProjectDetail from "@/pages/public/ProjectDetail";
import BlogPage from "@/pages/public/BlogPage";
import BlogDetail from "@/pages/public/BlogDetail";
import CertificatesPage from "@/pages/public/CertificatesPage";

/* =======================
   🔥 Lazy Admin Pages
======================= */
const AdminLayout = lazy(
  () => import("@/components/public/layout/AdminLayout")
);
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ProjectManagement = lazy(
  () => import("@/pages/admin/ProjectsManagementPage")
);
const BlogManagement = lazy(
  () => import("@/pages/admin/BlogsManagementPage")
);
const BlogEditorPage = lazy(
  () => import("@/pages/admin/blogs/BlogEditorPage")
);
const SkillManagement = lazy(
  () => import("@/pages/admin/SkillsManagementPage")
);
const CertificateManagement = lazy(
  () => import("@/pages/admin/CertificatesManagementPage")
);
const ContactManagement = lazy(
  () => import("@/pages/admin/ContactsManagementPage")
);

const queryClient = new QueryClient();

const App = () => {
  const loading = useBackendWakeup();

  if (loading) return <BackendLoader />;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* ================= Auth Routes ================= */}
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

                {/* ================= Public Routes ================= */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route
                    path="/projects/:slug"
                    element={<ProjectDetail />}
                  />
                  <Route path="/blogs" element={<BlogPage />} />
                  <Route path="/blogs/:slug" element={<BlogDetail />} />
                  <Route
                    path="/certificates"
                    element={<CertificatesPage />}
                  />
                </Route>

                {/* ================= 🔥 Admin Routes (Split) ================= */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <Suspense fallback={<BackendLoader />}>
                        <AdminLayout />
                      </Suspense>
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <Suspense fallback={<BackendLoader />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />

                  <Route
                    path="projects"
                    element={
                      <Suspense fallback={<BackendLoader />}>
                        <ProjectManagement />
                      </Suspense>
                    }
                  />

                  <Route path="blogs">
                    <Route
                      index
                      element={
                        <Suspense fallback={<BackendLoader />}>
                          <BlogManagement />
                        </Suspense>
                      }
                    />
                    <Route
                      path="new"
                      element={
                        <Suspense fallback={<BackendLoader />}>
                          <BlogEditorPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path=":id/edit"
                      element={
                        <Suspense fallback={<BackendLoader />}>
                          <BlogEditorPage />
                        </Suspense>
                      }
                    />
                  </Route>

                  <Route
                    path="skills"
                    element={
                      <Suspense fallback={<BackendLoader />}>
                        <SkillManagement />
                      </Suspense>
                    }
                  />

                  <Route
                    path="certificates"
                    element={
                      <Suspense fallback={<BackendLoader />}>
                        <CertificateManagement />
                      </Suspense>
                    }
                  />

                  <Route
                    path="contacts"
                    element={
                      <Suspense fallback={<BackendLoader />}>
                        <ContactManagement />
                      </Suspense>
                    }
                  />

                  <Route
                    path="settings"
                    element={<div>Settings Coming Soon</div>}
                  />
                </Route>

                {/* ================= Catch All ================= */}
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
