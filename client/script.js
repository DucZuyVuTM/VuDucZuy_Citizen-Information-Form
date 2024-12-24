// Hàm tải lại danh sách lịch sử công dân
async function loadHistory() {
    try {
        // Gửi yêu cầu đến API để lấy lịch sử thông tin công dân
        const response = await fetch('/history');
        const historyData = await response.json();

        // Lấy phần tử HTML để hiển thị danh sách lịch sử
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = ''; // Xóa danh sách cũ

        // Duyệt qua dữ liệu và thêm vào danh sách
        historyData.forEach((entry) => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}, DOB: ${entry.date_of_birth.slice(0, 16)}, Citizen Code: ${entry.citizen_code}`;
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error("Failed to load history:", error);
    }
}

// Hàm gửi dữ liệu công dân mới vào cơ sở dữ liệu
async function submitCitizenData() {
    try {
        // Lấy giá trị từ các trường nhập
        const name = document.getElementById('name').value;
        const dateOfBirth = document.getElementById('date_of_birth').value;
        const citizenCode = document.getElementById('citizen_code').value;

        // Gửi yêu cầu POST đến API
        const response = await fetch('/collect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                date_of_birth: dateOfBirth,
                citizen_code: citizenCode
            })
        });

        if (response.ok) {
            // Nạp lại lịch sử sau khi gửi thành công
            loadHistory();
        } else {
            console.error("Failed to submit data:", response.statusText);
        }
    } catch (error) {
        console.error("Error occurred while submitting data:", error);
    }
}

async function deleteCitizen(event) {
    event.preventDefault(); // Ngăn form gửi yêu cầu mặc định

    const dcitizenCode = document.getElementById('dcitizen_code').value; // Lấy dữ liệu từ form
    if (!dcitizenCode.trim()) {
        alert("Please enter a valid Citizen Code.");
        return;
    }

    const userConfirmed = window.confirm("Do you want to continue deleting information?");

    if (!userConfirmed) {
        return;
    }

    try {
        // Gửi yêu cầu xóa công dân với phương thức POST
        const response = await fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ citizen_code: dcitizenCode }) // Đặt citizen_code vào body
        });

        if (response.ok) {
            alert("Citizen deleted successfully.");
            loadHistory(); // Cập nhật lại danh sách
        } else {
            const errorMsg = await response.text();
            alert(`Failed to delete citizen: ${errorMsg}`);
        }
    } catch (error) {
        console.error("Error deleting citizen:", error);
        alert("An error occurred while deleting the citizen. Please try again.");
    }
}

// Gắn sự kiện cho nút Submit (Thêm công dân)
document.getElementById('submit-button').addEventListener('click', submitCitizenData);

// Gắn sự kiện cho form xóa công dân
document.getElementById('delete-form').addEventListener('submit', deleteCitizen);

// Nạp lịch sử khi tải trang
window.onload = loadHistory;
