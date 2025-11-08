'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function TestAuthPage() {
  const [config, setConfig] = useState({
    url: '',
    hasAnonKey: false,
    connectionTest: 'Testing...',
  });
  const [authSettings, setAuthSettings] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check configuration
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    setConfig({
      url,
      hasAnonKey: anonKey.length > 0,
      connectionTest: 'Testing...',
    });

    // Test connection
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setConfig((prev) => ({
          ...prev,
          connectionTest: `Error: ${error.message}`,
        }));
      } else {
        setConfig((prev) => ({
          ...prev,
          connectionTest: 'Connected successfully!',
        }));
      }
    });

    // Get auth settings (this won't show confirmation settings but will verify connection)
    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setAuthSettings({
          status: 'Auth system is working',
          user: data.user ? 'User logged in' : 'No user logged in',
        });
      }
    });
  }, [supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-2xl space-y-6 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Supabase Auth Diagnostics
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Check your Supabase configuration
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Environment Configuration
            </h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Supabase URL:
                </span>
                <span className="font-mono text-black dark:text-white">
                  {config.url || '❌ Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Anon Key:
                </span>
                <span className="font-mono text-black dark:text-white">
                  {config.hasAnonKey ? '✅ Configured' : '❌ Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  Connection Test:
                </span>
                <span
                  className={`font-mono ${
                    config.connectionTest.includes('successfully')
                      ? 'text-green-600 dark:text-green-400'
                      : config.connectionTest.includes('Error')
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {config.connectionTest}
                </span>
              </div>
            </div>
          </div>

          {authSettings && (
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Auth System Status
              </h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Status:
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {authSettings.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Current User:
                  </span>
                  <span className="text-black dark:text-white">
                    {authSettings.user}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Email Confirmation Settings
            </h3>
            <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
              To check or disable email confirmations:
            </p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Go to Supabase Dashboard</li>
              <li>Navigate to Authentication → Providers</li>
              <li>Click on Email provider</li>
              <li>Find "Confirm email" toggle</li>
              <li>Disable it for easier development testing</li>
            </ol>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Not Receiving Emails?
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800 dark:text-amber-200">
              <li>Check your spam/junk folder</li>
              <li>Search for emails from noreply@mail.app.supabase.io</li>
              <li>Check Authentication → Logs in Supabase dashboard</li>
              <li>
                Supabase's default email service is rate-limited (few emails/hour)
              </li>
              <li>
                For production, configure custom SMTP in Project Settings
              </li>
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
              href="https://supabase.com/dashboard/project/kcdpzymdygejjyyltslr/auth/providers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Open Supabase Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
