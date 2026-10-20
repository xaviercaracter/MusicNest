# Deep Cut

**Deep Cut** is a community-first platform for beat producers to share work, get early feedback, and grow their craft. Born from a 2023 college PHP project (MusicNest), Deep Cut is being rebuilt as a modern mobile-first social hangout that will evolve into a beat marketplace and collaboration hub.

## What is Deep Cut?

Deep Cut solves the cold start problem for new producers: when you upload your first beat, the silence is deafening. Deep Cut guarantees early feedback through a feedback-for-feedback credit system, creating a supportive environment where everyone listens and contributes.

### Brand: Late Night

The aesthetic is **Late Night**—dark-first with amber accents, built for late-night studio sessions.

- **Dark mode**: Near-black (#0A0A0A) with amber (#FFB000) highlights
- **Light mode**: Cream (#F5EFE3) with deep amber (#B06E16)
- High contrast, WCAG AA compliant

## Stack

- **Frontend**: Expo SDK 58 (React Native 0.88 + Web) with TypeScript and Expo Router
- **React**: 19.3.0
- **React Native**: 0.88.0
- **Backend**: PocketBase 0.40.5 (prototype), with a modular data layer in `lib/db` for future migration to Firebase/Supabase
- **Audio**: Expo AV for playback
- **Testing**: Jest 30 + React Native Testing Library 14
- **CI**: GitHub Actions

### Expo Go Compatibility

**SDK 58 requires Expo Go 58.0.5 or later**

If you're using Expo Go and see "Project is incompatible with this version of Expo Go":
1. Update Expo Go from the App Store to the latest version (58.0.5+)
2. **OR** use a development build (recommended) - see "Running iOS Development Build + Web" section

According to [Expo's version API](https://api.expo.dev/v2/versions/latest):
- **SDK 58**: Non-deprecated, requires iOS Client 58.0.5
- **SDK 52-57**: Require newer client versions than currently available
- **SDK 51 and below**: Older, but stable

For production apps, **development builds are recommended** over Expo Go as they support custom native code and don't have Expo Go version constraints.

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 24 recommended for Windows users)
- npm or yarn
- **Windows users**: PowerShell 5.1+ (pre-installed on Windows 10+)
- **For iOS development**: macOS with Xcode (for local builds) OR EAS Build account (for cloud builds)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/xaviercaracter/MusicNest.git
cd MusicNest
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

**Unix (macOS/Linux):**

```bash
cp .env.example .env
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

Edit `.env` and configure:
- **PB_ADMIN_EMAIL** / **PB_ADMIN_PASSWORD**: Your PocketBase admin credentials
- **EXPO_PUBLIC_POCKETBASE_URL**: PocketBase server URL
  - Local development: `http://127.0.0.1:8090`
  - **iOS device on LAN**: Use your PC's LAN IP (e.g., `http://192.168.1.100:8090`)
    - Windows: Run `ipconfig` and find IPv4 Address
    - macOS/Linux: Run `ifconfig` or `ip addr`

4. Start PocketBase (works on all platforms):

```bash
npm run pocketbase:start
```

On first run, the script will automatically:
- Download PocketBase 0.40.5 for your platform
- Extract it to the `pocketbase/` directory
- Start the server on http://127.0.0.1:8090

**Set up your database:**

1. Open http://127.0.0.1:8090/_/ in your browser
2. Create an admin account (first-time setup)
3. Go to **Collections** → **Import collections**
4. Upload `pocketbase/schema.json` to create all 7 collections (users, beats, comments, likes, follows, plays, battles)
5. Update `.env` with your admin credentials:
   ```
   PB_ADMIN_EMAIL=your_admin@example.com
   PB_ADMIN_PASSWORD=your_secure_password
   ```

5. Seed the database with sample data:

```bash
npm run pocketbase:seed
```

The seed script is idempotent—you can run it multiple times safely.

6. Start the development server:

**For Expo Go (quick start):**

```bash
npm start
```

**For development builds (recommended):**

```bash
npm run dev
```

Press `w` for web, `i` for iOS simulator, or `a` for Android emulator.

## Running iOS Development Build + Web (Windows)

This setup lets you run the iOS app on a physical device AND the web app simultaneously from your Windows PC using EAS cloud builds.

### One-Time Setup

1. **Install EAS CLI** (if not already installed):

```bash
npm install -g eas-cli
```

2. **Log in to Expo**:

```bash
eas login
```

3. **Configure the project**:

```bash
eas build:configure
```

4. **Register your iOS device**:

On your iPhone, open Safari and go to the device registration URL:

```bash
eas device:create
```

Follow the prompts to install the registration profile on your device.

### Building for iOS Device

Build the development client for your iPhone:

```bash
npm run build:ios:dev
```

OR for simulator (if you're on macOS):

```bash
npm run build:ios:simulator
```

This uses EAS Build (cloud-based, works from Windows). The build takes ~10-15 minutes. Once complete:
- Download the `.ipa` file from the EAS dashboard
- Install on your device using the Expo Go app or TestFlight (for ad-hoc builds)
- OR install directly via the EAS dashboard on your device

### Running Both iOS and Web

1. **Start PocketBase** (in terminal 1):

```bash
npm run pocketbase:start
```

2. **Find your PC's LAN IP**:

**Windows (PowerShell):**
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (e.g., `192.168.1.100`)

3. **Update `.env`** with your LAN IP:

```env
EXPO_PUBLIC_POCKETBASE_URL=http://192.168.1.100:8090
```

⚠️ **Important**: Your phone must be on the same WiFi network as your PC.

4. **Start the development server** (in terminal 2):

```bash
npm run dev
```

5. **Open on iOS device**:
   - Open the Deep Cut development build app on your iPhone
   - Scan the QR code shown in the terminal OR
   - Enter the URL manually (e.g., `exp://192.168.1.100:8081`)

6. **Open web** (press `w` in the terminal or open browser):
   - Navigate to http://localhost:8081
   - Both iOS and web will now connect to PocketBase on your PC

### Development Workflow

- **Hot reload**: Changes to code update instantly on both platforms
- **PocketBase data**: Shared between iOS and web
- **Debugging**: Use React Native Debugger for iOS, browser DevTools for web

### Troubleshooting

**iOS app can't connect to PocketBase:**
- Verify your phone is on the same WiFi network
- Check Windows Firewall allows connections on port 8090
  ```powershell
  New-NetFirewallRule -DisplayName "PocketBase Dev" -Direction Inbound -Protocol TCP -LocalPort 8090 -Action Allow
  ```
- Ping your PC from another device to confirm it's reachable

**"Unable to connect to Metro":**
- Ensure `npm run dev` is running
- Check the Metro bundler URL matches your LAN IP
- Try restarting the dev server

### Windows-Specific Notes

- **PowerShell**: The setup uses PowerShell's `Expand-Archive` for extraction. If you encounter issues, ensure PowerShell execution policy allows scripts:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- **PocketBase executable**: The script downloads `pocketbase.exe` for Windows automatically.
- **Port conflicts**: If port 8090 is in use, PocketBase will show an error. Stop any conflicting services or change the port in PocketBase settings.
- **Node.js version**: Node.js 24 is recommended for best compatibility with Expo and React Native on Windows.

## Features

### Current (MVP)

- **Authentication**: Sign up, sign in, profile management
- **Feed**: Chronological beat feed
- **Upload**: Audio file upload with metadata (title, BPM, key, tags)
- **Beat Detail**: Audio player, likes, and feedback comments
- **Profile**: User beats, feedback credit counter
- **Mini Player**: Persistent audio player (component scaffold ready)

### Feedback Credits

New users start with 3 feedback credits. Leave thoughtful feedback on others' beats to earn more credits, which unlock features like:

- Featured placement in the feed
- Battle entry
- Premium upload slots

### Backend Collections

PocketBase collections (see `pocketbase/schema.json`):

- **users**: Auth collection with username, bio, avatar, feedback credits
- **beats**: Title, audio URL, BPM, key, tags, user relation, stats
- **comments**: Feedback on beats
- **likes**: Beat likes with unique constraints
- **follows**: User follows
- **plays**: Play tracking (anonymous or authenticated)
- **battles**: Placeholder for future beat battles

## Development

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run test          # Jest
```

## Roadmap

### Phase 1: Hangout MVP (current)

- Chronological feed
- Upload and playback
- Feedback comments
- Feedback credit system

### Phase 2: Battles and Leaderboards

- Weekly beat battles with themes
- Voting system
- Leaderboards by plays, likes, and battle wins
- Badges and achievements

### Phase 3: Marketplace

- Buy and sell beats
- License tiers (leases, exclusives)
- Escrow and payments
- Producer storefronts

### Phase 4: Artist Collaborations

- Collaboration requests
- Stem sharing
- Version control for beats
- Co-producer credits

## Planned AI Features

Deep Cut will leverage AI to enhance the producer experience:

1. **Audio Embedding Auto-Tags**: Analyze uploaded beats and suggest relevant tags (genre, mood, instruments)
2. **Gemini Feedback Digest**: Summarize multiple feedback comments into actionable insights
3. **Comment Quality Coach**: Real-time suggestions to help users write more helpful, specific feedback

## File Structure

```
.
├── app/                  # Expo Router screens
│   ├── (auth)/          # Sign in, sign up
│   ├── (tabs)/          # Feed, upload, profile
│   ├── beat/[id].tsx    # Beat detail
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Entry point
├── components/          # Reusable components
│   └── MiniPlayer.tsx   # Persistent mini player
├── lib/
│   └── db.ts           # Modular data access layer
├── pocketbase/         # Backend setup
│   ├── schema.json     # Collection definitions
│   ├── seed.js         # Seed data
│   └── run.sh          # PocketBase launcher
├── __tests__/          # Jest tests
├── theme.ts            # Design tokens (colors, spacing, typography)
├── .github/workflows/  # GitHub Actions CI
└── README.md
```

## Gaps and Open Decisions

### Current Gaps

- **Audio File Storage**: Currently using placeholder URLs. Need to implement actual file upload to PocketBase or external storage (S3, Cloudinary)
- **Mini Player Integration**: Component exists but not wired into app-wide state (consider Zustand or Context)
- **Real-time Updates**: No realtime subscriptions for feed updates (PocketBase supports this)
- **Audio Waveform Visualization**: Not yet implemented
- **Push Notifications**: Not configured for feedback notifications

### Open Decisions

1. **Storage Strategy**: Use PocketBase file storage or move to S3/Cloudinary?
2. **State Management**: Zustand, Jotai, or React Context for global player state?
3. **Metadata Extraction**: Client-side audio analysis (Web Audio API) or server-side?
4. **Moderation**: Content moderation strategy for uploads and comments?
5. **Backend Migration Timeline**: When to migrate from PocketBase to Firebase/Supabase?

## Repository Rename

This repository was renamed from **MusicNest** to **DeepCut** (requires owner action in GitHub settings). The legacy PHP code is preserved under the `legacy-php-v1` tag.

## License

Private project for now. License TBD.

## Contact

Owner: Xavier
