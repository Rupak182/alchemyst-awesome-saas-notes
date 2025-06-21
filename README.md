# Exam Project

A full-stack application with a React client and Express TypeScript server for processing images and generating PDFs.

## Project Structure

```
exam/
├── client/          # React frontend with Vite and TailwindCSS
├── server/          # Express TypeScript backend with image processing
└── README.md        # This file
```

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**
- **npm** or **yarn** package manager

## Environment Setup

### Server Environment Variables

The server requires a Google API key for functionality. You need to create a `.env` file in the `server` directory.

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Create a `.env` file with the following content:
   ```properties
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=3000
   ```

3. Replace `your_google_api_key_here` with your actual Google API key.

### Getting a Google API Key (Free)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs for your project
4. Go to "Credentials" and create a new API key
5. Copy the API key and paste it in your `.env` file

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd client
npm install
```

## Running the Application

### Run Both Server and Client Simultaneously

**Terminal 1 - Start the Server:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:3000`

**Terminal 2 - Start the Client:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173` (or another available port)

## API Endpoint

### Server Endpoint

- **POST `/upload`** - Upload an image file for processing
  - Accepts multipart form data with an image file
  - Returns processed PDF output

## Technology Stack

### Frontend (Client)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework

### Backend (Server)
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Node.js** - Runtime environment
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **LangChain** - AI/ML framework integration
- **md-to-pdf** - Markdown to PDF conversion

## Development

### Server Development
- The server uses `nodemon` for hot reloading during development
- TypeScript files are compiled on-the-fly using `ts-node`
- Source files are located in `server/src/`

### Client Development
- The client uses Vite's built-in hot module replacement
- Components are written in TypeScript with React
- Styling is done with TailwindCSS
- Source files are located in `client/src/`

## Build for Production

### Building the Client
```bash
cd client
npm run build
```
This creates an optimized production build in the `client/dist/` directory.

### Building the Server
```bash
cd server
npm run start:build
```
This compiles TypeScript files to JavaScript in the `server/build/` directory.

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 3000 or 5173 is already in use, the applications will automatically try to use the next available port.

2. **Environment variables not loaded**: Make sure your `.env` file is in the `server` directory and contains the correct Google API key.

3. **CORS errors**: The server is configured to allow cross-origin requests, but if you encounter CORS issues, check that both applications are running on their expected ports.

4. **Module not found errors**: Make sure you've run `npm install` in both the `client` and `server` directories.

### Logs and Debugging

- Server logs will appear in the terminal where you ran `npm run dev`
- Client logs and errors can be viewed in the browser's developer console
- Check the Network tab in browser dev tools for API request/response details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## Credits

Thanks to the Alchemyst assignment for motivating me to create this project