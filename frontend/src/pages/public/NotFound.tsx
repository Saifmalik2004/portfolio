import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import GlitchText from "@/components/ui/GlitchText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <GlitchText
          speed={1}
          enableShadows={true}
          enableOnHover={false}
          className=""
        >
          404
        </GlitchText>

        <p className="text-gray-600 text-lg">
          Oops! The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="inline-block px-6 py-3 text-black rounded-lg shadow transition-colors duration-200"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
