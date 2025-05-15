# Umzima v2 - Primary Healthcare System

Umzima is a simplified, accessible digital system for core Primary Health Care (PHC) operations for small clinics. This web application provides a modern, user-friendly interface that connects to OpenMRS as the backend system for all data operations.

## Features

- **User Authentication**: Secure login with role-based access control (admin, doctor, nurse)
- **Patient Management**: Registration, search, and profile viewing
- **Appointment Scheduling**: Calendar interface for booking and managing appointments
- **Clinical Documentation**: Simplified consultation forms for patient encounters
- **Patient History**: Chronological view of a patient's past visits and records
- **SMS Integration**: Automated appointment reminders (placeholder implementation)
- **Administrative Dashboard**: Overview of clinic operations with key metrics

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Backend**: OpenMRS REST API (not included in this repository)

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- OpenMRS server (for actual data operations)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/umzima-v2.git
   cd umzima-v2
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your OpenMRS server URL

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser to `http://localhost:5173`

## Project Structure

```
src/
├── components/            # Reusable UI components
│   ├── common/            # General components like Button, Card, etc.
│   └── Layout/            # Layout components (Sidebar, TopBar, etc.)
├── context/               # React Context providers
├── pages/                 # Individual page components
├── services/              # API service for OpenMRS integration
├── types/                 # TypeScript type definitions
├── App.tsx                # Main application component with routes
└── main.tsx               # Application entry point
```

## Design Principles

- **Simplicity & Ease of Use**: Designed for users with varying digital literacy
- **Accessibility**: Clear typography, good contrast, and straightforward navigation
- **Efficiency**: Streamlined workflows for common tasks
- **Modularity**: Component-based architecture for maintainability

## Color Palette

- Primary Dark Blue: `#020532` (Backgrounds, Navigation)
- Secondary Dark Blue: `#030533` (Accents, Darker UI elements)
- Primary Bright Green: `#14E323` (Buttons, CTAs, Highlights)
- Secondary Green: `#74E102` (Secondary Highlights, Icons)
- Accent Green: `#7FE201` (Subtle Highlights, Status Indicators)

## Development Notes

- This project is intended to be connected to an OpenMRS backend
- For demo purposes, mock data is used in place of actual API calls
- The SMS integration is a placeholder and would require a real SMS gateway service
- The OpenMRS API service would need to be customized for the specific OpenMRS setup

## License

This project is licensed under the MIT License - see the LICENSE file for details.