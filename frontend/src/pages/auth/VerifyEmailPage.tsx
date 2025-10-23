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
import { Loader2, Mail } from 'lucide-react';

const verifySchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormData) => {
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
      await authService.verifyEmail({ email, otp: data.otp });
      toast({
        title: 'Success',
        description: 'Email verified successfully!',
      });
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Verification failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await authService.resendVerifyOtp({ email });
      toast({
        title: 'Success',
        description: 'Verification code sent!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to resend code',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We sent a verification code to ${email}`}
    >
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-primary/10 p-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            placeholder="000000"
            maxLength={6}
            {...register('otp')}
            className="bg-background/50 text-center text-2xl tracking-widest"
          />
          {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
        </div>

        <Button type="submit" className="w-full glow" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResending}
          className="text-sm text-primary hover:text-primary-glow transition-colors disabled:opacity-50"
        >
          {isResending ? 'Resending...' : "Didn't receive code? Resend"}
        </button>
      </div>

      <div className="mt-4 text-center text-sm">
        <Link to="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
