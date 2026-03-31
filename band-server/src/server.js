import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import os from 'os';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5003; // if variable exists, use it.
// http://localhost:5000/
// http://localhost:5003/

// Get filepath from URL of current module
const __filename = fileURLToPath(import.meta.url);
// Get directory name from the file path
const __dirname = dirname(__filename);

// // Middleware
app.use(express.json()); // expect JSON
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets/files/
// Any requests for the css files will be resolved to the public directory
app.use(express.static(path.join(__dirname, '../public'))); // tells code where to find /public/


// Serving up the HTML file from the /public direcory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use(
  cors({
    origin: ["http://localhost:5555"], // Add allowed origins here
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/posts', authMiddleware, postRoutes); // First goes to authMiddleware before the actual endpoint
app.use('/tags', authMiddleware, tagRoutes); // First goes to authMiddleware before the actual endpoint
app.use('/notifications', authMiddleware, notificationRoutes); // First goes to authMiddleware before the actual endpoint

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server has started on port ${PORT}`);

  const networkInterfaces = os.networkInterfaces()

  Object.keys(networkInterfaces).forEach((i) => {
    if (i !== 'lo') {
      console.log(`${i} - local network: ${networkInterfaces[i][0].address}:${PORT}`);
    }
  })
})

