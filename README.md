# 🏋️‍♂️ Master Fitness Academy LMS

**Master Fitness Academy** is a modern, high-performance Learning Management System (LMS) designed for professional education and certification of fitness trainers. The platform covers the entire learning journey — from course enrollment to final assessment and issuance of verifiable digital diplomas.
Website: https://master-fitness.netlify.app/
---

## 🎯 Objective

To deliver premium-quality fitness education led by experienced industry professionals, followed by official certification and professional recognition for graduates.

---

## ✨ Key Features

### 📚 Course Catalog
- Professional training programs
- Categories include personal training, functional training, rehabilitation, nutrition, and more
- Courses are created and delivered by certified expert instructors

## 📸 Platform Screenshots

![Home Page](https://github.com/user-attachments/assets/fd65e026-e4cf-40d8-88ba-dcdf3d73335c)
![Diploma Catalog](https://github.com/user-attachments/assets/53fd7a3a-2fe4-4e2e-b6b3-3580fec171bb)
![Student Dashboard](https://github.com/user-attachments/assets/b10c8a8b-766b-40e3-a9c8-74a7bfaf643f)

### 👤 Student Profile (Dashboard)
Each student has a personal dashboard with:
- active and completed courses
- learning progress tracking
- test and exam results
- homework grades and feedback

### 🎓 Learning Ecosystem

#### 🎥 Video Lessons
- Structured video lessons (theory + practice)
- Progressive access based on course flow

#### 📝 Homework (Assignments)
- Homework submission (text, files, videos)
- Instructor review and personalized feedback

#### 🧠 Automated Testing
- Quizzes for knowledge checks
- Final exams
- Exam access conditions based on progress and assignments

#### 👨‍🏫 Instructor Guidance
- Direct instructor feedback
- Homework evaluation and comments
- Ongoing academic support

### 🪪 Digital Diplomas & Public Registry
- Digital diplomas issued upon successful course completion
- Each diploma has a unique verification ID
- **Public Diploma Registry**:
  - anyone can verify a diploma at any time
  - displays graduate name, course, issue date, and status

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **State Management:** Store-based architecture (Auth, Courses, Lessons, Progress)
- **Styling:** Tailwind CSS + PostCSS
- **Security:**
  - Middleware-based route protection
  - Role-based access control (Student / Instructor / Admin)
- **Architecture:** Modular and scalable system design

---

## 📂 Project Structure

```txt
src/
├── app/
│   ├── (auth)/          # authentication (login / register)
│   ├── dashboard/       # student profile
│   ├── courses/         # course catalog & course pages
│   ├── lessons/         # lessons and video content
│   ├── tests/           # quizzes and final exams
│   ├── diplomas/        # public diploma registry
│   └── admin/           # admin panel
│
├── components/          # reusable UI components
├── services/            # API services and business logic
├── store/               # global state stores
├── lib/                 # utilities and helpers
├── styles/              # global styles
└── middleware.ts        # route protection
```

---

## 👥 User Roles

- **Student** — learning, homework, tests, diplomas
- **Instructor** — course management, homework review, student feedback
- **Admin** — platform management, users, courses, diplomas

---

## 🚀 Platform Vision

Master Fitness Academy aims to become a benchmark online education platform for professional fitness trainers, offering transparent certification, industry trust, and real career opportunities for graduates.

---

## 📌 Future Plans

- Online payments and subscriptions
- Multilingual support
- Mobile-first experience
- Integration with fitness clubs and employers
- Blockchain / NFT-based diploma verification

---

**Master Fitness Academy** — educating professionals, validating excellence.

