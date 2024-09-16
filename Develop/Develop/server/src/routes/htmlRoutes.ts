import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response } from 'express'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Define route to serve files based on query parameters
router.get('/', (req: Request, res: Response) => { 
    console.log('Request Method:', req.method);

    // Handle a query parameter to serve different files
    const fileName = req.query.file as string || 'index.html'; // Default to 'index.html' if no file is specified
    const filePath = path.join(__dirname, 'public', fileName);

    // Serve the file if it exists
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error sending file:', err); // Log errors if the file cannot be sent
            res.status(500).send('Server Error');
        }
    });
});

export default router;
