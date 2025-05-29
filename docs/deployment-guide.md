# PCN Calculator Service Worker & Supabase Deployment Guide

This guide provides step-by-step instructions for deploying the PCN Calculator with service worker and Supabase authentication.

## Prerequisites

- A web server to host the calculator files
- A Supabase account (free tier works fine)

## Step 1: Set Up Supabase

1. Create a new Supabase project:

   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Enter a name for your project (e.g., "PCN Calculator")
   - Choose a database password
   - Select a region close to your users
   - Click "Create new project"

2. Set up the database tables:

   - In your new Supabase project, go to the SQL Editor
   - Copy and paste the contents of the `supabase-setup.sql` file
   - Click "Run" to execute the SQL script

3. Configure authentication:

   - Go to Authentication → Settings
   - Under "Email Auth", make sure "Enable Email Signup" is ON
   - Optionally, customize other settings like email templates and SMTP settings

4. Get your API credentials:
   - Go to Project Settings → API
   - Note down your "Project URL" and "anon" public API key

## Step 2: Prepare the Files

1. Add the bridge script to the original calculator:

   - Open `pcn_calculator.html`
   - Add this line just before the closing `</body>` tag:
     ```html
     <script src="auth-bridge.js"></script>
     ```

2. Configure the wrapper page:
   - Open `pcn-calculator-wrapper.html`
   - Find the Supabase configuration section
   - Replace the placeholders with your actual values:
     ```javascript
     const SUPABASE_URL = "https://your-project-id.supabase.co";
     const SUPABASE_ANON_KEY = "your-anon-key";
     ```

## Step 3: Deploy the Files

Upload all files to your web server:

1. `pcn_calculator.html` (with the bridge script added)
2. `pcn-calculator-wrapper.html`
3. `auth-bridge.js`
4. `sw.js`

Make sure all files are in the same directory, or update the paths accordingly.

## Step 4: Set Up Entry Point

Configure your web server to direct users to the wrapper page instead of directly to the calculator.

Options:

- Rename `pcn-calculator-wrapper.html` to `index.html`
- Set up a redirect from `index.html` to `pcn-calculator-wrapper.html`
- Update any links that point to the calculator to point to the wrapper instead

## Step 5: Testing

1. Open the wrapper page in a browser
2. You should see a login prompt
3. Test all three options:

   - Sign up with a new account
   - Login with existing account
   - Continue without login

4. Testing offline functionality:
   - Open your browser's developer tools
   - Go to the Network tab
   - Check the "Offline" option
   - Refresh the page - it should still work
   - Make changes to your calculator data
   - Uncheck "Offline" to go back online
   - The sync indicator should show "Syncing" and then "Synced"

## Troubleshooting

### Service Worker Issues

- Service workers only work on HTTPS or localhost
- Check the browser console for errors
- Try clearing the browser cache and service worker registrations

### Authentication Issues

- Verify your Supabase URL and anon key are correct
- Check Supabase Authentication logs for failed login attempts
- Ensure your database has the correct tables and RLS policies

### Sync Issues

- Check browser console for errors
- Verify network connectivity
- Check Supabase database logs for errors

## Next Steps

- Customize the look and feel of the wrapper page
- Add additional authentication methods (Google, GitHub, etc.)
- Implement data recovery features
- Add user profile management
- Set up usage analytics

---

For more detailed information, refer to the README-wrapper-implementation.md file.
