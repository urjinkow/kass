# Buddhist Monastery Cash Register System - Implementation Guide

## Quick Start

### Development Mode
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build:win
```

## Default Credentials
- Username: `admin`
- Password: `admin123`

## Features Overview

### 1. Authentication & Authorization
- Secure login with bcrypt password hashing
- Two user roles: Admin and Cashier
- Session management
- Audit logging of all logins

### 2. Income Management
- Multiple income categories (Donations, Prayer readings, etc.)
- Donor name tracking (optional)
- Payment method (Cash/Transfer)
- Receipt generation and printing

### 3. Expense Management
- Multiple expense categories (Utilities, Supplies, etc.)
- Vendor tracking (optional)
- Mandatory description field
- Receipt generation and printing

### 4. Daily Reconciliation
- Automatic summary calculations
- Cash counting and difference tracking
- Category-wise breakdowns
- Daily close functionality
- Summary report printing

### 5. Transaction History
- Date range filtering
- Combined income and expense view
- Search and filter capabilities
- Full transaction details

### 6. Settings (Admin Only)
- Printer configuration (58mm/80mm)
- Printer port selection
- Test print functionality
- Organization information

### 7. Thermal Printing
- Support for both 58mm and 80mm thermal printers
- Mongolian UTF-8 text support
- Beautiful receipt templates
- Error handling for printer issues

## Database Schema

### Tables
1. **users** - User accounts and authentication
2. **income_categories** - Income classification
3. **expense_categories** - Expense classification
4. **income_transactions** - All income records
5. **expense_transactions** - All expense records
6. **daily_summaries** - Daily financial summaries
7. **audit_logs** - Complete audit trail
8. **settings** - Application settings
9. **receipt_sequences** - Receipt number generation

### Key Features
- Soft deletes (no data loss)
- Foreign key constraints
- Performance indexes
- Automatic timestamps
- Data integrity checks

## Security Features

### 1. Password Security
- bcrypt hashing with 10 salt rounds
- No plaintext passwords stored
- Secure password comparison

### 2. Role-Based Access Control
- Admin: Full system access
- Cashier: Limited to operations (no settings)

### 3. Audit Logging
- All create/update/delete operations logged
- User tracking for all actions
- Timestamp for all activities
- JSON storage of old/new values

### 4. Data Integrity
- SQL injection prevention
- Input validation
- Foreign key constraints
- Check constraints on amounts

## Offline Architecture

### Complete Offline Operation
- No internet required for any functionality
- All data stored locally in SQLite
- No external API calls
- Fully self-contained application

### Data Storage
- Database: `%USERDATA%/data/kassa.db`
- Backups: `%USERDATA%/data/backups/`
- Automatic backups on app close
- Last 30 backups retained

## UI/UX Design

### Glassmorphism Theme
- Frosted glass panels with backdrop blur
- Soft shadows and subtle glows
- Smooth animations and transitions
- Touch-friendly buttons (44px minimum height)

### Color Palette
- Primary: Soft jade green (#5B8A72)
- Secondary: Warm gold (#C9A227)
- Background: Deep blue-gray (#1A1F2E, #242B3D)
- Glass panels: rgba(255, 255, 255, 0.1) with blur
- Text: White/light gray for contrast

### Typography
- Font: Inter, system-ui, sans-serif
- Large, readable sizes (16-18px base)
- Clear hierarchy
- High contrast for readability

## Mongolian Localization

### Complete Translation
All UI elements are in Mongolian:
- Navigation menus
- Form labels
- Button text
- Error messages
- Success notifications
- Receipt text

### Receipt Format
```
      ОМ МАНИ БАДМЭ ХУМ
================================
   ГАНДАНТЭГЧИНЛЭН ХИЙД
      Улаанбаатар хот
================================
         ОРЛОГО
         
Дугаар: INC-20260102-0001
Огноо: 2026-01-02 14:30

Төрөл: Хандив
Хандивлагч: [Name if provided]
Тайлбар: [Description]
================================
       ДҮН: 50,000₮
================================
  Баярлалаа! Сайн сайхан 
     бүхнийг хүсье.
```

## Technology Stack Details

### Frontend
- **React 18**: Modern UI library
- **TypeScript**: Type safety
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **Custom CSS**: Glassmorphism effects

### Backend (Electron Main Process)
- **Node.js**: Runtime environment
- **better-sqlite3**: Fast, synchronous SQLite
- **bcryptjs**: Password hashing
- **node-thermal-printer**: Thermal printing

### Build & Distribution
- **Vite**: Fast development and bundling
- **electron-builder**: Windows installer creation
- **NSIS**: Installer technology

## Development Workflow

### 1. Code Organization
```
src/
├── main/           # Backend (Electron main process)
│   ├── database/   # Data layer
│   ├── services/   # Business logic
│   └── ipc/        # Communication handlers
├── renderer/       # Frontend (React)
│   ├── components/ # Reusable UI
│   ├── pages/      # Application screens
│   └── stores/     # State management
└── preload/        # Security bridge
```

### 2. State Management
- Authentication state (Zustand)
- Transaction categories (Zustand)
- Printer settings (Zustand)
- Local component state (React hooks)

### 3. Data Flow
1. User action in UI (React component)
2. State update (Zustand store)
3. IPC call to main process (window.api)
4. Service layer processes request
5. Database operation
6. Audit log entry
7. Response back to renderer
8. UI update

## Common Operations

### Adding Income
1. Navigate to "Орлого" (Income)
2. Select category from dropdown
3. Enter amount
4. Optionally add donor name and description
5. Select payment method
6. Click "Хадгалах" (Save) or "Хадгалах & Хэвлэх" (Save & Print)

### Closing Day
1. Navigate to "Өдрийн хаалт" (Daily Close)
2. Review day's totals
3. Count physical cash
4. Enter counted amount
5. Review difference
6. Add notes if needed
7. Click "Өдрийг хаах" (Close Day)
8. Optionally print summary

### Printing Receipts
- Automatic: Use "Save & Print" buttons
- Manual: Click print buttons on completed transactions
- Test: Settings > Printer > Test Print

## Troubleshooting

### Printer Not Connected
1. Check USB connection
2. Verify printer is powered on
3. Go to Settings
4. Try different port (USB, COM1, COM2, etc.)
5. Click "Тест хэвлэх" (Test Print)

### Database Issues
- Database is automatically created on first run
- Backups are in `%USERDATA%/data/backups/`
- To restore: Replace kassa.db with backup file

### Login Issues
- Default admin credentials: admin/admin123
- Password is case-sensitive
- Check Caps Lock

## Deployment Checklist

### Before Production
- [ ] Change default admin password
- [ ] Configure organization name and address
- [ ] Test thermal printer with actual hardware
- [ ] Verify all receipt formats
- [ ] Test on target Windows version
- [ ] Create desktop shortcut
- [ ] Train staff on usage

### Installation on Target Machine
1. Run the installer (.exe)
2. Choose installation directory
3. Create desktop shortcut (recommended)
4. Launch application
5. Login with default credentials
6. Change admin password immediately
7. Configure printer settings
8. Test print a receipt
9. Begin operations

## Maintenance

### Regular Tasks
- Check backup directory periodically
- Export backups to external storage
- Review audit logs
- Update categories as needed

### Backup Strategy
- Automatic backups on app close
- Manual backups: Copy kassa.db file
- Store backups on external drive
- Keep multiple generations

## Support & Contact

For technical support or issues:
- Check the README.md file
- Review audit logs for errors
- Contact monastery IT support

## Credits

Developed for: **Gandandtegchinlen Monastery**
Architecture: Electron + React + SQLite
Design: Glassmorphism with Buddhist aesthetics
Language: Mongolian (Монгол хэл)

**ОМ МАНИ БАДМЭ ХУМ** 🕉️

---

*May this system bring ease to the noble work of the monastery and help manage the generous offerings of devotees with clarity and peace.*
