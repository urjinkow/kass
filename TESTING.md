# Testing Guide

## Pre-Testing Setup

### Environment Requirements
- Windows 10 or later
- Thermal printer (58mm or 80mm)
- Node.js 18+ installed

### Installation
```bash
git clone https://github.com/urjinkow/kass.git
cd kass
npm install
```

## Test Cases

### 1. Authentication Tests

#### TC001: Successful Login
1. Launch application
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Нэвтрэх"
5. **Expected**: Dashboard appears with user name "Системийн Админ"

#### TC002: Failed Login
1. Launch application
2. Enter username: `admin`
3. Enter wrong password
4. Click "Нэвтрэх"
5. **Expected**: Error message in Mongolian appears

#### TC003: Logout
1. Login as admin
2. Click "Гарах" button
3. **Expected**: Returns to login screen

### 2. Income Transaction Tests

#### TC004: Add Income (Cash)
1. Login as admin/cashier
2. Navigate to "Орлого"
3. Select category: "Хандив"
4. Enter amount: 50000
5. Enter donor name: "Test Donor"
6. Select payment method: "Бэлэн мөнгө"
7. Click "Хадгалах"
8. **Expected**: Success message, form clears

#### TC005: Add Income and Print
1. Navigate to "Орлого"
2. Fill in all fields
3. Click "Хадгалах & Хэвлэх"
4. **Expected**: 
   - Transaction saved
   - Receipt prints on thermal printer
   - Receipt shows Mongolian text correctly

#### TC006: Income Validation
1. Navigate to "Орлого"
2. Try to save without category
3. **Expected**: Form validation prevents submission

### 3. Expense Transaction Tests

#### TC007: Add Expense
1. Navigate to "Зарлага"
2. Select category: "Цахилгаан"
3. Enter amount: 25000
4. Enter vendor: "Energy Company"
5. Enter description: "Monthly electricity bill"
6. Select payment method: "Шилжүүлэг"
7. Click "Хадгалах"
8. **Expected**: Transaction saved successfully

#### TC008: Expense Description Required
1. Navigate to "Зарлага"
2. Fill category and amount
3. Leave description empty
4. Try to save
5. **Expected**: Validation error

### 4. Dashboard Tests

#### TC009: Dashboard Summary
1. Add multiple income and expense transactions
2. Navigate to "Хянах самбар"
3. **Expected**:
   - Opening balance shown
   - Total income calculated correctly
   - Total expense calculated correctly
   - Current balance = opening + income - expense

#### TC010: Recent Transactions
1. Add 5+ transactions
2. Check dashboard
3. **Expected**: Most recent 10 transactions displayed

### 5. Daily Close Tests

#### TC011: View Daily Summary
1. Navigate to "Өдрийн хаалт"
2. **Expected**:
   - Current day's totals shown
   - Income breakdown by category
   - Expense breakdown by category

#### TC012: Close Day
1. Navigate to "Өдрийн хаалт"
2. Enter cash counted: (should match balance)
3. Add notes: "Test close"
4. Click "Өдрийг хаах"
5. Confirm
6. **Expected**:
   - Day status changes to closed
   - Difference calculated (should be 0 if counted correctly)
   - Can still print summary

#### TC013: Close Day with Difference
1. Navigate to "Өдрийн хаалт"
2. Enter cash counted: (different from balance)
3. Click "Өдрийг хаах"
4. **Expected**: Difference shown in red/green

### 6. History Tests

#### TC014: View History
1. Navigate to "Түүх"
2. Select date range
3. **Expected**: All transactions in range displayed

#### TC015: Filter Transactions
1. Navigate to "Түүх"
2. Change date range
3. **Expected**: Table updates with new results

### 7. Settings Tests (Admin Only)

#### TC016: Access Settings as Admin
1. Login as admin
2. Navigate to "Тохиргоо"
3. **Expected**: Settings page accessible

#### TC017: Change Printer Settings
1. Navigate to "Тохиргоо"
2. Change paper width to 58мм
3. Change port to COM1
4. Click "Хадгалах"
5. **Expected**: Settings saved

#### TC018: Test Print
1. Navigate to "Тохиргоо"
2. Click "Тест хэвлэх"
3. **Expected**:
   - If printer connected: Test receipt prints
   - If not connected: Error message

### 8. Printer Tests

#### TC019: Print 58mm Receipt
1. Configure printer for 58mm
2. Add income transaction
3. Click "Хадгалах & Хэвлэх"
4. **Expected**: Receipt prints correctly formatted for 58mm

#### TC020: Print 80mm Receipt
1. Configure printer for 80mm
2. Add expense transaction
3. Click "Хадгалах & Хэвлэх"
4. **Expected**: Receipt prints correctly formatted for 80mm

#### TC021: Mongolian Text on Receipt
1. Print any receipt
2. **Expected**: 
   - All Mongolian text renders correctly
   - No garbled characters
   - Currency symbol (₮) displays
   - Amounts formatted with comma separators

#### TC022: Print Daily Summary
1. Navigate to "Өдрийн хаалт"
2. Click "Тайлан хэвлэх"
3. **Expected**: Daily summary prints with all totals

### 9. Database Tests

#### TC023: Data Persistence
1. Add several transactions
2. Close application
3. Reopen application
4. **Expected**: All transactions still present

#### TC024: Automatic Backup
1. Close application
2. Check `%USERDATA%/data/backups/`
3. **Expected**: New backup file created

#### TC025: Audit Log
1. Perform various actions (add income, expense, close day)
2. Check database audit_logs table
3. **Expected**: All actions logged with user_id and timestamp

### 10. Security Tests

#### TC026: Role-Based Access
1. Login as cashier (if created)
2. Try to access Settings
3. **Expected**: Settings not visible in menu

#### TC027: Password Hashing
1. Check database users table
2. **Expected**: password_hash field contains bcrypt hash, not plaintext

#### TC028: SQL Injection Protection
1. Try entering SQL in various fields: `'; DROP TABLE users; --`
2. **Expected**: Input treated as text, no SQL execution

### 11. Offline Tests

#### TC029: Fully Offline Operation
1. Disconnect from internet
2. Use all application features
3. **Expected**: Everything works normally

#### TC030: No External Dependencies
1. Block all network traffic
2. Launch and use application
3. **Expected**: Application starts and runs without errors

### 12. UI/UX Tests

#### TC031: Mongolian Text Display
1. Check all pages
2. **Expected**: All Mongolian text displays correctly

#### TC032: Glassmorphism Effects
1. View various pages
2. **Expected**: 
   - Glass cards with blur effect
   - Smooth animations
   - Proper shadows and borders

#### TC033: Responsive Layout
1. Resize window (within minimum constraints)
2. **Expected**: Layout adapts properly

#### TC034: Touch-Friendly Buttons
1. Measure button heights
2. **Expected**: All buttons minimum 44px height

### 13. Error Handling Tests

#### TC035: Invalid Amount
1. Try entering negative amount
2. Try entering letters in amount field
3. **Expected**: Validation prevents invalid input

#### TC036: Printer Error Handling
1. Unplug printer
2. Try to print receipt
3. **Expected**: User-friendly error message in Mongolian

#### TC037: Database Error Handling
1. Delete database file while app is closed
2. Launch app
3. **Expected**: Database recreated with schema and default data

### 14. Performance Tests

#### TC038: Large Transaction Volume
1. Add 100+ transactions
2. Navigate between pages
3. **Expected**: No lag or slowdown

#### TC039: History with Large Date Range
1. Add transactions over multiple days
2. Query large date range
3. **Expected**: Results load quickly

### 15. Build Tests

#### TC040: Development Build
```bash
npm run dev
```
**Expected**: App launches in dev mode with DevTools

#### TC041: Production Build
```bash
npm run build:win
```
**Expected**: 
- Build completes without errors
- .exe installer created in dist/ folder

#### TC042: Install and Run
1. Run the .exe installer
2. Follow installation wizard
3. Launch installed app
4. **Expected**: App runs like development version

## Acceptance Criteria

All the following must pass:

- ✅ Windows .exe installer builds successfully
- ✅ App runs completely offline
- ✅ SQLite database initializes with default data
- ✅ Admin user can log in (default: admin/admin123)
- ✅ Cashier can add income and expense transactions
- ✅ Receipt prints correctly on 58mm and 80mm thermal printers
- ✅ Mongolian text displays correctly in app and receipts
- ✅ Daily close calculates and saves summary
- ✅ Glassmorphism UI is visually appealing and professional
- ✅ All audit logs are recorded
- ✅ Backup creates valid database copy
- ✅ App handles printer errors gracefully

## Bug Reporting Template

When reporting bugs, include:

```
**Bug ID**: BUG-XXX
**Title**: Brief description
**Severity**: Critical/High/Medium/Low
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**: 
**Actual Result**: 
**Screenshots**: (if applicable)
**Environment**: Windows version, printer model
**Database**: Fresh install or existing data
```

## Test Data

### Sample Donors
- Бат (Bat)
- Болд (Bold)
- Дорж (Dorj)

### Sample Vendors
- УБ Цахилгаан (UB Electricity)
- Дулааны Компани (Heating Company)
- Бараа Материал ХХК (Supplies LLC)

### Test Amounts
- Small: 5,000₮
- Medium: 50,000₮
- Large: 500,000₮

## Post-Testing

After completing all tests:

1. Review test results
2. Document any issues found
3. Verify all critical functionality works
4. Sign off on production readiness
5. Train end users
6. Deploy to production

## Continuous Testing

For ongoing use:
- Test new features before deployment
- Verify database migrations
- Check backup integrity monthly
- Test printer compatibility with any new printers
- Validate Mongolian text after OS updates

---

**Testing Status**: Ready for manual testing on Windows with thermal printer hardware.
