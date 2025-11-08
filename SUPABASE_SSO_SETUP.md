# Supabase Authentication Setup Guide

This guide walks you through configuring authentication for your Next.js application using Supabase. The app supports both email/password authentication and Single Sign-On (SSO) via OAuth providers.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Get Supabase Credentials](#step-1-get-your-supabase-credentials)
3. [Configure Email/Password Authentication](#step-2-configure-emailpassword-authentication)
4. [Configure OAuth Providers (SSO)](#step-3-configure-oauth-providers-sso)
5. [Test the Integration](#step-5-test-the-integration)
6. [Troubleshooting](#troubleshooting)
7. [Security Best Practices](#security-best-practices)

## Prerequisites

- A Supabase project (you already have one at: `kcdpzymdygejjyyltslr`)
- Access to your Supabase dashboard
- OAuth application credentials from your chosen provider(s) (optional, for SSO)

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `kcdpzymdygejjyyltslr`
3. Navigate to **Settings** > **API**
4. Copy the following values:
   - **Project URL**: `https://kcdpzymdygejjyyltslr.supabase.co`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Update your `.env.local` file with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kcdpzymdygejjyyltslr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 2: Configure Email/Password Authentication

Email/password authentication is enabled by default in Supabase. However, you may want to customize some settings.

### 1. Email Provider Settings

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Email** provider (it should be enabled by default)

### 2. Configure Email Settings

1. Navigate to **Authentication** > **Email Templates**
2. Customize the following email templates (optional):
   - **Confirm signup**: Sent when users register with email/password
   - **Magic Link**: For passwordless login (not used in this app by default)
   - **Change Email Address**: Sent when users change their email
   - **Reset Password**: Sent when users request a password reset

### 3. Email Confirmation Settings

By default, Supabase requires users to confirm their email address before they can sign in.

**To configure email confirmation:**

1. Go to **Authentication** > **Settings**
2. Under **Email Auth**, you'll find:
   - **Enable email confirmations**: Toggle this setting
     - **Enabled** (Recommended for production): Users must click a link in their email before they can sign in
     - **Disabled** (Good for development): Users can sign in immediately after registration

**For Development:**
- You may want to disable email confirmations to speed up testing
- Remember to re-enable for production

**For Production:**
- Always enable email confirmations for security
- Customize email templates to match your brand

### 4. Password Requirements

1. Go to **Authentication** > **Settings**
2. Under **Password Settings**, you can configure:
   - Minimum password length (default: 6 characters)
   - The current implementation requires at least 6 characters

### 5. SMTP Settings (Production)

For production, configure custom SMTP settings to send emails from your own domain:

1. Go to **Project Settings** > **Authentication**
2. Scroll to **SMTP Settings**
3. Configure your SMTP server:
   - **Host**: Your SMTP server host
   - **Port**: SMTP port (usually 587 or 465)
   - **Username**: SMTP username
   - **Password**: SMTP password
   - **Sender email**: Email address to send from
   - **Sender name**: Name to display as sender

**Note:** For development, Supabase provides a default email service, but it's rate-limited and not suitable for production.

### 6. Features Available

The login page includes:
- **Sign Up**: New users can create an account with email and password
- **Sign In**: Existing users can log in with their credentials
- **Password Reset**: Users can request a password reset link via email
- **Full Name**: Collected during registration and stored in user metadata

---

## Step 3: Configure OAuth Providers (SSO)

### General Setup Steps

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find the provider you want to enable
4. Toggle it to **Enabled**
5. Fill in the required credentials (Client ID, Client Secret)
6. Use the callback URL: `https://kcdpzymdygejjyyltslr.supabase.co/auth/v1/callback`

### Provider-Specific Configuration

---

## Google OAuth Setup

### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact information: Your email
6. Choose **Application type**: Web application
7. Add **Authorized redirect URIs**:
   ```
   https://kcdpzymdygejjyyltslr.supabase.co/auth/v1/callback
   ```
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** and enable it
3. Enter:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
4. Click **Save**

---

## GitHub OAuth Setup

### 1. Create GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the form:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000` (for development) or your production URL
   - **Authorization callback URL**:
     ```
     https://kcdpzymdygejjyyltslr.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy the secret

### 2. Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** and enable it
3. Enter:
   - **Client ID**: Paste from GitHub
   - **Client Secret**: Paste from GitHub
4. Click **Save**

---

## Azure (Microsoft) OAuth Setup

### 1. Create Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the form:
   - **Name**: Your app name
   - **Supported account types**: Choose appropriate option (typically "Accounts in any organizational directory and personal Microsoft accounts")
   - **Redirect URI**: Select **Web** and enter:
     ```
     https://kcdpzymdygejjyyltslr.supabase.co/auth/v1/callback
     ```
5. Click **Register**
6. Copy the **Application (client) ID**
7. Go to **Certificates & secrets**
8. Click **New client secret**
9. Add a description and expiration period
10. Click **Add** and copy the secret **Value** (not the Secret ID)

### 2. Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Delegated permissions**
4. Add these permissions:
   - `openid`
   - `profile`
   - `email`
5. Click **Add permissions**

### 3. Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Azure** and enable it
3. Enter:
   - **Client ID**: Paste the Application (client) ID
   - **Client Secret**: Paste the secret value
   - **Azure Tenant URL**: Use `https://login.microsoftonline.com/common` (or your specific tenant)
4. Click **Save**

---

## GitLab OAuth Setup

### 1. Create GitLab OAuth Application

1. Go to [GitLab Applications](https://gitlab.com/-/profile/applications)
2. Fill in the form:
   - **Name**: Your app name
   - **Redirect URI**:
     ```
     https://kcdpzymdygejjyyltslr.supabase.co/auth/v1/callback
     ```
   - **Scopes**: Select:
     - `read_user`
     - `openid`
     - `profile`
     - `email`
3. Click **Save application**
4. Copy the **Application ID** and **Secret**

### 2. Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **GitLab** and enable it
3. Enter:
   - **Client ID**: Paste the Application ID
   - **Client Secret**: Paste the Secret
4. Click **Save**

---

## Step 4: Configure Redirect URLs for Development

For local development, you'll need to add additional redirect URLs:

1. In each OAuth provider's settings, add:
   ```
   http://localhost:3000/auth/callback
   ```

2. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
3. Add `http://localhost:3000` to:
   - **Site URL**
   - **Redirect URLs**

---

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. You should be redirected to `/login`

### Test Email/Password Authentication

4. Click the **Sign Up** tab

5. Fill in:
   - Full Name
   - Email address
   - Password (minimum 6 characters)

6. Click **Sign Up**

7. If email confirmations are enabled:
   - Check your email inbox
   - Click the confirmation link
   - Return to the login page and sign in with your credentials

8. If email confirmations are disabled:
   - You should be redirected to the home page immediately

### Test SSO Authentication

4. On the login page, scroll down to the SSO provider buttons

5. Click on any enabled OAuth provider button

6. Complete the OAuth flow with the provider

7. You should be redirected back to your application and logged in

### Test Password Reset

1. On the login page (Sign In tab), click **Forgot password?**

2. Enter your email address

3. Click **Send reset link**

4. Check your email for the password reset link

5. Click the link (you'll be redirected to `/update-password`)

6. Enter your new password twice

7. Click **Update password**

8. You should be redirected to the home page and logged in

---

## Troubleshooting

### Common Issues

#### "Invalid redirect URI" Error

- Ensure the redirect URI in your OAuth provider exactly matches:
  ```
  https://kcdpzymdygejjyyltslr.supabase.co/auth/v1/callback
  ```
- Check for trailing slashes or typos

#### "Invalid client" Error

- Verify your Client ID and Client Secret are correct
- Ensure there are no extra spaces when copying credentials
- Check that the OAuth app is not disabled in the provider's dashboard

#### User Not Redirected After Login

- Check your browser console for errors
- Verify the callback route is working at `/auth/callback`
- Ensure middleware is properly configured

#### Session Not Persisting

- Clear your browser cookies and try again
- Check that your `.env.local` file has the correct Supabase credentials
- Restart your development server after changing environment variables

#### "User already registered" Error

- This means an account with that email already exists
- Try signing in instead of signing up
- Use the "Forgot password?" link if you don't remember your password

#### "Invalid login credentials" Error

- Check that your email and password are correct
- Passwords are case-sensitive
- If you forgot your password, use the "Forgot password?" link

#### "Email not confirmed" Error

- Check your email inbox for a confirmation email from Supabase
- Click the confirmation link in the email
- If you can't find the email, check your spam folder
- You can disable email confirmations in development (see below)

#### Password Reset Email Not Received

- Check your spam folder
- Verify the email address is correct
- In development, Supabase's default email service may be rate-limited
- Check Supabase logs: **Authentication** > **Logs**

#### "Password should be at least 6 characters" Error

- Ensure your password is at least 6 characters long
- This is the minimum requirement set in the app

### Email Confirmation Settings

By default, Supabase may require email confirmation for new users:

1. Go to **Authentication** > **Settings**
2. Under **Email Auth**, you can toggle **Enable email confirmations**
3. For development, you might want to disable this temporarily
4. For production, always keep email confirmations enabled for security

---

## Security Best Practices

### General Security

1. **Never commit credentials**: Keep `.env.local` in `.gitignore`
2. **Use environment variables**: Always use environment variables for sensitive data
3. **Use HTTPS in production**: Always use HTTPS for production deployments
4. **Set up rate limiting**: Configure rate limiting in Supabase to prevent abuse

### Email/Password Security

5. **Enable email confirmations**: Always require email verification in production
6. **Enforce strong passwords**: Consider increasing minimum password length
7. **Implement password complexity**: Add requirements for uppercase, numbers, special characters
8. **Enable password recovery**: Always provide a way for users to reset passwords
9. **Configure SMTP in production**: Use your own email service instead of Supabase's default
10. **Monitor failed login attempts**: Set up alerts for suspicious activity in Supabase logs

### OAuth/SSO Security

11. **Rotate secrets regularly**: Update OAuth secrets periodically
12. **Enable only needed providers**: Don't enable OAuth providers you're not using
13. **Configure proper scopes**: Only request the OAuth scopes you actually need
14. **Verify redirect URIs**: Ensure only your domains are whitelisted

---

## Production Deployment

When deploying to production:

1. Update environment variables on your hosting platform:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://kcdpzymdygejjyyltslr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   ```

2. Add your production URL to OAuth provider redirect URIs:
   ```
   https://your-domain.com/auth/callback
   ```

3. Update Supabase **Authentication** > **URL Configuration**:
   - **Site URL**: `https://your-domain.com`
   - **Redirect URLs**: Add `https://your-domain.com/**`

4. Test all OAuth providers in production

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [GitLab OAuth Documentation](https://docs.gitlab.com/ee/integration/oauth_provider.html)

---

## Support

If you encounter issues:

1. Check the Supabase logs: **Authentication** > **Logs**
2. Review the browser console for errors
3. Check the [Supabase Discord](https://discord.supabase.com/)
4. Visit [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
