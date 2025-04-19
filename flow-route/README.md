# Flow Route

A modern route planning application that helps users plan trips, discover points of interest, and share their journeys.

## Features

- User authentication and profile management
- Route planning with OSRM and Photon
- Interactive maps with Google Maps integration
- Trip sharing and collaboration
- Points of interest discovery
- Trip history and favorites
- Calendar integration
- Offline support
- Accessibility features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/[your-username]/flow-route.git
   cd flow-route
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB Connection String
   DATABASE_URL="your-mongodb-connection-string"
   
   # Google Maps API Key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   
   # JWT Secret
   JWT_SECRET="your-jwt-secret"
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

This project uses:
- Next.js for the frontend and API routes
- MongoDB for data storage
- Google Maps API for maps
- OSRM for route planning
- Tailwind CSS for styling

## Contributors

This project is developed by a team of dedicated developers. See [CONTRIBUTORS.md](CONTRIBUTORS.md) for details.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
