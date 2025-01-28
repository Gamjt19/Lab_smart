import qrcode
import mysql.connector
import os

# Backend verification base URL
BASE_URL = "https://localhost:3000/verify/"

# Ensure 'qrcodes' directory exists
if not os.path.exists("qrcodes"):
    os.makedirs("qrcodes")

# Database connection setup
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",  # Replace with your MySQL root password
        database="attendance_system"
    )

# Generate QR code and insert data into the database
def generate_and_store_qr(student_name, student_id):
    # Generate unique QR code URL
    qr_code_url = f"{BASE_URL}{student_id}"
    
    # Generate QR code and save as an image
    qr = qrcode.make(qr_code_url)
    qr.save(f"qrcodes/{student_id}.png")  # Save QR code as a PNG file
    
    # Insert student details into the database
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO students (name, student_id, qr_code) VALUES (%s, %s, %s)",
                       (student_name, student_id, qr_code_url))
        conn.commit()
        print(f"Successfully added {student_name} with QR Code URL: {qr_code_url}")
    except mysql.connector.Error as e:
        print(f"Error inserting data: {e}")
    finally:
        cursor.close()
        conn.close()

# Example student data
students = [
    {"name": "John Doe", "student_id": "S123"},
    {"name": "Jane Smith", "student_id": "S124"},
    {"name": "Alice Johnson", "student_id": "S125"},
]

# Generate QR codes and insert each student into the database
for student in students:
    generate_and_store_qr(student["name"], student["student_id"])
