from flask import Flask, request, jsonify, session, render_template, redirect, url_for
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import psycopg2
import re

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = 'mysecretkey'
CORS(app, supports_credentials=True)

def get_db_connection():
    return psycopg2.connect(
        dbname="blogdb",
        user="postgres",
        password="mysecretpassword",
        host="localhost",
        port="5432"
    )

email_regex = re.compile(r"[^@]+@[^@]+\.[^@]+")
password_regex = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$")

#AUTH ROUTES

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('dashboard.html')

@app.route('/create-blog', methods=['GET'])
def create_blog_page():
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('create_blog.html')

@app.route('/search')
def search_page():
    return render_template('search.html')

@app.route('/myblogs')
def myblogs_page():
    return render_template('myblogs.html')

@app.route('/blogs/<int:blog_id>')
def blog_detail(blog_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT title, content, word_count, created_at FROM blogs WHERE blog_id = %s", (blog_id,))
    blog = cur.fetchone()
    cur.close()
    conn.close()

    if not blog:
        return "Blog not found", 404

    return render_template('blog.html', blog_id=blog_id, title=blog[0], content=blog[1], word_count=blog[2], created_at=blog[3])

@app.route('/recentblogs')
def recentblogs_page():
    return render_template('recentblogs.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email_regex.match(email):
        return jsonify({'error': 'Invalid email format'}), 400
    if not password_regex.match(password):
        return jsonify({'error': 'Weak password'}), 400

    hashed_password = generate_password_hash(password)
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING user_id", (email, hashed_password))
        user_id = cur.fetchone()[0]
        conn.commit()
        session['user_id'] = user_id
        return jsonify({'message': 'User registered successfully'})
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({'error': 'Email already exists'}), 409
    finally:
        cur.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT user_id, password_hash FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and check_password_hash(user[1], password):
        session['user_id'] = user[0]
        return jsonify({'message': 'Login successful'})
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    return jsonify({'authenticated': 'user_id' in session})

@app.route('/api/logout', methods=['GET','POST'])
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login_page'))
    return jsonify({'message': 'Logged out successfully'})

# BLOG ROUTES

@app.route('/api/blogs', methods=['GET','POST'])
def create_blog():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    word_count = len(content.split())

    if word_count > 1000:
        return jsonify({'error': 'Blog exceeds 1000 word limit'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO blogs (user_id, title, content, word_count)
        VALUES (%s, %s, %s, %s)
        RETURNING blog_id
    """, (session['user_id'], title, content, word_count))
    blog_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Blog created', 'blog_id': blog_id})

@app.route('/api/blogs/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT blog_id, title, content FROM blogs WHERE blog_id = %s", (blog_id,))
    blog = cur.fetchone()
    cur.close()
    conn.close()

    if not blog:
        return jsonify({'error': 'Blog not found'}), 404

    return jsonify({
        'id': blog[0],
        'title': blog[1],
        'content': blog[2]
    })

@app.route('/api/blogs/<int:blog_id>', methods=['PUT'])
def update_blog(blog_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    word_count = len(content.split())

    if word_count > 1000:
        return jsonify({'error': 'Blog exceeds 1000 word limit'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT user_id FROM blogs WHERE blog_id = %s", (blog_id,))
    owner = cur.fetchone()

    if not owner or owner[0] != session['user_id']:
        return jsonify({'error': 'Forbidden'}), 403

    cur.execute("""
        UPDATE blogs SET title = %s, content = %s, word_count = %s WHERE blog_id = %s
    """, (title, content, word_count, blog_id))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Blog updated'})

@app.route('/api/blogs/<int:blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT user_id FROM blogs WHERE blog_id = %s", (blog_id,))
    owner = cur.fetchone()

    if not owner or owner[0] != session['user_id']:
        return jsonify({'error': 'Forbidden'}), 403

    cur.execute("DELETE FROM blogs WHERE blog_id = %s", (blog_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Blog deleted'})

@app.route('/api/myblogs', methods=['GET'])
def my_blogs():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT blog_id, title, word_count, created_at FROM blogs WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
    blogs = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([{'blog_id': b[0], 'title': b[1], 'word_count': b[2], 'created_at': b[3]} for b in blogs])

@app.route('/api/blogs/recentblogs', methods=['GET'])
def recent_blogs():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT blog_id, title, word_count, created_at FROM blogs ORDER BY created_at DESC LIMIT 10
    """)
    blogs = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([{'blog_id': b[0], 'title': b[1], 'word_count': b[2], 'created_at': b[3]} for b in blogs])

@app.route('/api/blogs/search', methods=['GET'])
def search_blogs():
    title = request.args.get('title', '').strip()

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT blog_id, title, word_count, created_at FROM blogs WHERE title ILIKE %s ORDER BY title DESC",
        (f'%{title}%',)
    )
    blogs = cur.fetchall()
    cur.close()
    conn.close()

    if not blogs:
        return jsonify({'error': 'No blogs found'}), 404

    return jsonify([ {'blog_id': b[0], 'title': b[1], 'word_count': b[2], 'created_at': b[3]} for b in blogs ])

if __name__ == '__main__':
    app.run(debug=True)