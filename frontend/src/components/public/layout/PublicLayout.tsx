// src/components/public/layout/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import Navigation from "../../Navigation";
import Footer from "../../Footer";
import BackToTop from "../../BackToTop";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-white">
      <Navigation />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}