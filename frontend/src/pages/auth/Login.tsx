import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // redirect destination
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await login({ email, password });
    // Normal login successful
    navigate(from, { replace: true });
  } catch (error: any) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Login failed';

    if (status === 403) {
      // Email not verified, redirect to VerifyEmail page with email state
      toast({
        title: 'Email Verification Required',
        description: message,
        variant: 'destructive',
      });
      navigate('/auth/verify-email', { state: { email } });
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary-glow transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <Button type="submit" className="w-full glow" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link
          to="/auth/register"
          className="text-primary hover:text-primary-glow transition-colors"
        >
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
