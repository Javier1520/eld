# ELD (Electronic Logging Device) API

A Django REST Framework API for managing trips and log entries for electronic logging devices.

## Setup

1. Make sure you have Python 3.8+ and pipenv installed
2. Clone this repository
3. Install dependencies:
   ```
   pipenv install
   ```
4. Activate the virtual environment:
   ```
   pipenv shell
   ```
5. Run migrations:
   ```
   python manage.py migrate
   ```
6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
7. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

- `/api/trips/` - CRUD operations for trips
- `/api/logs/` - CRUD operations for log entries
- `/admin/` - Admin interface
- `/api-auth/` - Authentication endpoints

## Models

### Trip

- User (ForeignKey to User)
- Current location
- Pickup location
- Dropoff location
- Current cycle used (hours)
- Created at (timestamp)

### LogEntry

- Trip (ForeignKey to Trip)
- Date
- Total miles
- Truck number
- Carrier name
- Main office address
- Driver signature
- Co-driver name (optional)
- Time base
- Remarks (JSON field)
- Total hours (calculated from remarks)
- Shipping document (optional)

## Authentication

The API uses Django REST Framework's built-in authentication. You need to be authenticated to access the API endpoints.

## Validation

The validation logic for calculating total hours from remarks has been moved from the model to the serializer. The serializer validates:

- Remarks must be a list
- Each remark must have 'hour_start' and 'hour_finish'
- Start and finish times must be valid ISO format datetimes
- Finish time must be after start time
