import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    token: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email address is missing',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token: data.token,
        newPassword: data.newPassword,
      });
      toast({
        title: 'Success',
        description: 'Password reset successfully!',
      });
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Password reset failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={`Enter the code sent to ${email}`}
    >
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Reset Code</Label>
          <Input
            id="token"
            placeholder="000000"
            maxLength={6}
            {...register('token')}
            className="bg-background/50 text-center text-2xl tracking-widest"
          />
          {errors.token && <p className="text-sm text-destructive">{errors.token.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            {...register('newPassword')}
            className="bg-background/50"
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className="bg-background/50"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full glow" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link to="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
