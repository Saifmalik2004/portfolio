import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        
        {/* ✅ Back Button using shadcn */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="absolute -top-2 -left-2 flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="glass card-shadow rounded-2xl p-8 mt-6">
          <div className="mb-8 text-center">
            <h1 className="mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-3xl font-bold">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
