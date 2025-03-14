# Lab Smart - QR Code-Based Attendance System

## 📌 Project Overview

Lab Smart is a smart attendance system designed for college computer labs. It ensures accurate student attendance tracking using QR code scanning. The system ensures students remain in the lab for at least 80% of the session before marking attendance. Attendance records are securely stored in a database and accessible by tutors and lab staff.

## 🚀 Features

- **QR Code Scanning**: Students scan their unique QR codes to mark attendance.
- **Session Duration Tracking**: Ensures students stay in the lab for the required duration.
- **Teacher's Dashboard**:
  - View, edit, and export attendance records.
  - IP whitelisting for controlled backend access.
- **Modern UI/UX**: Built with Tailwind CSS, featuring smooth animations and an intuitive layout.

## 🛠 Tech Stack

- **Frontend**: HTML, CSS.
- **Backend**: Node.js.
- **Database**: MongoDB
- **Authentication**: JWT-based authentication for secure access [In next phase]
- **Security Enhancements**: IP whitelisting



## 🔧 Setup and Installation

### Prerequisites

- Node.js & npm
- MongoDB (Local or Cloud)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/labsmart.git
   cd labsmart
   ```
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```
4. **Database Setup**
   - Configure your MongoDB connection in the `.env` file
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

## 🔐 Security Measures

- **Environment Variables**: Store API keys and credentials securely.
- **Device Whitelisting**: Restricts access to specific devices.
- **Authentication**: Secure login system for teachers.

## 📌 Future Enhancements

- Mobile app version for ease of access.
- Advanced analytics for attendance trends.
- Integration with college ERP systems.

## 💡 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## 📜 License

This project is licensed under the MIT License.

## 📞 Contact

For queries, reach out to us at gamjt97@gmail.com or open an issue in the repository.

---

🌟 *Lab Smart - Making Attendance Management Smarter!*

