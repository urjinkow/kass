import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const userDataPath = app.getPath('userData');
  const dataDir = path.join(userDataPath, 'data');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'kassa.db');
  
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  // Run migrations
  runMigrations(db);
  
  return db;
}

function runMigrations(database: Database.Database) {
  // Check if migrations table exists
  const migrationsTableExists = database
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'")
    .get();

  if (!migrationsTableExists) {
    database.exec(`
      CREATE TABLE migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      )
    `);
  }

  // Read and execute migration files
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of migrationFiles) {
    const migrationName = file.replace('.sql', '');
    
    // Check if migration already executed
    const executed = database
      .prepare('SELECT * FROM migrations WHERE name = ?')
      .get(migrationName);

    if (!executed) {
      console.log(`Running migration: ${migrationName}`);
      const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      database.exec(migrationSQL);
      database.prepare('INSERT INTO migrations (name) VALUES (?)').run(migrationName);
      
      console.log(`Migration ${migrationName} completed`);
    }
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
