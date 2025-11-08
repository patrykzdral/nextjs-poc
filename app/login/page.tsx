'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('email');
    setError(null);
    setSuccess(null);

    console.log('🔐 Auth attempt:', { mode, email });

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        console.log('📝 Signup response:', { data, error });

        if (error) {
          console.error('❌ Signup error:', error);
          setError(error.message);
        } else if (data.user && data.user.identities && data.user.identities.length === 0) {
          // User already exists but email not confirmed
          console.warn('⚠️ User exists but not confirmed');
          setError(
            'This email is already registered. If you haven\'t confirmed your email, please check your inbox. Otherwise, try signing in or use password reset.'
          );
        } else {
          console.log('✅ Signup successful:', data.user?.email);
          // Check if email confirmation is required
          if (data.session) {
            // No email confirmation needed - user is logged in
            console.log('🎉 Session created, redirecting...');
            router.push('/');
          } else {
            // Email confirmation required
            console.log('📧 Email confirmation required');
            setSuccess(
              'Account created! Please check your email to confirm your account. If you don\'t receive an email, email confirmation may be disabled - try signing in directly.'
            );
            setEmail('');
            setPassword('');
            setFullName('');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('🔑 Login response:', { data, error });

        if (error) {
          console.error('❌ Login error:', error);

          // Provide more helpful error messages
          if (error.message.includes('Email not confirmed')) {
            setError(
              'Please confirm your email first. Check your inbox for a confirmation link, or contact support to manually confirm your account.'
            );
          } else if (error.message.includes('Invalid login credentials')) {
            setError(
              'Invalid email or password. If you just signed up, you may need to confirm your email first. Try using "Forgot password?" to reset.'
            );
          } else {
            setError(error.message);
          }
        } else {
          console.log('✅ Login successful:', data.user?.email);
          router.push('/');
        }
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err);
      setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(null);
    }
  };

  const handleSSOLogin = async (provider: Provider) => {
    setLoading(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(null);
    }
  };

  const providers: { name: Provider; label: string; icon: string }[] = [
    { name: 'google', label: 'Google', icon: '🔍' },
    { name: 'github', label: 'GitHub', icon: '🐙' },
    { name: 'azure', label: 'Microsoft Azure', icon: '🪟' },
    { name: 'gitlab', label: 'GitLab', icon: '🦊' },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {mode === 'login'
              ? 'Sign in to your account'
              : 'Sign up for a new account'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-lg border border-zinc-200 p-1 dark:border-zinc-800">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
            {success}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              {mode === 'login' && (
                <a
                  href="/reset-password"
                  className="text-xs text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                >
                  Forgot password?
                </a>
              )}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              placeholder="••••••••"
            />
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                Must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading === 'email'}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            {loading === 'email'
              ? 'Loading...'
              : mode === 'login'
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* SSO Providers */}
        <div className="space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleSSOLogin(provider.name)}
              disabled={loading !== null}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <span className="text-xl">{provider.icon}</span>
              <span>
                {loading === provider.name
                  ? 'Redirecting...'
                  : `Continue with ${provider.label}`}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center text-xs text-zinc-500 dark:text-zinc-500">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
