# PCN Calculator Service Worker Implementation

This guide explains how to implement a service worker with Supabase authentication and data storage for the PCN Calculator application.

## Overview

The implementation includes:

1. A service worker that enables offline functionality and caching
2. Supabase authentication for user login/signup
3. Synchronization of calculator data across devices
4. Preservation of existing localStorage functionality as a fallback

## Implementation Steps

### 1. Set Up Supabase

1. Create a new Supabase project at [https://supabase.com/](https://supabase.com/)
2. Go to SQL Editor and run the SQL script provided in `supabase-setup.sql`
3. In Authentication settings, enable Email/Password sign-up
4. Note your Supabase URL and anon key from the project's API settings

### 2. Update HTML File

1. Replace the placeholders in `pcn_calculator.html`:

   ```javascript
   const SUPABASE_URL = "YOUR_SUPABASE_URL"; // Replace with your actual URL
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // Replace with your actual key
   ```

2. The updated file includes:
   - Login modal for authentication
   - User profile display in the header
   - Modified save/load functions to work with Supabase
   - Fallback to localStorage when offline or not logged in

### 3. Deploy the Service Worker

1. Place the `sw.js` file at the root of your hosting (same level as `pcn_calculator.html`)
2. No additional configuration needed - the service worker is registered automatically

### 4. Testing

1. Open the calculator in a browser
2. You should be prompted to log in or continue without login
3. If logged in, your data will be synced with Supabase
4. Test offline functionality by disabling network in browser dev tools
5. When back online, any changes made while offline should sync to Supabase

## How It Works

### Authentication Flow

1. When the page loads, it checks for an existing Supabase session
2. If not logged in, a login modal appears with options to:
   - Login with existing account
   - Create a new account
   - Continue without logging in (using localStorage only)

### Data Storage and Sync

1. When logged in, all data is stored in Supabase and cached locally
2. When not logged in, data is stored only in localStorage
3. The service worker handles caching for offline access
4. Background sync API reconciles offline changes when connection is restored

### Existing Data Migration

When a user logs in for the first time, any existing data from localStorage is automatically migrated to their Supabase account.

## Additional Notes

- All existing functionality of the calculator is preserved
- Users can continue to use the app without logging in
- When logged in, data is available across multiple devices

## Security Considerations

- Row Level Security (RLS) in Supabase ensures users can only access their own data
- Authentication tokens are handled securely by Supabase
- No sensitive data is stored in localStorage when authenticated
