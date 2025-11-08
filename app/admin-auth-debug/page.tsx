'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function AdminAuthDebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const testSignup = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      setResult({
        action: 'Signup',
        success: !error,
        data,
        error,
        details: {
          hasUser: !!data.user,
          hasSession: !!data.session,
          identitiesCount: data.user?.identities?.length || 0,
          emailConfirmed: data.user?.email_confirmed_at || 'Not confirmed',
        },
      });
    } catch (err) {
      setResult({ action: 'Signup', success: false, error: err });
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setResult({
        action: 'Login',
        success: !error,
        data,
        error,
        details: {
          hasUser: !!data.user,
          hasSession: !!data.session,
          emailConfirmed: data.user?.email_confirmed_at || 'Not confirmed',
        },
      });
    } catch (err) {
      setResult({ action: 'Login', success: false, error: err });
    }
    setLoading(false);
  };

  const checkSession = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.auth.getSession();
      setResult({
        action: 'Check Session',
        success: !error,
        data,
        error,
        details: {
          hasSession: !!data.session,
          user: data.session?.user?.email || 'No user',
        },
      });
    } catch (err) {
      setResult({ action: 'Check Session', success: false, error: err });
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { error } = await supabase.auth.signOut();
      setResult({
        action: 'Logout',
        success: !error,
        error,
      });
    } catch (err) {
      setResult({ action: 'Logout', success: false, error: err });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Auth Debug Console
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Test authentication operations and see detailed responses
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Test Credentials
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-black focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={testSignup}
              disabled={loading || !email || !password}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              Test Signup
            </button>
            <button
              onClick={testLogin}
              disabled={loading || !email || !password}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              Test Login
            </button>
            <button
              onClick={checkSession}
              disabled={loading}
              className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
            >
              Check Session
            </button>
            <button
              onClick={logout}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>

        {result && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Result: {result.action}
            </h2>
            <div
              className={`mt-4 rounded-lg p-4 ${
                result.success
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <p
                className={`font-semibold ${
                  result.success
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-red-900 dark:text-red-100'
                }`}
              >
                {result.success ? '✅ Success' : '❌ Failed'}
              </p>
            </div>

            {result.details && (
              <div className="mt-4">
                <h3 className="font-semibold text-black dark:text-white">
                  Quick Details:
                </h3>
                <pre className="mt-2 overflow-auto rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}

            {result.error && (
              <div className="mt-4">
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Error:
                </h3>
                <pre className="mt-2 overflow-auto rounded-lg bg-red-100 p-4 text-sm text-red-900 dark:bg-red-900/20 dark:text-red-100">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold text-black dark:text-white">
                Full Response:
              </h3>
              <pre className="mt-2 overflow-auto rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-900">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100">
            Instructions
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800 dark:text-amber-200">
            <li>Enter your test email and password above</li>
            <li>Click "Test Signup" to create an account</li>
            <li>Check the response - if identitiesCount is 0, the email already exists but is unconfirmed</li>
            <li>If signup succeeds, check if hasSession is true (no email confirmation) or false (email confirmation required)</li>
            <li>Click "Test Login" to try signing in</li>
            <li>Check browser console (F12) for additional logs</li>
            <li>Open Supabase Dashboard → Authentication → Users to manage stuck accounts</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <a
            href="/login"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back to Login
          </a>
          <a
            href="https://supabase.com/dashboard/project/kcdpzymdygejjyyltslr/auth/users"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Manage Users in Supabase
          </a>
        </div>
      </div>
    </div>
  );
}
