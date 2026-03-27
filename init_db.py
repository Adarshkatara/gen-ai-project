import mysql.connector
from app import db_config

print("Starting database initialization...")

# Remove 'database' from config so we can connect to the MySQL server globally
config = db_config.copy()
if 'database' in config:
    del config['database']

try:
    print("Connecting to MySQL using the credentials in app.py...")
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    print("Reading schema.sql...")
    with open('schema.sql', 'r', encoding='utf-8') as f:
        sql_file = f.read()
        
    # Split by semicolon and execute each complete statement
    sql_commands = sql_file.split(';')
    
    print("Executing SQL commands...")
    for command in sql_commands:
        if command.strip():
            cursor.execute(command)
            
    conn.commit()
    conn.close()
    print("✅ Success! Database 'smart_college' and all tables created.")
    print("You can now login or register in the browser.")
except Exception as e:
    print(f"❌ Error setting up database: {e}")
