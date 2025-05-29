# PCN Calculator Wrapper Implementation

This implementation adds service worker functionality and Supabase authentication to the PCN Calculator using a wrapper approach, which minimally impacts the original calculator code.

## Overview

The implementation consists of:

1. A wrapper HTML page that loads the original calculator in an iframe
2. A service worker for offline functionality
3. A bridge script that intercepts localStorage operations
4. Supabase integration for user authentication and data storage

This approach has several advantages:

- Minimal changes to the original calculator code
- Clear separation of concerns
- Lower risk of breaking existing functionality
- Easier to maintain and upgrade

## Files

- `pcn-calculator-wrapper.html` - The wrapper page with authentication UI
- `auth-bridge.js` - Script to intercept localStorage operations
- `sw.js` - Service worker for offline functionality
- `supabase-setup.sql` - SQL script for setting up Supabase

## Implementation Steps

### 1. Set Up Supabase

1. Create a new Supabase project at [https://supabase.com/](https://supabase.com/)
2. Go to SQL Editor and run the SQL script provided in `supabase-setup.sql`
3. In Authentication settings, enable Email/Password sign-up
4. Note your Supabase URL and anon key from the project's API settings

### 2. Add Bridge Script to Original Calculator

Make a single change to the original `pcn_calculator.html` file by adding this line at the end, just before the closing `</body>` tag:

```html
<script src="auth-bridge.js"></script>
```

This is the only modification needed to the original calculator file.

### 3. Configure the Wrapper

1. Replace the placeholders in `pcn-calculator-wrapper.html`:
   ```javascript
   const SUPABASE_URL = "YOUR_SUPABASE_URL"; // Replace with your actual URL
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // Replace with your actual key
   ```

### 4. Deploy the Files

1. Place all files in your web server:

   - `pcn_calculator.html` (with bridge script added)
   - `pcn-calculator-wrapper.html`
   - `auth-bridge.js`
   - `sw.js`

2. Change your main entry point or redirect users to the wrapper page instead of directly to the calculator.

## How It Works

### Authentication Flow

1. User visits the wrapper page which presents a login modal
2. User can log in, sign up, or continue without logging in
3. After authentication, the original calculator loads in an iframe
4. The auth-bridge script in the original calculator handles communication with the wrapper

### Data Synchronization

1. The bridge script intercepts localStorage operations
2. When data changes in the calculator, the bridge notifies the wrapper
3. The wrapper syncs data with Supabase when the user is authenticated
4. When offline, data is stored locally and synced when back online

### Service Worker

The service worker:

1. Caches static assets for offline use
2. Handles background sync when coming back online
3. Provides a seamless offline experience

## User Experience

From the user's perspective:

1. User visits the calculator and is prompted to log in
2. After login, all existing data is available (and synced across devices)
3. Changes are automatically saved to both localStorage and Supabase
4. If offline, the app continues to work, and data syncs when back online
5. A status indicator shows sync status (synced, syncing, offline)

## Security Considerations

- User data is protected by Supabase authentication
- Row Level Security ensures users can only access their own data
- The calculator can still function without authentication if desired
