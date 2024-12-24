import psycopg2
from flask import Flask, jsonify, request
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

def get_db_connection():
    connection = psycopg2.connect(
        host='data_storage',
        database='bigdata',
        user='app_user',
        password='password'
    )
    return connection

@app.route('/collect', methods=['POST'])
def collect_citizen():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get("name")
    date_of_birth = data.get("date_of_birth")
    citizen_code = data.get("citizen_code")

    if not name or not date_of_birth or not citizen_code:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Kết nối tới cơ sở dữ liệu và tạo cursor
        print("Adding...")
        connection = get_db_connection()
        print("Connection successful!")
        cursor = connection.cursor()

        # Thực hiện lệnh xóa trong cơ sở dữ liệu
        cursor.execute("""
        INSERT INTO citizens (name, date_of_birth, citizen_code)
        VALUES (%s, %s, %s)
        """, (name, date_of_birth, citizen_code))
        connection.commit()  # Lưu thay đổi vào cơ sở dữ liệu

        # Đóng kết nối và cursor
        print("Added.")
        cursor.close()
        connection.close()

        return '', 204  # Không trả về dữ liệu, chỉ gửi mã trạng thái thành công
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Đường dẫn để lấy toàn bộ thông tin trong database
@app.route('/history', methods=['GET'])
def get_history():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT name, date_of_birth, citizen_code FROM citizens")
        rows = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete', methods=['POST'])
def delete_citizen():
    data = request.json  # Nhận dữ liệu JSON từ body
    citizen_code = data.get('citizen_code')
    if citizen_code:
        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            # Thực hiện lệnh xóa công dân
            query = "DELETE FROM citizens WHERE citizen_code = %s"
            cursor.execute(query, (citizen_code,))
            connection.commit()

            cursor.close()
            connection.close()

            return '', 204
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify({"error": "Citizen code is required"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
