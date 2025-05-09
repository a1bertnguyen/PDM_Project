import axios from "axios";

// src/api/api.js
// Kiểm tra cổng API - phải phù hợp với cấu hình gateway và backend services
export const BASE_URL = 'http://localhost:2005';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Thêm timeout để tránh chờ quá lâu nếu server không phản hồi
  timeout: 10000,
  transformResponse: [(data) => {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }],
});

// Cải thiện hàm setAuthHeader để xử lý token tốt hơn
export const setAuthHeader = (token, instance) => {
  if (token && token !== 'undefined' && token !== 'null') {
    console.log("Setting auth header with token");
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log("Removing auth header due to invalid token");
    delete instance.defaults.headers.common['Authorization'];
  }
};

// Thêm helper function để kiểm tra token có hợp lệ không
export const isValidToken = (token) => {
  return token && token !== 'undefined' && token !== 'null';
};

// Hàm tiện ích để kiểm tra kết nối API
export const checkApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth`, {
      timeout: 5000,
      validateStatus: (status) => status < 500 // Coi bất kỳ phản hồi nào < 500 là thành công (kể cả 401, 404)
    });
    return {
      connected: true,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};