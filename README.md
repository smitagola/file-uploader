# 📤 File Uploader Microservice

A lightweight Node.js + TypeScript microservice for uploading images or documents to **Cloudinary** and retrieving public links. Useful for integrating into any project that needs quick, reliable file hosting.

## 🚀 Live Demo

▶️ **API Base URL:**  
[https://file-uploader-i80r.onrender.com](https://file-uploader-i80r.onrender.com)

---

## 📌 Features

- Upload documents/images using `multipart/form-data`
- Cloudinary integration (free cloud storage for media)
- Returns direct URL of the uploaded file
- TypeScript-based structure
- Built with Express.js
- Multer for file handling

---

## 🧪 Endpoints

### ✅ Health Check

```http
GET /
