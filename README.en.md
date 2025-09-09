# Fire Hydrant WebGIS

This is a WebGIS-based fire hydrant management system that combines front-end visualization with back-end data management, aiming to provide efficient fire hydrant information management and map interaction capabilities.

## Project Structure

The project is divided into two main parts:

- **fire-hydrant-frontend**: Front-end part, built with Vue.js, providing user interface and map interaction features.
- **fire-hydrant-management**: Back-end part, built with Spring Boot, providing RESTful APIs and database interaction.

## Technology Stack

- **Frontend**: Vue.js, TypeScript, Vite, Pinia, Vue Router, OpenLayers/Leaflet (map library)
- **Backend**: Spring Boot, MyBatis Plus, JWT, Maven
- **Database**: PostgreSQL/MySQL (depending on actual configuration)
- **Other Tools**: ESLint, Prettier, Husky (for code formatting and pre-commit checks)

## Functional Modules

### Frontend Features

- **Map Display**: Integrates map components to show fire hydrant locations and related information.
- **User Authentication**: Features such as login, registration, and password reset.
- **Information Management**: User information management and tabular display of fire hydrant information.
- **Dashboard**: Provides system overview and data statistics.
- **Responsive Design**: Supports access from various devices.

### Backend Features

- **User Management**: Register, login, update, and delete user information.
- **JWT Authentication**: Token-based user authentication.
- **RESTful API**: Provides standardized interfaces for the frontend to call.
- **MyBatis Plus Integration**: Simplifies database operations.
- **Cross-Origin Support**: Allows cross-origin communication between frontend and backend.

## Installation & Deployment

### Frontend Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

4. Perform type checking:
   ```bash
   pnpm lint
   ```

### Backend Installation

1. Build the project using Maven:
   ```bash
   mvn clean install
   ```

2. Start the Spring Boot application:
   ```bash
   java -jar fire-hydrant-management.jar
   ```

3. Configure database connection:
   Modify the database configuration in the `application.properties` file.

## Usage Instructions

- Access the frontend page by logging in or registering.
- View fire hydrant distribution on the map page.
- Check statistical information in the dashboard.
- Use the user management page for user information maintenance.

## Contribution Guide

Code contributions and suggestions are welcome. Please follow these steps:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License. For details, please refer to the `LICENSE` file.

---

For more information on the implementation details of specific modules, please refer to the corresponding source code files.