# Налаштування мобільного застосунку SPUA (Capacitor)

## Передумови

### Для iOS:
- Mac з Xcode 14+
- Apple Developer Account ($99/рік)
- CocoaPods (`sudo gem install cocoapods`)

### Для Android:
- Android Studio
- Google Play Developer Account ($25 одноразово)
- Java 17+

---

## 1. Початкове налаштування

```bash
# Клонуйте репозиторій
git clone <your-repo-url>
cd spua

# Встановіть залежності
npm install

# Встановіть Capacitor пакети
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

# Збудуйте проект
npm run build

# Додайте платформи
npx cap add ios
npx cap add android

# Синхронізуйте
npx cap sync
```

---

## 2. Налаштування іконок та Splash Screen

### Автоматичне генерування (рекомендовано)

```bash
# Встановіть @capacitor/assets
npm install -D @capacitor/assets

# Помістіть вихідні зображення:
# - assets/icon.png (1024x1024, для іконки)
# - assets/splash.png (2732x2732, для splash screen)

# Згенеруйте всі розміри автоматично
npx capacitor-assets generate
```

### Структура файлів для іконок

```
assets/
├── icon.png              # 1024x1024 - основна іконка
├── icon-foreground.png   # 1024x1024 - передній план (Android adaptive)
├── icon-background.png   # 1024x1024 - задній план (Android adaptive)
├── splash.png            # 2732x2732 - splash screen
└── splash-dark.png       # 2732x2732 - splash screen (темна тема)
```

### Ручне налаштування

#### iOS (ios/App/App/Assets.xcassets/)
Створіть іконки таких розмірів:
- 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5
- Кожен у @1x, @2x, @3x варіантах

#### Android (android/app/src/main/res/)
- mipmap-mdpi: 48x48
- mipmap-hdpi: 72x72
- mipmap-xhdpi: 96x96
- mipmap-xxhdpi: 144x144
- mipmap-xxxhdpi: 192x192

---

## 3. Налаштування Splash Screen

### Встановлення плагіна

```bash
npm install @capacitor/splash-screen
npx cap sync
```

### Конфігурація (capacitor.config.ts)

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.caf8c97b0aea4eba8bd07e77e5a22197',
  appName: 'spua',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
```

### Використання в коді

```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Показати splash screen
await SplashScreen.show({
  showDuration: 2000,
  autoHide: true,
});

// Приховати вручну
await SplashScreen.hide();
```

---

## 4. Push-повідомлення

### 4.1 Встановлення

```bash
npm install @capacitor/push-notifications
npx cap sync
```

### 4.2 Налаштування iOS

1. Відкрийте проект в Xcode:
   ```bash
   npx cap open ios
   ```

2. Увімкніть Push Notifications:
   - Виберіть проект в Navigator
   - Перейдіть до "Signing & Capabilities"
   - Натисніть "+ Capability"
   - Додайте "Push Notifications"
   - Додайте "Background Modes" → увімкніть "Remote notifications"

3. Створіть APNs ключ в Apple Developer Portal:
   - Certificates, Identifiers & Profiles → Keys
   - Створіть новий ключ з Apple Push Notifications service (APNs)
   - Завантажте .p8 файл (зберігайте надійно!)

### 4.3 Налаштування Android

1. Створіть проект в [Firebase Console](https://console.firebase.google.com/)

2. Додайте Android застосунок:
   - Package name: `app.lovable.caf8c97b0aea4eba8bd07e77e5a22197`
   - Завантажте `google-services.json`

3. Помістіть файл:
   ```
   android/app/google-services.json
   ```

4. Оновіть `android/build.gradle`:
   ```gradle
   dependencies {
       classpath 'com.google.gms:google-services:4.4.0'
   }
   ```

5. Оновіть `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   
   dependencies {
       implementation platform('com.google.firebase:firebase-bom:32.7.0')
       implementation 'com.google.firebase:firebase-messaging'
   }
   ```

### 4.4 Код для Push-повідомлень

```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// Реєстрація та отримання токена
const registerPush = async () => {
  // Запит дозволу
  let permStatus = await PushNotifications.checkPermissions();
  
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  
  if (permStatus.receive !== 'granted') {
    console.log('Push notification permission denied');
    return;
  }
  
  // Реєстрація
  await PushNotifications.register();
};

// Обробники подій
PushNotifications.addListener('registration', (token) => {
  console.log('Push registration success, token:', token.value);
  // Відправте токен на ваш сервер
});

PushNotifications.addListener('registrationError', (error) => {
  console.error('Push registration error:', error);
});

PushNotifications.addListener('pushNotificationReceived', (notification) => {
  console.log('Push notification received:', notification);
  // Застосунок відкритий - покажіть in-app повідомлення
});

PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
  console.log('Push notification action:', notification);
  // Користувач натиснув на повідомлення
});

// Ініціалізація при старті застосунку
registerPush();
```

### 4.5 Відправка Push-повідомлень (серверна частина)

#### Через Firebase Cloud Messaging (FCM):

```typescript
// Edge Function приклад
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = async (token: string, title: string, body: string) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };
  
  await admin.messaging().send(message);
};
```

---

## 5. Збірка для публікації

### iOS

```bash
# Синхронізуйте зміни
npx cap sync ios

# Відкрийте в Xcode
npx cap open ios

# В Xcode:
# 1. Виберіть "Any iOS Device" як target
# 2. Product → Archive
# 3. Distribute App → App Store Connect
```

### Android

```bash
# Синхронізуйте зміни
npx cap sync android

# Збудуйте release APK
cd android
./gradlew assembleRelease

# Або AAB для Play Store
./gradlew bundleRelease
```

Файли будуть у:
- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/`

---

## 6. Корисні команди

```bash
# Синхронізація після змін
npx cap sync

# Запуск на пристрої/емуляторі
npx cap run ios
npx cap run android

# Відкриття в IDE
npx cap open ios
npx cap open android

# Оновлення Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
npx cap sync
```

---

## 7. Налагодження

### iOS
- Використовуйте Safari → Develop → [Ваш пристрій] для Web Inspector

### Android
- Використовуйте Chrome → chrome://inspect для DevTools

### Логи
```bash
# iOS логи
npx cap run ios --target=<device-id> -l

# Android логи
adb logcat | grep -i "capacitor"
```

---

## Питання?

Зверніться до офіційної документації:
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Push Notifications](https://capacitorjs.com/docs/apis/push-notifications)
- [Splash Screen](https://capacitorjs.com/docs/apis/splash-screen)
