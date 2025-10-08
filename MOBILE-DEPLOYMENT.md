# Mobile Deployment Guide - Bowling Coach App

This guide covers how to build and deploy your Bowling Coach app to Android and iOS platforms using Capacitor.

## Overview

Your app is now configured to run on:
- **Web** (existing Vite/React app)
- **Android** (via Capacitor)
- **iOS** (via Capacitor)

The web app remains unchanged and continues to work exactly as before.

## Prerequisites

### For Android Development
- **Android Studio** (latest version)
  - Download from: https://developer.android.com/studio
  - Install Android SDK (API level 33 or higher recommended)
  - Set up an Android Virtual Device (AVD) for testing or connect a physical device

### For iOS Development (macOS only)
- **Xcode** (latest version from Mac App Store)
- **CocoaPods** - Install with: `sudo gem install cocoapods`
- Apple Developer account (for deploying to App Store or physical devices)

## Quick Start

### 1. Build and Sync

After making changes to your web app, sync them to mobile platforms:

```bash
# Sync to both platforms
npm run cap:sync

# Sync to Android only
npm run cap:sync:android

# Sync to iOS only
npm run cap:sync:ios
```

### 2. Open in Native IDEs

#### Android
```bash
npm run cap:open:android
```
This opens Android Studio where you can:
- Run the app on an emulator or device
- Build APK/AAB files for distribution
- Configure app settings, icons, and permissions

#### iOS
```bash
npm run cap:open:ios
```
This opens Xcode where you can:
- Run the app on a simulator or device
- Build IPA files for distribution
- Configure app settings, icons, and provisioning profiles

### 3. Run on Device/Emulator

```bash
# Run on Android
npm run cap:run:android

# Run on iOS
npm run cap:run:ios
```

## Development Workflow

1. **Make changes** to your React app in `src/`
2. **Test in browser** with `npm run dev`
3. **Build the web app** with `npm run build`
4. **Sync to mobile** with `npm run cap:sync`
5. **Open native IDE** and run on device/emulator

## Building for Production

### Android

1. Open Android Studio: `npm run cap:open:android`
2. Go to **Build** → **Generate Signed Bundle / APK**
3. Choose **Android App Bundle** (for Google Play) or **APK** (for direct distribution)
4. Create or select a signing keystore
5. Build the release version

**Important files:**
- `android/app/build.gradle` - App configuration, version codes
- `android/app/src/main/AndroidManifest.xml` - Permissions and app metadata

### iOS

1. Open Xcode: `npm run cap:open:ios`
2. Select **Product** → **Archive**
3. Once archived, click **Distribute App**
4. Choose distribution method:
   - App Store Connect (for App Store)
   - Ad Hoc (for testing on registered devices)
   - Enterprise (for internal distribution)

**Important files:**
- `ios/App/App.xcodeproj` - Xcode project
- `ios/App/App/Info.plist` - App metadata and permissions

## Configuration

### App Icons and Splash Screens

#### Android
- Place icons in: `android/app/src/main/res/mipmap-*/`
- Splash screen: `android/app/src/main/res/drawable/`

#### iOS
- Use Xcode's Asset Catalog: Open Xcode → App → Assets.xcassets
- Add AppIcon and LaunchScreen images

**Recommended tool:** Use a service like https://icon.kitchen/ to generate all required sizes.

### App Permissions

Edit the Capacitor config ([capacitor.config.ts](capacitor.config.ts)) to add plugins and permissions as needed.

Common plugins you might want:
```bash
npm install @capacitor/camera @capacitor/filesystem @capacitor/share
```

### Environment Variables

Your `.env` file works for the web app. For mobile apps:
- Variables are bundled at build time
- Firebase config works the same way (already set up in your app)
- No additional configuration needed for Firebase

## Troubleshooting

### Android Studio can't find Android SDK
1. Open Android Studio
2. Go to **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Set SDK location and install required SDK versions

### iOS build fails
1. Make sure CocoaPods is installed: `sudo gem install cocoapods`
2. Run: `cd ios/App && pod install`
3. Try cleaning build: In Xcode, **Product** → **Clean Build Folder**

### Changes not appearing in mobile app
1. Always run `npm run build` first
2. Then run `npm run cap:sync`
3. In the native IDE, clean and rebuild the project

### Firebase not working on mobile
- Check that your Firebase project has Android/iOS apps configured
- Add the google-services.json (Android) and GoogleService-Info.plist (iOS) files
- See Firebase Console → Project Settings → Your apps

## Publishing

### Google Play Store (Android)

1. Create a Google Play Developer account ($25 one-time fee)
2. Build a signed App Bundle (AAB) in Android Studio
3. Upload to Google Play Console
4. Fill in store listing, content rating, pricing
5. Submit for review

**Resources:**
- https://developer.android.com/studio/publish
- https://play.google.com/console

### Apple App Store (iOS)

1. Enroll in Apple Developer Program ($99/year)
2. Create an App ID in Apple Developer Portal
3. Create app in App Store Connect
4. Build and archive in Xcode
5. Upload to App Store Connect
6. Submit for review

**Resources:**
- https://developer.apple.com/app-store/
- https://appstoreconnect.apple.com/

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Run web app in development mode |
| `npm run build` | Build web app for production |
| `npm run cap:sync` | Build and sync to all platforms |
| `npm run cap:sync:android` | Build and sync to Android only |
| `npm run cap:sync:ios` | Build and sync to iOS only |
| `npm run cap:open:android` | Open project in Android Studio |
| `npm run cap:open:ios` | Open project in Xcode |
| `npm run cap:run:android` | Build, sync, and run on Android |
| `npm run cap:run:ios` | Build, sync, and run on iOS |
| `npx cap doctor` | Check Capacitor setup and dependencies |

## Additional Resources

- **Capacitor Docs:** https://capacitorjs.com/docs
- **Android Developer Guide:** https://developer.android.com/guide
- **iOS Developer Guide:** https://developer.apple.com/documentation/
- **Capacitor Plugins:** https://capacitorjs.com/docs/plugins

## Need Help?

- Capacitor Community: https://ionic.io/community
- Stack Overflow: Use tags `capacitor`, `android`, `ios`
- Capacitor GitHub: https://github.com/ionic-team/capacitor

---

**Note:** The web version of your app continues to work independently. All changes you make to the web app can be deployed to both web and mobile platforms.
