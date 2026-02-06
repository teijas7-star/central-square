# Central Square iOS App

A React Native (Expo) mobile application for Central Square - the community marketplace.

## Prerequisites

- **Node.js** 18+
- **Xcode** 15+ (for iOS simulator)
- **VS Code** with recommended extensions

### Required VS Code Extensions

Install these for the best development experience:

1. **Expo Tools** (`expo.vscode-expo-tools`)
   - Provides Expo-specific IntelliSense and debugging

2. **React Native Tools** (`msjsdiag.vscode-react-native`)
   - Debug React Native apps, run commands

3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocomplete for NativeWind classes

4. **ESLint** (`dbaeumer.vscode-eslint`)
   - Linting support

5. **Prettier** (`esbenp.prettier-vscode`)
   - Code formatting

## Quick Start

### 1. Install Dependencies

```bash
cd ios_app
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start the Web Backend

In a separate terminal:
```bash
cd ../   # Go to central-square root
npm run dev
```

### 4. Start the Expo Development Server

```bash
npm start
```

### 5. Run on iOS Simulator

Press `i` in the Expo CLI, or run:
```bash
npm run ios
```

## Viewing the App in VS Code

### Option 1: iOS Simulator (Recommended)

1. Open the Expo CLI (`npm start`)
2. Press `i` to open iOS simulator
3. The app will build and launch automatically

### Option 2: Expo Go on Physical Device

1. Install "Expo Go" from the App Store
2. Scan the QR code from `npm start`
3. App opens in Expo Go

### Option 3: Development Build

For features requiring native code:
```bash
npx expo run:ios
```

## Project Structure

```
ios_app/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication flow
│   ├── (tabs)/            # Main tab navigator
│   ├── arcade/[id]/       # Arcade detail screens
│   └── ai-host.tsx        # AI Host chat
├── components/
│   ├── ui/                # Base UI components
│   ├── arcade/            # Arcade-related components
│   ├── post/              # Post-related components
│   └── ai-host/           # AI Host components
├── hooks/                 # Custom React hooks
├── services/              # API services
├── stores/                # Zustand state stores
├── constants/             # Design tokens & config
└── assets/                # Images, fonts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run ios:device` | Run on physical iOS device |
| `npm run lint` | Run ESLint |
| `npm run build:ios` | Create production iOS build |

## Design System

### Colors (Dark Theme)
- **Background:** `#000000`
- **Surface:** `#171717`
- **Accent:** `#F59E0B` (Amber)
- **Text:** `#FAFAFA`

### Typography
- **Headlines:** Serif (Georgia)
- **Body:** Sans-serif (Inter/System)

### Spacing
Uses Tailwind's spacing scale via NativeWind.

## Troubleshooting

### "Unable to resolve module"
```bash
npx expo start --clear
```

### iOS Simulator not starting
1. Open Xcode
2. Go to Xcode → Settings → Platforms
3. Ensure iOS Simulator is installed

### Metro bundler issues
```bash
rm -rf node_modules .expo
npm install
npx expo start --clear
```

### NativeWind styles not applying
Ensure `global.css` is imported in `app/_layout.tsx`:
```typescript
import "../global.css";
```

## API Integration

The app connects to the Next.js backend at `EXPO_PUBLIC_API_URL`.

### Endpoints Used
- `/api/auth/*` - Authentication
- `/api/profiles` - User profiles
- `/api/arcades/*` - Arcades CRUD
- `/api/posts/*` - Posts CRUD
- `/api/ai-host/*` - AI Host chat & recommendations
- `/api/feed/square` - Global feed

## Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint` to check for issues
4. Test on iOS simulator
5. Submit PR

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
