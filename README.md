# Buddhist Monastery Cash Register System (Кассын Систем)

A production-ready desktop cash register application for Buddhist monasteries and non-profit organizations.

## Features

- **Desktop Application** - Electron-based Windows desktop app
- **Offline-First** - No internet connection required
- **Mongolian UI** - Complete interface in Mongolian language
- **Thermal Printing** - Support for 58mm and 80mm thermal printers
- **Modern Design** - Glassmorphism UI with calm, temple-appropriate colors
- **Comprehensive Tracking** - Income, expenses, daily reconciliation
- **Audit Logging** - Complete audit trail of all transactions
- **Automatic Backups** - Database backed up on application close
- **Role-Based Access** - Admin and cashier roles

## Installation

### Prerequisites

- Node.js 18+ and npm
- Windows OS (for deployment)

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/urjinkow/kass.git
cd kass
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

### Building for Production

Build Windows installer:
```bash
npm run build:win
```

The installer will be created in the `dist` directory.

## Default Login

- **Username:** admin
- **Password:** admin123

⚠️ **IMPORTANT:** Change the default password after first login in production!

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Desktop:** Electron 28+
- **Database:** better-sqlite3 (SQLite)
- **State Management:** Zustand
- **Styling:** Tailwind CSS + Custom Glassmorphism
- **Printing:** node-thermal-printer
- **Build:** Vite + electron-builder

## Credits

Developed for Gandandtegchinlen Monastery
ОМ МАНИ БАДМЭ ХУМ 🕉️