
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5018a0bc658f4af29e13f4cdb4befc8a',
  appName: 'grip',
  webDir: 'dist',
  server: {
    url: 'https://5018a0bc-658f-4af2-9e13-f4cdb4befc8a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      spinnerColor: "#000000"
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true
    },
    CapacitorHttp: {
      enabled: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Browser: {
      toolbarColor: "#33C3F0"
    }
  },
  ios: {
    contentInset: "always",
    scheme: "grip", 
    backgroundColor: "#FFFFFF"
  },
  android: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
