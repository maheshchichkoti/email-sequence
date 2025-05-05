# Email Marketing Sequence Application

A full-stack MERN application that allows users to design and implement email marketing sequences using a visual flowchart interface.

## Features

- **Visual Flowchart Interface**: Create email sequences using an intuitive drag-and-drop interface
- **Node Types**:
  - **Lead Source**: Define the recipient of the email sequence
  - **Wait/Delay**: Add time delays between emails
  - **Cold Email**: Create email content with subject and body
- **Email Scheduling**: Automatically schedules emails based on the flowchart design
- **Authentication**: Secure user authentication system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React with TypeScript
- React Flow for the visual flowchart interface
- Axios for API communication
- CSS for styling

### Backend

- Node.js with Express
- MongoDB for data storage
- Agenda.js for job scheduling
- Nodemailer for email sending
- JWT for authentication

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Clone the repository

   ```
   git clone https://github.com/yourusername/email-sequence-app.git
   cd email-sequence-app/backend
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/email-sequence
   JWT_SECRET=your_jwt_secret_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

4. Start the backend server
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```
   cd ../frontend
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:

   ```
   VITE_API_URL=http://localhost:4000/api
   ```

4. Start the frontend development server

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Sign Up/Login**: Create an account or log in to access the application
2. **Create a Flow**:
   - Add a Lead Source node and enter the recipient's email
   - Add Wait/Delay nodes to set time intervals
   - Add Cold Email nodes with subject and body content
   - Connect the nodes to create a sequence
3. **Save & Schedule**: Click the "Save & Schedule Emails" button to schedule the emails
4. **Monitor**: Emails will be sent according to the schedule you defined

## Project Structure

### Backend

```
backend/
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── email.js
│   └── flow.js
├── utils/
│   └── mailer.js
├── agenda.js
├── app.js
└── server.js
```

### Frontend

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── api.tsx
│   │   ├── auth.tsx
│   │   ├── email.tsx
│   │   └── flow.tsx
│   ├── components/
│   │   ├── FlowEditor/
│   │   │   └── FlowEditor.tsx
│   │   └── nodes/
│   │       ├── ColdEmailNode.tsx
│   │       ├── LeadSourceNode.tsx
│   │       └── WaitDelayNode.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── index.html
```

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Log in an existing user

### Email

- `POST /api/email/schedule-email`: Schedule a single email
- `POST /api/email/test`: Send a test email

### Flow

- `POST /api/flow/schedule-flow`: Schedule an email sequence based on a flowchart
- `GET /api/flow/scheduled`: Get all scheduled emails for the current user
- `DELETE /api/flow/scheduled/:id`: Cancel a scheduled email

## Testing

The application includes unit tests for both frontend and backend components.

### Running Backend Tests

```
cd backend
npm test
```

### Running Frontend Tests

```
cd frontend
npm test
```

## Deployment

The application is deployed on:

- Backend: [Render](https://email-sequence-backend.onrender.com)
- Frontend: [Vercel](https://email-sequence-app.vercel.app)

## Future Improvements

- Add more node types (e.g., Condition, A/B Testing)
- Implement email templates
- Add analytics for email open rates and click-through rates
- Support for attachments and HTML email templates
- Implement drag-and-drop for node creation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Flow](https://reactflow.dev/) for the flowchart interface
- [Agenda.js](https://github.com/agenda/agenda) for job scheduling
- [Nodemailer](https://nodemailer.com/) for email sending

---

This project was created as part of an assignment for FutureBlink.
