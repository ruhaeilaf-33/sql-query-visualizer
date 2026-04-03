# 💻 SQL Query Visualizer

A full-stack web application that allows users to execute SQL queries and visualize results in both **tabular** and **graphical** formats.

---

## 🚀 Features

* 🔍 Execute SQL `SELECT` queries
* 📊 Display results in a structured table
* 📈 Visualize data using charts
* ⚡ Real-time query execution
* 🛡️ Basic validation for safe queries

---

## 🛠️ Tech Stack

* **Backend:** Django (Python)
* **Frontend:** HTML, CSS, JavaScript
* **Database:** SQLite
* **Visualization:** Chart.js

---

## 📂 Project Structure

```
PROJECT/
│
├── backend/        # Django backend (API)
├── frontend/       # UI (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── style.css
```

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

```
git clone https://github.com/ruhaeilaf-33/sql-query-visualizer.git
cd sql-query-visualizer
```

---

### 2️⃣ Setup Backend

```
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install django django-cors-headers djangorestframework
```

Run the server:

```
python manage.py runserver
```

---

### 3️⃣ Run Frontend

Open the file:

```
frontend/index.html
```

in your browser.

---

## 🧪 Example Queries

```
SELECT * FROM student;

SELECT name, marks FROM student;

SELECT * FROM student WHERE marks > 80;
```

---

## 🔐 Security Note

Only **SELECT queries** are allowed to:

* Prevent data modification
* Avoid SQL injection risks
* Ensure safe execution

---

## 📸 Output

* Results displayed in a table
* Graph generated dynamically based on query data

---

## 📌 Future Enhancements

* 🌙 Dark mode UI
* 📁 Export results (CSV/PDF)
* 🧠 Smart query suggestions
* 🔐 User authentication
* 📊 Advanced analytics

---

## 👩‍💻 Author

**Ruhaeilaf**
🔗 GitHub: https://github.com/ruhaeilaf-33

---

## ⭐ Show your support

If you like this project, consider giving it a ⭐ on GitHub!
