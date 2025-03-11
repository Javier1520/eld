# Trucking Log Frontend

A React-based frontend application for managing trucking logs and trips.

## Features

- User authentication (login, register, logout)
- Dashboard with overview of trips and logs
- Create, view, edit, and delete trips
- Create, view, edit, and delete log entries with remarks
- Responsive design for mobile and desktop

## Technologies Used

- React 18
- TypeScript
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- shadcn/ui for UI components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd trucking-log-frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure the API endpoint
   Edit the `src/services/api.ts` file to point to your backend API.

4. Start the development server

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

This frontend is designed to work with the Trucking Log API. The API endpoints used include:

- Authentication: `/api/auth/token/login/`, `/api/auth/token/logout/`
- Trips: `/api/trips`
- Logs: `/api/logs`

## Project Structure

- `src/components`: Reusable UI components
- `src/contexts`: React context providers
- `src/hooks`: Custom React hooks
- `src/pages`: Page components
- `src/services`: API service functions
- `src/types`: TypeScript type definitions
- `src/lib`: Utility functions

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
