# 2006-TDDA-53  

# Lab Group: TDDA

# Team Name: Project PolyQuest 🎓
Welcome to the official repository for NTU SC2006 Software Engineering group project, PolyQuest.

---

**Frontend** | **Backend** | **Demo Video**

PolyQuest is a comprehensive web application designed to support Singapore secondary school students in making informed decisions about their polytechnic diploma courses. By combining user academic performance, subject interests, and a tailored online assessment, PolyQuest provides personalized diploma recommendations, promoting well-informed educational and career planning.

The project applied software engineering best practices, focusing on scalability, reliability, and security to ensure a high-quality user experience.

## Demo Video
https://youtu.be/3EQGKAN0aOE?si=hSnSXfqcUqm7rDeH

---

## Table of Contents
- PolyQuest 🎓
- Setup Instructions
  - Frontend
  - Backend
  - Database Seeding
- Documentation
  - API Docs
- App Design
  - Overview
  - Frontend
  - Backend
- Tech Stack
- External APIs
- Contributors

---

## Setup Instructions

### Frontend Setup

1. **Navigate to the Frontend Directory:**
   ```bash
   cd PolyQuestApp
   ```

2. **Install Node Modules:**
   ```bash
   npm install
   ```

3. **Start the Frontend Application:**
   ```bash
   npm dev
   ```

   The frontend should now be running on [http://localhost:3001](http://localhost:3001).

### Backend Setup

1. **Navigate to the Backend Directory:**
   ```bash
   cd PolyQuestAPI
   ```

2. **Configure the Database:**
   - **Please Note**: Our database is being hosted on AWS and will be taken down the end of the following week. This means that the database connection will no longer work. If you wish to test the application and run through it, please update the database connection string to your MySQL or SQLite version.

3. **Install Dependencies and Build the Project:**
   ```bash
   mvn clean install
   ```

4. **Run the Backend Application:**
   ```bash
   mvn spring-boot:run
   ```

4a. **Alternative:** If you load the Java project on IntellJ, please update your packages and it should run normally

   The backend should now be running on [http://localhost:8080](http://localhost:8080).


---

## Documentation

### API Docs
PolyQuest's backend utilizes Swagger.io, with in-built API documentation accessible at `(http://localhost:8080/swagger-ui/index.html#)`.



Detailed information for each endpoint is available in the API Docs.

---

## App Design

### Overview
The PolyQuest system is structured to deliver a user-centric experience, leveraging both backend and frontend to support students' educational planning.

### Frontend 
The frontend is built with React and is organized by user role (Student, Teacher, Admin) to streamline user navigation. Components, routes, and utilities are housed in `/src/` folders:
- **/routes**: Contains role-specific routes.
- **/components**: Reusable components.
- **/utils**: Helper functions to enhance frontend code readability.

The entry point is `/src/routes/_root.tsx`.

### Backend
The backend structure, built with Java SpringBoot, is designed for modularity and scalability:

- **Controller**: Manages incoming HTTP requests, forwarding them to appropriate service methods and returning the responses to clients.
- **Service**: Contains the core business logic, interacting with repositories to process data and execute application-specific functions.
- **Repository**: Acts as a data access layer, handling database operations like CRUD (Create, Read, Update, Delete) for entities, abstracted via JPA (Java Persistence API).
- **Model**: Defines the structure and attributes of database entities, representing tables and their relationships in Java objects.
- **DTO**: Defines the data transfer objects used for some APIs.

---


## Tech Stack

### Frontend:
- React
- TypeScript
- Tailwind CSS
- Mantine

### Backend:
- Swagger.io
- JavaSpringBoot
- PostgreSQL

---

## External APIs
PolyQuest utilizes:
- **Google OAuth 2.0** for secure, multi-role user authentication.
- **Datasets from data.gov.sg** NP, NYP, RP, TP and SP for the relevant course data.

---

## Contributors

The PolyQuest team has collaborated across various software development stages, including:
- Ideation and requirements analysis
- Use case generation and design
- UI/UX prototyping
- System architecture and diagramming
- Development, testing, and documentation

| Name            | Github Username | Role       |
|-----------------|-----------------|------------|
| Dallas Ng       | @Dallas-Ng      | Full-Stack |
| Lam Yanyee      | @yanyox         | Frontend   |
| Malcolm Fong    | @malcolmfong01  | Frontend   |
| Khoo Ze Kang    | @zk0008         | Frontend   |
| Carwyn Yeo      | @carwynyeo      | Backend    |
| Jerwin Lee      | @JerwinLee2000  | Backend    |

---

PolyQuest supports students in their educational journey, combining user data and assessments to provide tailored guidance for polytechnic course selection.
