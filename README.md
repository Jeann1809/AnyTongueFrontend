# AnyTongue Frontend

A modern, real-time multi-language chat application built with Next.js 14, Tailwind CSS, and shadcn/ui components.

## Features

- 🚀 **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** components for a clean, accessible UI
- 💬 **Real-time chat** with Socket.IO (placeholder ready)
- 🌍 **Multi-language support** with native language selection
- 📱 **Responsive design** that works on all devices
- 🔐 **Authentication flow** with login and signup

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/page.js
│   │   └── signup/page.js
│   ├── (main)/              # Main application
│   │   ├── layout.js        # Main layout with chat context
│   │   ├── page.js          # Chat interface
│   │   ├── profile/page.js  # User profile
│   │   └── settings/page.js # App settings
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── auth/
│   │   └── SignUpWizard.js  # Multi-step signup form
│   ├── chat/
│   │   ├── ChatWindow.js    # Main chat interface
│   │   ├── MessageBubble.js # Individual message component
│   │   └── MessageInput.js  # Message input with Socket.IO placeholder
│   ├── layout/
│   │   ├── SideNavbar.js    # Icon-based navigation
│   │   └── ChatListSidebar.js # Chat list sidebar
│   └── ui/                  # shadcn/ui components
└── lib/
    └── utils.js             # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Key Components

### Authentication
- **Login Page**: Clean, centered login form
- **Signup Wizard**: Multi-step registration with language selection
- **Profile Page**: User information management

### Chat Interface
- **Three-column layout**: Navigation, chat list, and main chat area
- **Real-time messaging**: Socket.IO integration ready
- **Message bubbles**: Different styles for sent/received messages
- **Responsive design**: Mobile-friendly with collapsible sidebars

### Mock Data
The application includes mock data for development:
- Sample conversations with different users
- Pre-populated messages in multiple languages
- Realistic timestamps and unread counts

## Socket.IO Integration

The application is ready for Socket.IO integration. In `MessageInput.js`, you'll find commented placeholder code:

```javascript
// Uncomment when backend is ready
// const socket = io('http://localhost:3001')
// socket.on('connect', () => { ... })
// socket.on('newMessage', (data) => { ... })
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built, accessible components
- **Dark mode ready**: CSS variables configured for theme switching
- **Responsive**: Mobile-first design approach

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Use shadcn/ui CLI to add new components:
   ```bash
   npx shadcn-ui@latest add [component-name]
   ```

2. Or create custom components in the `components/` directory

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Socket.IO Client** - Real-time communication
- **class-variance-authority** - Component variants

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
