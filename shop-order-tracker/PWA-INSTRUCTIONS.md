# Shop Order Tracker PWA Instructions

## Running on Android

This application has been configured as a Progressive Web App (PWA), which means you can install it on your Android device and use it like a native app. Here's how to do it:

### Method 1: Install from Chrome

1. Open Chrome on your Android device
2. Navigate to the deployed URL of the application
3. Tap the menu button (three dots) in the top-right corner
4. Look for "Add to Home screen" or "Install app" option
5. Follow the prompts to install the PWA

### Method 2: Using the Web App

1. Open any modern browser on your Android device
2. Navigate to the deployed URL of the application
3. The browser should show an installation banner at the bottom of the screen
4. Tap "Install" to add the app to your home screen

## Features Available Offline

Once installed, the Shop Order Tracker PWA offers these offline capabilities:

- View previously loaded orders
- Access the application even without an internet connection
- Receive a friendly offline notification when connectivity is lost

## Generating Icons

The application includes a tool to generate all the necessary icon sizes for Android:

1. Navigate to `/generate-icons.html` in your browser
2. Click the "Generate Icons" button
3. Download each icon size
4. Place the downloaded icons in the `/public/icons/` directory

## Deployment Instructions

To deploy this application so it can be accessed from your Android device:

1. Build the application:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to a web server or hosting service like Netlify, Vercel, or GitHub Pages.

3. Access the deployed URL from your Android device and follow the installation instructions above.

## Troubleshooting

- If the PWA doesn't install, make sure you're using HTTPS (required for service workers)
- Clear browser cache if you experience issues after updates
- Ensure your Android device is running a recent version of Chrome or another modern browser
- Check that all icon sizes are properly generated and accessible