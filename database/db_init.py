import psycopg2

conn = psycopg2.connect(
    dbname="blogdb",
    user="postgres",
    password="mysecretpassword",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

# Users table
cur.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
)
""")

# Blogs table
cur.execute("""
CREATE TABLE IF NOT EXISTS blogs (
    blog_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
cur.close()
conn.close()
