# TalentFlow AI — Recruitment & Employee Onboarding Platform

**TalentFlow AI** is a full-stack recruitment and employee onboarding platform built to streamline hiring workflows, automate repetitive HR tasks, and simplify candidate management.

The application combines a React frontend with a Python FastAPI backend and PostgreSQL database. It provides functionality for managing job postings, processing resumes, ranking candidates, tracking applications, and automating employee onboarding activities.

## Key Features

### 🔐 Authentication & Security

* User registration and login.
* JWT-based authentication.
* Protected frontend routes.
* Secure password handling.

### 💼 Job & Candidate Management

* Create and manage job postings.
* Maintain candidate information.
* Manage job applications.
* Organize recruitment workflows.

### 📄 Resume Processing & Candidate Matching

* Upload candidate resumes.
* Automatically process resume information.
* Evaluate candidate suitability through ranking and skill-matching functionality.
* Support recruitment decisions with candidate-ranking results.

### 📊 Recruiter Dashboard

* Access recruitment information through a centralized dashboard.
* View relevant job and candidate information.
* Manage recruitment activities through the application interface.

### 🤖 AI Chatbot

* Interact with the chatbot through a dedicated interface.
* Process chatbot requests through the backend service layer.

### 🚀 Employee Onboarding Automation

* Manage employee onboarding workflows.
* Generate offer-letter PDFs.
* Automate welcome emails.
* Reduce repetitive administrative work during employee onboarding.

## Technology Stack

| Category              | Technologies                         |
| --------------------- | ------------------------------------ |
| Programming Languages | Python, JavaScript                   |
| Frontend              | React, React Router, HTML5, CSS3     |
| UI Components         | Material UI                          |
| Frontend Build Tool   | Vite                                 |
| Backend Framework     | FastAPI                              |
| API Communication     | REST APIs, Axios                     |
| Database              | PostgreSQL                           |
| ORM                   | SQLAlchemy                           |
| Data Validation       | Pydantic                             |
| Authentication        | JWT                                  |
| Configuration         | Environment variables, python-dotenv |
| API Testing           | FastAPI Swagger UI                   |

## System Architecture

TalentFlow AI follows a layered architecture that separates the user interface, API endpoints, business logic, and database operations.

```text
┌─────────────────────────────────────┐
│           React Frontend            │
│                                     │
│  Dashboard | Jobs | Candidates      │
│  Applications | Chatbot | Onboarding│
└─────────────────┬───────────────────┘
                  │
                  │ HTTP / REST APIs
                  ▼
┌────────────────────────────────────┐
│            FastAPI Backend         │
│                                    │
│  Authentication & API Routes       │
│  Request Validation                │
│  Application Logic                 │
└─────────────────┬──────────────────┘
                  │
                  ▼
┌────────────────────────────────────┐
│           Service Layer            │
│                                    │
│  Resume Processing                 │
│  Candidate Ranking                 │
│  Chatbot                           │
│  Onboarding                        │
│  Email & PDF Generation            │
└─────────────────┬──────────────────┘
                  │
                  ▼
┌────────────────────────────────────┐
│          PostgreSQL Database       │
│             SQLAlchemy             │
└────────────────────────────────────┘
```

## Project Structure

```text
TalentFlow-AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── candidates.py
│   │   │   ├── chatbot.py
│   │   │   ├── dashboard.py
│   │   │   ├── job_candidate.py
│   │   │   ├── jobs.py
│   │   │   ├── onboarding.py
│   │   │   └── upload.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── init_db.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── chatbot_service.py
│   │   │   ├── onboarding_service.py
│   │   │   ├── ranking_service.py
│   │   │   └── resume_service.py
│   │   │
│   │   ├── utils/
│   │   │   ├── email_sender.py
│   │   │   └── pdf_generator.py
│   │   │
│   │   ├── crud.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── requirements.txt
```

## Getting Started

Follow these instructions to run TalentFlow AI locally.

### Prerequisites

Install the following:

* Python 3.12
* Node.js and npm
* PostgreSQL
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/sofiyaalimuddin/TalentFlow-AI.git

cd TalentFlow-AI
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add your PostgreSQL connection string:

```env
DATABASE_URL=your_postgresql_connection_string
```

Replace the placeholder with your actual connection string.

Ensure the database exists and PostgreSQL is running before starting the application.

**Security:** Never commit your `.env` file, database credentials, passwords, or secret keys to GitHub.

### 4. Initialize the Database

The backend initializes its database tables through SQLAlchemy when the application starts.

Review `backend/app/database/init_db.py` if your local setup requires additional database initialization.

### 5. Start the Backend

From the `backend` directory, run:

```bash
uvicorn app.main:app --reload
```

The API should now be available at:

* **API base:** http://127.0.0.1:8000
* **Interactive API documentation:** http://127.0.0.1:8000/docs
* **Health check:** http://127.0.0.1:8000/health

### 6. Start the Frontend

Open a second terminal and navigate to the frontend directory from the repository root:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

Ensure `frontend/src/api.js` points to the correct backend address.

## API Overview

The backend organizes its endpoints into the following modules:

| Module             | Responsibility              |
| ------------------ | --------------------------- |
| `auth.py`          | Authentication              |
| `dashboard.py`     | Dashboard information       |
| `jobs.py`          | Job management              |
| `candidates.py`    | Candidate management        |
| `job_candidate.py` | Job-candidate relationships |
| `upload.py`        | Resume uploads              |
| `onboarding.py`    | Employee onboarding         |
| `chatbot.py`       | Chatbot functionality       |

For the complete list of registered endpoints, request parameters, and response schemas, use the interactive Swagger documentation at `/docs`.

## Security & Configuration

* Store credentials and secrets in environment variables.
* Keep local `.env` files out of version control.
* Configure CORS for the appropriate frontend origins.
* Protect authenticated endpoints.
* Avoid exposing private credentials in frontend code.

## Project Status

* **Development status:** Functional local application.
* **Frontend:** React with Vite.
* **Backend:** FastAPI.
* **Database:** PostgreSQL.
* **Deployment:** Not currently available as a public live application.

## Future Enhancements

Potential areas for further development include:

* Public deployment of the full application.
* Automated testing and continuous integration.
* Additional resume-parsing and candidate-matching improvements.
* Enhanced chatbot capabilities.
* Expanded recruitment analytics.

## Author

**Sofiya Alimuddin**

[GitHub Profile](https://github.com/sofiyaalimuddin)
