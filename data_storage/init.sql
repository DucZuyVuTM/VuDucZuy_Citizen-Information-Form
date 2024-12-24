-- Kiểm tra và tạo database nếu chưa tồn tại
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'bigdata'
    ) THEN
        CREATE DATABASE bigdata;
    END IF;
END
$$;

-- Gắn kết nối tới database
\c bigdata;

-- Kiểm tra và tạo bảng nếu chưa tồn tại
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'citizens'
    ) THEN
        CREATE TABLE citizens (
            name VARCHAR(255) NOT NULL,
            date_of_birth DATE NOT NULL,
            citizen_code VARCHAR(255) PRIMARY KEY
        );
    END IF;
END
$$;

-- Gán quyền truy cập cho người dùng
GRANT ALL PRIVILEGES ON DATABASE bigdata TO app_user;
