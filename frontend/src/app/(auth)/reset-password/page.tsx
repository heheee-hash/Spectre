'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { simulateDelay } from '@/services/utils';
import { toast } from 'sonner';

// Step 1: Request OTP
const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type RequestFormValues = z.infer<typeof requestSchema>;

// Step 2: Verify OTP
const verifySchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});
type VerifyFormValues = z.infer<typeof verifySchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const onRequestOtp = async (data: RequestFormValues) => {
    setIsLoading(true);
    try {
      await simulateDelay(1500);
      setUserEmail(data.email);
      setStep(2);
      toast.success('OTP Sent', {
        description: `Use 123456 as the mock OTP for ${data.email}`,
      });
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data: VerifyFormValues) => {
    setIsLoading(true);
    try {
      await simulateDelay(1500);
      if (data.otp === '123456') { // Mock verification
        setStep(3);
      } else {
        toast.error('Invalid OTP', { description: 'Please try 123456' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-6 min-h-[400px]"
    >
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          {step === 1 && "Enter your email to receive a One-Time Password."}
          {step === 2 && `Enter the 6-digit OTP sent to ${userEmail}.`}
          {step === 3 && "Password reset successful!"}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleRequestSubmit(onRequestOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@coreinventory.com"
                  className="pl-9"
                  disabled={isLoading}
                  {...registerRequest('email')}
                />
              </div>
              {requestErrors.email && (
                <p className="text-xs text-destructive">{requestErrors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}
            </Button>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleVerifySubmit(onVerifyOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="pl-9 text-center font-mono tracking-widest sm:text-lg"
                  disabled={isLoading}
                  {...registerVerify('otp')}
                />
              </div>
              {verifyErrors.otp && (
                <p className="text-xs text-destructive">{verifyErrors.otp.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Continue'}
            </Button>
            <div className="text-center text-sm">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-muted-foreground hover:text-emerald-500 hover:underline"
              >
                Use a different email
              </button>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-6 py-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Your password has been successfully reset. In a real application, you would enter your new password in Step 3. For this mock implementation, you are ready to log back in.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Back to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 1 && (
        <div className="flex justify-center text-sm text-muted-foreground pt-4 border-t">
          Remember your password?{' '}
          <Link
            href="/login"
            className="ml-1 font-medium text-emerald-600 hover:text-emerald-500 hover:underline dark:text-emerald-500 dark:hover:text-emerald-400"
          >
            Sign in
          </Link>
        </div>
      )}
    </motion.div>
  );
}
