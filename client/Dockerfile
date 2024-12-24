# Sử dụng image cơ sở cho nginx
FROM nginx:alpine

# Sao chép các tệp khách hàng vào thư mục được nginx sử dụng cho nội dung tĩnh
COPY index.html  /usr/share/nginx/html/
COPY styles.css  /usr/share/nginx/html/
COPY script.js   /usr/share/nginx/html/
COPY citizen.ico /usr/share/nginx/html/

# Nginx sẽ tự động khởi động khi container chạy