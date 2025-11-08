export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-red-200 bg-white p-8 dark:border-red-800 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            There was a problem authenticating your account.
          </p>
        </div>
        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>This could be due to:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Invalid or expired authentication code</li>
            <li>OAuth provider not properly configured</li>
            <li>Network or server error</li>
          </ul>
        </div>
        <div className="pt-4">
          <a
            href="/login"
            className="block w-full rounded-lg bg-black px-4 py-2 text-center font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
