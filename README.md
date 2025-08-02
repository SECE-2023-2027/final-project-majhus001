# 📝 Peer Evaluation Form

This is a web-based application designed for **students to evaluate their teammates** after completing group projects. It allows fair assessment of participation, collaboration, and contribution, while also giving faculty/admins an overview of student dynamics.

---

## 🌟 Key Features

- 👨‍🎓 Student & Faculty login with secure auth
- 👥 View assigned teams and members
- ⭐ Rate teammates anonymously across multiple criteria
- 🧑‍🏫 Admin panel to create teams, view evaluations, and manage students
- 📊 Evaluation reports (team-wise breakdowns)
- 🧠 Role-based dashboard for User/Admin
- ⚙️ Backend API with modular structure

---

## 🧑‍💻 Tech Stack

| Layer       | Tech Used                                   |
|-------------|----------------------------------------------|
| Frontend    | Next.js (App Router)                         |
| Backend     | Node.js + Express-style API inside Next.js   |
| Database    | MongoDB (via Mongoose)                       |
| Auth        | NextAuth.js                                  |
| Styling     | Tailwind CSS / CSS Modules                   |
| Deployment  | Vercel / Render                              |

---

## 📂 Folder Structure Overview

peer-eval-form/
├── app/ # App Router structure
│ ├── admin/
│ │ ├── add-student/
│ │ ├── create-team/
│ │ ├── dashboard/
│ │ ├── evaluations/[teamName]/
│ │ ├── reports/
│ │ ├── update-team/
│ │ └── view-students/
│ ├── user/
│ │ ├── dashboard/
│ │ └── evaluate/[teamName]/
│ ├── login/
│ ├── register/
│ ├── layout.js
├── api/ # API Routes
│ ├── admin/evaluations/[teamName]/
│ ├── auth/[...nextauth]/
│ ├── evaluate/
│ ├── reports/
│ ├── student-teams/
│ ├── students/
│ ├── team/
│ └── users/
├── components/
│ ├── Navbar.js
│ ├── navbar.module.css
│ └── SessionWrapper.js
├── lib/
│ ├── dbConnect.js
│ └── models/
│ ├── Faculty.js
│ ├── studentModel.js
│ ├── evaluationModel.js
│ └── teamModel.js
├── public/
├── .env.local
├── .gitignore
├── next.config.mjs
├── jsconfig.json
└── README.md

yaml
Copy
Edit

---

## ⚙️ How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/peer-eval-form.git
cd peer-eval-form
2. Install dependencies
bash
Copy
Edit
npm install
3. Setup environment variables
Create a .env.local file in the root with:

env
Copy
Edit
MONGODB_URI=your_mongodb_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
4. Start the dev server
bash
Copy
Edit
npm run dev
➡️ Open in browser: http://localhost:3000

🧠 Roles in App
👨‍🎓 Student:
Log in

View assigned team

Submit evaluation for each teammate

🧑‍🏫 Admin / Faculty:
Add students

Create and assign teams

View evaluation reports

Export or analyze submissions

🧪 API Structure
Each API route is located inside app/api/:

Endpoint	Description
admin/evaluations/[teamName]	Get evaluations by team
evaluate/	Submit evaluation data
reports/	Admin report data
student-teams/	Fetch student’s assigned team
students/	Manage student data
team/	Create/edit/search teams
auth/[...nextauth]	Authentication (NextAuth)

🧩 Future Scope
📥 Export reports to CSV

📧 Email reminders for pending submissions

📊 Visual analytics for faculty

🕶️ Anonymous feedback mode

🔐 Multi-role access control (Admin, Faculty, Reviewer, etc.)

📄 License
This project is licensed under the MIT License.

🙌 Author
Made with 💖 by Majid — B.Tech IT Student, Full Stack Dev in the making 🚀
Let’s connect:
GitHub | LinkedIn