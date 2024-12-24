# Sử dụng image có Docker Compose cài sẵn
FROM docker/compose:latest

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Đặt quyền thực thi cho Docker Compose
RUN chmod +x /usr/local/bin/docker-compose

# Thiết lập lệnh khởi chạy
CMD ["docker-compose", "up", "--build"]
