# Expo Development Build Setup

## What We've Set Up

### 1. Development Build Configuration
- ✅ Installed `expo-dev-client` package
- ✅ Added `expo-dev-client` plugin to app.json
- ✅ Created `eas.json` with build profiles
- ✅ Updated package.json with build scripts
- ✅ Initialized EAS project

### 2. Build Profiles
- **Development**: Includes dev client for debugging
- **Preview**: Internal distribution build
- **Production**: App store ready build

### 3. Available Commands

```bash
# Start development server with dev client
npm run start:dev-client

# Build development builds
npm run build:dev:android
npm run build:dev:ios

# Build preview builds
npm run build:preview:android
npm run build:preview:ios

# Build production builds
npm run build:production
```

### 4. Current Build Status
Your Android development build is currently being processed on EAS Build servers.

Build URL: https://expo.dev/accounts/rajesh221/projects/brain-detox/builds/ccb56acc-cdfd-4cf0-87c4-8302849d27ad

### 5. Next Steps

1. **Wait for Build**: The current Android development build will be ready soon
2. **Install Development Build**: Download and install the APK on your Android device
3. **Start Dev Server**: Run `npm run start:dev-client`
4. **Connect Device**: Scan QR code or use connection URL
5. **Start Developing**: Your app will reload with hot reload enabled

### 6. Benefits of Development Build

- **Custom Native Code**: Use any React Native library
- **Background Tasks**: Test background fetch and notifications
- **Real Device Testing**: Test on actual hardware
- **Hot Reload**: Fast development iterations
- **Debug Menu**: Access to debugging tools

### 7. Debugging

Once your development build is installed:
- Shake device to open debug menu
- Enable Fast Refresh for hot reloading
- Use React DevTools for component inspection
- Debug network requests and async operations

### 8. Build Monitoring

Monitor your builds at:
https://expo.dev/accounts/rajesh221/projects/brain-detox/builds

### 9. Environment Variables

To add environment variables for different build profiles, update `eas.json`:

```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_DEBUG": "true"
      }
    }
  }
}
```
