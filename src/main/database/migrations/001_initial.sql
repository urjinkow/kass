-- Initial database schema for Monastery Kassa System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'cashier')),
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    deleted_at TEXT
);

-- Income categories
CREATE TABLE IF NOT EXISTS income_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    name_mn TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    name_mn TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Income transactions
CREATE TABLE IF NOT EXISTS income_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_number TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    donor_name TEXT,
    description TEXT,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'transfer')),
    user_id INTEGER NOT NULL,
    transaction_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    deleted_at TEXT,
    FOREIGN KEY (category_id) REFERENCES income_categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Expense transactions
CREATE TABLE IF NOT EXISTS expense_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_number TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    vendor_name TEXT,
    description TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'transfer')),
    user_id INTEGER NOT NULL,
    transaction_date TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    deleted_at TEXT,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Daily summaries
CREATE TABLE IF NOT EXISTS daily_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    summary_date TEXT NOT NULL UNIQUE,
    opening_balance REAL NOT NULL DEFAULT 0,
    total_income REAL NOT NULL DEFAULT 0,
    total_expense REAL NOT NULL DEFAULT 0,
    closing_balance REAL NOT NULL DEFAULT 0,
    cash_counted REAL,
    difference REAL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'closed')),
    closed_by INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    closed_at TEXT,
    FOREIGN KEY (closed_by) REFERENCES users(id)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Receipt sequences
CREATE TABLE IF NOT EXISTS receipt_sequences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sequence_date TEXT NOT NULL UNIQUE,
    income_sequence INTEGER NOT NULL DEFAULT 0,
    expense_sequence INTEGER NOT NULL DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_income_trans_date ON income_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_income_category ON income_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_income_receipt ON income_transactions(receipt_number);
CREATE INDEX IF NOT EXISTS idx_income_deleted ON income_transactions(deleted_at);

CREATE INDEX IF NOT EXISTS idx_expense_trans_date ON expense_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_expense_category ON expense_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_expense_receipt ON expense_transactions(receipt_number);
CREATE INDEX IF NOT EXISTS idx_expense_deleted ON expense_transactions(deleted_at);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- Insert default income categories
INSERT INTO income_categories (name, name_mn) VALUES
    ('donation', 'Хандив'),
    ('prayer_reading', 'Ном унших'),
    ('candle_offering', 'Зул өргөх'),
    ('incense_offering', 'Сан тавих'),
    ('other', 'Бусад орлого');

-- Insert default expense categories
INSERT INTO expense_categories (name, name_mn) VALUES
    ('electricity', 'Цахилгаан'),
    ('heating', 'Дулаан'),
    ('supplies', 'Бараа материал'),
    ('maintenance', 'Засвар үйлчилгээ'),
    ('transport', 'Тээвэр'),
    ('other', 'Бусад зардал');

-- Insert default admin user (password: admin123)
-- Hash generated with bcrypt, salt rounds 10
INSERT INTO users (username, password_hash, full_name, role) VALUES
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Системийн Админ', 'admin');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
    ('organization_name', 'Гандантэгчинлэн Хийд'),
    ('organization_address', 'Улаанбаатар хот'),
    ('printer_paper_width', '80'),
    ('printer_port', 'USB'),
    ('receipt_header', 'ОМ МАНИ БАДМЭ ХУМ'),
    ('receipt_footer', 'Баярлалаа! Сайн сайхан бүхнийг хүсье.');
