# My_college_project-
This project is a Health Card Management and Appointment Booking System that allows healthcare institutions to register patients, scan their QR-coded ID cards, and display their health plan details. It also provides a seamless way to book appointments with a single click, copying the toll-free contact number to the clipboard.

🔧 Technologies Used
Frontend: HTML5, CSS3, JavaScript

Backend: Node.js with Express

Database: MySQL

Other Libraries: jsQR (QR Code Scanner)

📁 Project Structure
project-root/
├── public/
│   ├── index.html         # QR Scanner + Appointment Booking UI
│   ├── reg-index.html     # Patient Registration UI
│   ├── styles.css         # Styles for index.html
│   ├── reg-styles.css     # Styles for registration page
│   ├── script.js          # Handles QR code scanning & display logic
│   ├── reg-script.js      # Handles patient registration logic
├── server.js              # Node.js server connecting to MySQL
🚀 Features
📷 QR Code Scanning using webcam

📝 Patient Registration through a dedicated form

🔍 Fetch Patient Details from MySQL using scanned QR ID

📋 Display Card Information including name, plan, and expiry

☎️ Book Appointment Button auto-copies toll-free number

🛡️ Fully responsive and styled interface

🛠️ How to Run
1. Clone the Repository

git clone https://github.com/your-repo/health-card-system.git
cd health-card-system

2. Install Dependencies

npm install
3. Setup MySQL Database
Create a MySQL database named health_card_system and a table called patients:

CREATE DATABASE health_card_system;

USE health_card_system;

CREATE TABLE patients (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  plan VARCHAR(255),
  valid_date DATE,
  toll_free_number VARCHAR(255),
  image VARCHAR(500)
);
Note: Add sample data or use the registration form to populate the database.

4. Start the Server
5. 
node server.js
Your app will be running at http://localhost:3000.

📌 QR Scanner Usage
Open index.html in a browser.

Click Start Scanner to activate the webcam.

Scan a QR code containing a patient ID.

The patient's health card details will be displayed.

Click Book Appointment to copy the toll-free number to clipboard.

📌 Register a Patient
Open reg-index.html.

Fill in the required details and submit to register a new patient.

📞 Contact
Built with ❤️ by AshwinHue
If you have any questions or suggestions, feel free to reach out.


