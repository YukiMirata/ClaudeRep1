# ✨ Event Manager

**A beautiful, always-on-top event management application for Windows 11**

Never miss a moment with this stunning desktop app featuring gorgeous animations, flexible scheduling, and a modern glass morphism UI.

---

## 🎨 Features

### 🌟 Beautiful UI
- **Modern Design**: Dark theme with gradient backgrounds and glass morphism effects
- **Smooth Animations**: Framer Motion powered transitions throughout
- **Gradient Colors**: 18 vibrant preset colors for your events
- **Glass Morphism**: Backdrop blur and translucent cards
- **Custom Scrollbars**: Styled to match the aesthetic

### 📅 Event Management
- **Create Events**: Full-featured event creation with beautiful modal dialogs
- **Rich Customization**: Title, description, color, and sound settings
- **Sound Picker**: Choose from 6 beautiful preset sounds with preview
- **Complex Recurrence**: Daily, weekly, monthly, yearly patterns
- **Advanced Scheduling**: "Every 2nd Tuesday", "Last Friday of month", and more
- **Visual Previews**: See next 5 occurrences before saving
- **Search & Filter**: Find events instantly with real-time search
- **Edit & Delete**: Smooth animations for all operations

### ⏰ Timeline View
- **Still Happening**: Shows 4 currently active events
- **Just Happened**: Displays 4 recently completed events
- **Real-Time Updates**: Auto-refreshes every second
- **Countdown Timers**: Live time formatting
- **Color-Coded**: Events shine in their custom colors

### ⚙️ Settings
- **Always on Top**: Keep the app above all windows
- **Notifications**: Toggle event alerts
- **Sounds**: Enable/disable notification sounds
- **Check Interval**: Adjust event checking frequency
- **Auto-Save**: All changes saved instantly

### 🔔 Notifications
- **Event Popups**: Gorgeous floating notifications when events trigger
- **Color-Matched**: Notifications glow with your event colors
- **Pulsing Icons**: Animated calendar icons
- **Auto-Dismiss**: Notifications fade after 10 seconds
- **Manual Dismiss**: Close button for instant removal
- **Stacked Display**: Multiple notifications with elegant stacking
- **Sound Playback**: Plays selected sound when events trigger

### 🪟 Windows 11 Integration
- **Always-on-Top**: Stays visible above all other windows
- **Native Behavior**: Proper window management
- **System Tray**: (Coming soon)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (npm 10+)
- Windows 11 (for always-on-top features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ClaudeRep1

# Install dependencies
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install

# Download Electron binary (if needed)
npm install electron

# Start development server
npm run dev
```

### Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Create installer
npm run electron:build
```

---

## 🎯 Usage

### Creating an Event

1. Click **"+ New Event"** button
2. Enter event details:
   - **Title** (required)
   - **Description** (optional)
   - **Color** - Choose from 18 beautiful gradients
   - **Start Date & Time**
   - **Recurrence Pattern** - Select from presets or custom
   - **Notification Sound** - Pick from 6 preset sounds with preview
3. Adjust **volume slider** for notifications
4. Click **"Create Event"**

### Sound Presets

Choose from 6 beautiful notification sounds:
- **Bell** - Classic notification bell
- **Chime** - Soft melodic chime
- **Ding** - Quick attention sound
- **Alert** - Urgent alert tone
- **Notify** - Gentle notification
- **Ping** - Quick ping sound

Each sound has a **play/pause button** for instant preview!

### Recurrence Patterns

**Presets available:**
- Every Day
- Every Weekday (Mon-Fri)
- Every Week
- Every 2 Weeks
- Every Month
- Every Year
- Custom patterns

### Managing Events

- **Search**: Type in the search bar to filter events
- **Filter**: View All, Active, or Disabled events
- **Edit**: Click the pencil icon on any event card
- **Delete**: Click the trash icon (with confirmation)

### Settings

Navigate to Settings page to customize:
- **Always on Top**: Toggle window floating behavior
- **Notifications**: Enable/disable alerts
- **Sounds**: Toggle notification sounds
- **Check Interval**: Set how often to check for events (10-60s)

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling with custom configuration
- **Zustand** - State management
- **React Hook Form** - Form handling
- **React Hot Toast** - Beautiful notifications

### Desktop
- **Electron** - Desktop app framework
- **SQLite** (better-sqlite3) - Local database
- **IPC Bridge** - Secure renderer ↔ main communication

### Event Engine
- **rrule.js** - RFC 5545 compliant recurrence rules
- **Day.js** - Date manipulation and formatting
- **Howler.js** - Audio playback

### Development
- **Vite** - Fast build tool
- **vite-plugin-electron** - Electron integration
- **TypeScript** - Full type coverage

---

## 📁 Project Structure

```
ClaudeRep1/
├── electron/              # Main process
│   ├── main.ts           # Entry point
│   ├── window.ts         # Window management (always-on-top)
│   ├── database.ts       # SQLite database
│   ├── scheduler.ts      # Background event checking
│   └── ipc/              # IPC handlers
│       ├── events.ts     # Event CRUD operations
│       └── settings.ts   # Settings operations
│
├── src/                   # Renderer process
│   ├── pages/            # Main pages
│   │   ├── Timeline.tsx          # Timeline view
│   │   ├── EventManagement.tsx  # Event CRUD
│   │   └── Settings.tsx          # Settings page
│   │
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Switch.tsx
│   │   │
│   │   ├── events/       # Event-specific components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   └── RecurrenceEditor.tsx
│   │   │
│   │   └── layout/       # Layout components
│   │       └── Navigation.tsx
│   │
│   ├── stores/           # Zustand state
│   │   ├── useEventsStore.ts
│   │   ├── useSettingsStore.ts
│   │   └── useUIStore.ts
│   │
│   ├── lib/              # Utilities
│   │   ├── event-engine.ts   # Occurrence calculations
│   │   ├── recurrence.ts     # RRule helpers
│   │   ├── date-utils.ts     # Date formatting
│   │   └── utils.ts          # General utilities
│   │
│   ├── hooks/            # React hooks
│   │   ├── useEventOccurrences.ts
│   │   ├── useAudio.ts
│   │   └── useInterval.ts
│   │
│   └── types/            # TypeScript types
│       ├── event.ts
│       ├── settings.ts
│       └── window.d.ts
│
├── assets/               # Static assets
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) → Purple (#8b5cf6) gradient
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Dark slate gradients

### Typography
- **Font**: Inter (400, 500, 600, 700, 800)
- **Monospace**: JetBrains Mono (for time displays)

### Animations
- **Duration**: 200-400ms for most transitions
- **Easing**: Custom cubic-bezier(0.4, 0, 0.2, 1)
- **Spring**: bounce: 0.3, duration: 0.5-0.6s
- **Stagger**: 50-100ms delays

---

## 🔧 Development

### Environment Variables
No environment variables needed - all configuration is in code.

### Building
```bash
# Build renderer
npm run build

# Build Electron app
npm run electron:build
```

### Debugging
- Development mode includes DevTools
- Electron main process logs to console
- React errors shown in UI

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- React, TypeScript, Electron
- Framer Motion for animations
- Tailwind CSS for styling
- rrule.js for recurrence patterns
- And many other amazing open-source libraries

---

## 🚧 Roadmap

### ✅ Recently Added (Phase 5)
- ✨ Sound file picker with 6 preset sounds and preview
- ✨ Beautiful event notification popups
- ✨ Notification manager system
- ✨ Loading skeletons with shimmer effects
- ✨ Sound playback integration

### Coming Soon
- Custom sound file upload
- System tray integration
- Start on boot option
- Light theme
- Auto theme (follows system)
- Event templates
- Event categories/tags
- Export/Import events
- Calendar view
- Statistics dashboard
- Event history log

---

**Made with ❤️ and beautiful code**
