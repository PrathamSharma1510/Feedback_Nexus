# Feedback Nexus

Welcome to **Feedback Nexus**, a platform revolutionizing feedback collection. Perfect for educators and professionals, our tool enables anonymous feedback, ensuring honest and constructive responses. With personalized dashboards and unique sharing links, Feedback Nexus offers a seamless, secure way to engage with your audience, enhancing growth and learning.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

### Elevate Your Experience: Explore Our Features

- **User-Friendly Interface:** A sleek, intuitive design that makes navigation a breeze.
- **Unique Feedback Links:** Generate personalized URLs to share with your audience, ensuring a private and tailored experience.
- **Real-time Updates:** Receive feedback instantly and stay informed with live updates.
- **Dynamic Visual Effects:** Beautiful animated backgrounds and UI elements that enhance the user experience.
- **Smooth Transitions:** Polished animations and state transitions throughout the application.

### Personalized Dashboard

- **Confidentiality Ensured:** Gather honest opinions with complete anonymity for feedback providers.
- **Customizable Surveys:** Create tailored questionnaires to suit various domains, from education to corporate training.
- **Multi-Domain Utility:** Perfect for educators, HR professionals, event organizers, and more.
- **Message Management:** Easily toggle message acceptance, copy sharing links, and manage feedback messages.
- **Analytics Overview:** Track total messages, today's messages, and active feedback pages at a glance.

### Anonymous Feedback

- **Versatile Feedback Collection:** Ideal for teachers seeking class feedback, professors conducting end-of-course surveys, and professionals gathering client insights.
- **Industry Adaptability:** Perfect for HR evaluations, customer satisfaction surveys, and event feedback.
- **Flexible Reporting:** Generate insightful reports and visualizations tailored to various fields and needs.
- **Message Control:** Toggle message acceptance with smooth animations and visual feedback.
- **One-Click Sharing:** Copy feedback page links with a single click for easy distribution.

### AI-Powered Features

- **AI Message Assistant:** Generate, improve, or get reply suggestions for your messages using artificial intelligence.
- **Customizable Message Styles:** Choose from different tones (formal, casual, friendly, professional), lengths, and styles.
- **AI-Generated Insights:** Get AI-powered analysis of your feedback data to identify trends and patterns.
- **Smart Recommendations:** Receive intelligent suggestions based on your feedback history and preferences.

### Advanced Analytics

- **Comprehensive Data Visualization:** View your feedback data through various chart types including bar charts, line charts, and pie charts.
- **Time-Based Analysis:** Track message trends over time with hourly, daily, and monthly breakdowns.
- **Page Performance Metrics:** Compare the performance of different feedback pages.
- **Interactive Dashboards:** Explore your data with interactive charts and filters.
- **Export Capabilities:** Download your analytics data for further analysis or reporting.

## Tech Stack

Feedback Nexus is developed using the latest technologies to ensure a robust and scalable platform:

- **Frontend:** Next.js, Tailwind CSS, ShadCN, and Aceternity UI
- **Backend:** Node.js, Next.js API Routes
- **Database:** MongoDB with Aggregation Pipeline
- **Validation:** ZOD for input validation
- **Authentication:** NextAuth for authentication with cookies and session management
- **Email Verification:** Resend for email verification code
- **Deployment:** Netlify for seamless Next.js deployment
- **UI Components:** Framer Motion for animations, Headless UI for accessible components
- **Visual Effects:** Custom animated backgrounds with Spotlight, Boxes, and gradient effects
- **Data Visualization:** Recharts for interactive charts and data visualization
- **AI Integration:** OpenAI API for AI-powered message generation and insights

## Installation

### Prerequisites

- Node.js (>=14.x)
- npm or Yarn
- MongoDB instance
- Resend account for email verification
- OpenAI API key (for AI features)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/PrathamSharma1510/Feedback_Nexus.
   cd feedback-nexus
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables**

   Create a `.env.local` file in the root directory and add your environment variables:

   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

1. **Sign Up**: Create an account using your email and verify it through the link sent via Resend.
2. **Create Surveys**: Use the dashboard to create customizable surveys tailored to your needs.
3. **Share Links**: Generate unique feedback links to share with your audience.
4. **Manage Messages**: Toggle message acceptance, copy sharing links, and manage feedback messages.
5. **View Analytics**: Track your feedback metrics and engagement over time.
6. **Use AI Assistant**: Generate, improve, or get reply suggestions for your messages.
7. **Analyze Insights**: Get AI-powered analysis of your feedback data to identify trends and patterns.

## API Endpoints

Here's a quick overview of some available API endpoints:

### Auth

- **POST `/api/auth/sign-up`**: Register a new user.
- **POST `/api/auth/verifycode`**: Verify email using the code sent.
- **GET `/api/auth/verifyusername`**: Verify the uniqueness of a username.

### Messages

- **POST `/api/send-message`**: Send a feedback message.
- **GET `/api/getmessages`**: Retrieve all feedback messages for the authenticated user.
- **POST `/api/delete-message`**: Delete a specific message by ID.
- **POST `/api/acceptmessage`**: Accept or process a feedback message based on user preferences.
- **POST `/api/feedback-pages/[slug]/toggle-messages`**: Toggle message acceptance for a specific feedback page.

### User Management

- **GET `/api/user-messages`**: Retrieve all messages for the authenticated user, sorted by creation date.
- **GET `/api/feedback-pages`**: Retrieve all feedback pages for the authenticated user.
- **GET `/api/feedback-pages/[slug]`**: Retrieve details for a specific feedback page.
- **GET `/api/feedback-pages/[slug]/messages`**: Retrieve all messages for a specific feedback page.

### AI Services

- **POST `/api/ai/generate`**: Generate AI-powered content based on user prompts.
- **POST `/api/ai/improve`**: Improve existing content using AI.
- **POST `/api/ai/insights`**: Generate AI-powered insights from feedback data.

## Contributing

We welcome contributions from the community! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

## Contact

For any issues or inquiries, please contact:

**Pratham Sharma**  
Email: [sharmapratham@ufl.edu](mailto:sharmapratham@ufl.edu)
