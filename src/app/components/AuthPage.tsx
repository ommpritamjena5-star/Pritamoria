import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Leaf, Eye, EyeOff, Mail, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { registerUser, authenticateUser, resetUserPassword, requestPasswordResetOtp } from '../utils/userStorage';
import type { User } from '../App';

interface AuthPageProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authView, setAuthView] = useState<'tabs' | 'forgot_password'>('tabs');
  const [forgotPasswordStep, setForgotPasswordStep] = useState<1 | 2>(1);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate input
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Authenticate user from backend
    try {
      const result = await authenticateUser(loginForm.email, loginForm.password);

      if (result.success && result.user) {
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email
        };
        onLogin(user);
        toast.success(`Welcome back, ${result.user.name}!`);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Network error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate input
    if (!signupForm.name || !signupForm.email || !signupForm.phoneNumber || !signupForm.password) {
      toast.error('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Register user in backend
    try {
      const result = await registerUser(signupForm.name, signupForm.email, signupForm.phoneNumber, signupForm.password);

      if (result.success && result.user) {
        const user: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email
        };
        onLogin(user);
        toast.success(`Welcome to Pritamoria, ${result.user.name}! 🌿`);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error('Network error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (forgotPasswordStep === 1) {
      if (!forgotPasswordForm.email) {
        toast.error('Please enter your email');
        setIsLoading(false);
        return;
      }

      try {
        const result = await requestPasswordResetOtp(forgotPasswordForm.email);
        if (result.success) {
          toast.success(result.message || 'Recovery code sent! Please check your email.');
          setForgotPasswordStep(2);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error('Network error. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!forgotPasswordForm.otp || !forgotPasswordForm.newPassword || !forgotPasswordForm.confirmNewPassword) {
        toast.error('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmNewPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (forgotPasswordForm.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }

      try {
        const result = await resetUserPassword(forgotPasswordForm.email, forgotPasswordForm.otp, forgotPasswordForm.newPassword);
        if (result.success) {
          toast.success(result.message);
          setAuthView('tabs');
          setForgotPasswordStep(1);
          setForgotPasswordForm({ email: '', otp: '', newPassword: '', confirmNewPassword: '' });
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        toast.error('Network error. Is the backend running?');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-2xl border-white/10 bg-black/40 backdrop-blur-md">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <img src="/pritamoria_logo.jpeg" alt="Pritamoria Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-3xl text-green-500 font-bold tracking-wide">Pritamoria</span>
            </div>
            <CardTitle className="text-white">Welcome to Plant Intelligence</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to start identifying plants with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authView === 'tabs' ? (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/10 text-gray-400">
                  <TabsTrigger value="login" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md font-medium transition-all duration-200">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md font-medium transition-all duration-200">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-white hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 py-0 h-auto text-sm text-green-400 hover:text-green-300"
                        onClick={() => setAuthView('forgot_password')}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-none"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupForm.phoneNumber}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                        className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                          className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-white hover:bg-white/10"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm" className="text-gray-300">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-none"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="mt-2 space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <KeyRound className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-center text-white">Reset Password</h3>
                  <p className="text-sm text-gray-400 text-center">
                    {forgotPasswordStep === 1
                      ? "Enter your email address and we'll send you a link to reset your password."
                      : "Create a new strong password for your account."}
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {forgotPasswordStep === 1 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-gray-300">Email</Label>
                        <div className="relative">
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotPasswordForm.email}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                            required
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="forgot-otp" className="text-gray-300">6-Digit OTP</Label>
                        <Input
                          id="forgot-otp"
                          type="text"
                          placeholder="Enter verification code"
                          value={forgotPasswordForm.otp}
                          onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, otp: e.target.value }))}
                          required
                          className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50 tracking-widest font-mono"
                          maxLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="forgot-new-password" className="text-gray-300">New Password</Label>
                        <div className="relative">
                          <Input
                            id="forgot-new-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            value={forgotPasswordForm.newPassword}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-white hover:bg-white/10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="forgot-confirm-password" className="text-gray-300">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="forgot-confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={forgotPasswordForm.confirmNewPassword}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                            required
                            className="bg-black/40 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500/50"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-2 space-y-3">
                    <Button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-none"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : (forgotPasswordStep === 1 ? 'Send Recovery Code' : 'Reset Password')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        setAuthView('tabs');
                        setForgotPasswordStep(1);
                      }}
                      disabled={isLoading}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}