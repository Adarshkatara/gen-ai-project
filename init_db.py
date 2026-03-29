"""
init_db.py — Initialize the SQLite database for NEXUS Edu.
Run this once after cloning: python init_db.py
"""
import sqlite3
import os

DB_FILE = 'smart_college.db'

if os.path.exists(DB_FILE):
    print(f"⚠️  '{DB_FILE}' already exists. Delete it first if you want a fresh reset.")
    answer = input("Delete and recreate? (y/N): ").strip().lower()
    if answer != 'y':
        print("Aborted.")
        exit(0)
    os.remove(DB_FILE)

print("🔧 Creating database from schema.sql...")
conn = sqlite3.connect(DB_FILE)
with open('schema.sql', 'r', encoding='utf-8') as f:
    script = f.read()
conn.executescript(script)
conn.commit()
conn.close()
print("✅ Database initialized successfully!")
print("   Default credentials:")
print("   Admin   → admin@college.com   / admin123")
print("   Faculty → faculty@college.com / fac123")
print("   Student → student@college.com / stu123")
print("\nRun the app with: python app.py")
