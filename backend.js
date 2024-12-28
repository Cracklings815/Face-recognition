// backend.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import fs from 'fs';
import cors from 'cors';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration
const corsSite = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsSite));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// PostgreSQL Configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'IHCIDB',
  password: '123',
  port: 5432,
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const firstName = req.body.firstName || '';
    const middleName = req.body.middleName || '';
    const lastName = req.body.lastName || '';
    const fullName = `${firstName}_${middleName}_${lastName}`.replace(/\s+/g, '_').toLowerCase();
    cb(null, `${fullName}_${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

// Improved face descriptor distance calculation
function normalizedEuclideanDistance(descriptor1, descriptor2) {
  try {
    console.log('Input descriptors:', {
      desc1Length: descriptor1.length,
      desc2Length: descriptor2.length,
      desc1Sample: descriptor1.slice(0, 3),
      desc2Sample: descriptor2.slice(0, 3)
    });

    // L2 normalization of descriptors
    const norm1 = Math.sqrt(descriptor1.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(descriptor2.reduce((sum, val) => sum + val * val, 0));
    
    console.log('Norms:', { norm1, norm2 });

    if (norm1 === 0 || norm2 === 0) {
      console.error('Zero norm detected!');
      return Infinity;
    }

    const normalizedDesc1 = descriptor1.map(val => val / norm1);
    const normalizedDesc2 = descriptor2.map(val => val / norm2);

    const distance = Math.sqrt(
      normalizedDesc1.reduce((sum, val, idx) => {
        const diff = val - normalizedDesc2[idx];
        return sum + diff * diff;
      }, 0)
    );

    console.log('Calculated distance:', distance);
    return distance;

  } catch (error) {
    console.error('Error in distance calculation:', error);
    console.error('Descriptor1:', descriptor1);
    console.error('Descriptor2:', descriptor2);
    return Infinity;
  }
}




// Registration endpoint
app.post('/api/register', upload.single('profileImage'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Parse and validate face descriptor
    let faceDescriptor;
    try {
      const descriptorString = req.body.faceDescriptor;
      
      // Log the raw input for debugging
      console.log('Raw descriptor input:', descriptorString);
      
      // Validate input type
      if (typeof descriptorString !== 'string') {
        throw new Error('Face descriptor must be a string');
      }
      
      // Parse the JSON string
      const parsedDescriptor = JSON.parse(descriptorString);
      
      // Validate array structure
      if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
        throw new Error(`Invalid face descriptor format: Expected array of length 128, got ${parsedDescriptor?.length}`);
      }
      
      // Validate numeric values
      if (!parsedDescriptor.every(val => typeof val === 'number' && !isNaN(val))) {
        throw new Error('Face descriptor must contain only valid numbers');
      }
      
      faceDescriptor = parsedDescriptor;
      
      // Log the parsed descriptor for verification
      console.log('Parsed descriptor:', {
        length: faceDescriptor.length,
        sample: faceDescriptor.slice(0, 5)
      });
      
    } catch (error) {
      console.error('Face descriptor parsing error:', error);
      console.error('Raw descriptor data:', req.body.faceDescriptor);
      throw new Error(`Failed to parse face descriptor: ${error.message}`);
    }

    // Insert into database with validated descriptor
    const registrationResult = await client.query(
      `INSERT INTO REGISTRATION (
        REGIS_FIRST_NAME, REGIS_LAST_NAME, REGIS_MIDDLE_NAME, REGIS_DATE_OF_BIRTH,
        REGIS_NATIONALITY, REGIS_MARITAL_STATUS, REGIS_PLACE_OF_BIRTH, REGIS_SEX,
        REGIS_GENDER, REGIS_RELIGION, REGIS_ADDRESS, REGIS_PHONE_NUMBER,
        REGIS_EMAIL, REGIS_OCCUPATION, REGIS_BLOOD_TYPE, REGIS_PROFILE_IMAGE_PATH,
        face_descriptor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING REGIS_ID`,
      [
        req.body.firstName,
        req.body.lastName,
        req.body.middleName,
        req.body.dateOfBirth,
        req.body.nationality,
        req.body.maritalStatus,
        req.body.placeOfBirth,
        req.body.sex,
        req.body.gender,
        req.body.religion,
        req.body.address,
        req.body.phoneNumber,
        req.body.email,
        req.body.occupation,
        req.body.bloodType,
        req.file ? req.file.path : null,
        JSON.stringify(faceDescriptor) // Use the validated descriptor
      ]
    );

    // Rest of the registration code...
    const registrationId = registrationResult.rows[0].regis_id;

    // Insert emergency contact
    await client.query(
      `INSERT INTO EMERGENCY_CONTACT (
        REGIS_ID, EMER_NAME, EMER_RELATIONSHIP, EMER_PHONE_NUMBER
      ) VALUES ($1, $2, $3, $4)`,
      [
        registrationId,
        req.body.emergencyName,
        req.body.emergencyRelationship,
        req.body.emergencyPhone
      ]
    );

    await client.query('COMMIT');
    res.json({ 
      success: true, 
      message: 'Registration completed successfully',
      registrationId: registrationId
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during registration:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: err.message,
      details: {
        receivedDescriptor: req.body.faceDescriptor ? {
          type: typeof req.body.faceDescriptor,
          length: Array.isArray(req.body.faceDescriptor) ? req.body.faceDescriptor.length : null
        } : null
      }
    });
  } finally {
    client.release();
  }
});

// Face Recognition endpoint
function calculateFaceSimilarity(desc1, desc2) {
  if (!Array.isArray(desc1) || !Array.isArray(desc2) || desc1.length !== desc2.length) {
    console.error('Invalid descriptor format or length mismatch');
    return 0;
  }

  try {
    // L2 normalization of descriptors
    const normalize = (desc) => {
      const magnitude = Math.sqrt(desc.reduce((sum, val) => sum + val * val, 0));
      return magnitude === 0 ? desc : desc.map(val => val / magnitude);
    };

    const normalizedDesc1 = normalize(desc1);
    const normalizedDesc2 = normalize(desc2);

    // Calculate both Euclidean distance and cosine similarity
    const euclideanDistance = Math.sqrt(
      normalizedDesc1.reduce((sum, val, idx) => {
        const diff = val - normalizedDesc2[idx];
        return sum + diff * diff;
      }, 0)
    );

    const cosineSimilarity = normalizedDesc1.reduce((sum, val, idx) => 
      sum + val * normalizedDesc2[idx], 0);

    // Combine both metrics for better accuracy
    const combinedScore = (1 - euclideanDistance + cosineSimilarity) / 2;
    return combinedScore;
  } catch (error) {
    console.error('Error in similarity calculation:', error);
    return 0;
  }
}

// Improved recognition endpoint
app.post('/api/recognize', async (req, res) => {
  const { faceDescriptor, detectionScore } = req.body;

  console.log('Incoming descriptor:', {
    length: faceDescriptor?.length,
    sample: faceDescriptor?.slice(0, 5)
  });

  if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
    return res.status(400).json({ 
      error: 'Invalid face descriptor',
      details: `Expected array of length 128, got ${faceDescriptor?.length}`
    });
  }

  try {
    // Get all registrations with face descriptors
    const result = await pool.query(
      'SELECT REGIS_ID, FACE_DESCRIPTOR, REGIS_FIRST_NAME, REGIS_LAST_NAME FROM REGISTRATION WHERE FACE_DESCRIPTOR IS NOT NULL'
    );

    console.log('Database records found:', result.rows.length);

    
    
    let matches = [];

    // Calculate similarity scores for all registered faces
    for (const row of result.rows) {
      try {
        const storedDescriptor = JSON.parse(row.face_descriptor);
        
        if (!Array.isArray(storedDescriptor) || storedDescriptor.length !== 128) {
          console.warn(`Invalid stored descriptor for user ${row.regis_id}`);
          continue;
        }

      
        const similarity = calculateFaceSimilarity(faceDescriptor, storedDescriptor);
        
        matches.push({
          regisId: row.regis_id,
          similarity,
          name: `${row.regis_first_name} ${row.regis_last_name}`
        });

      } catch (error) {
        console.error(`Error processing user ${row.regis_id}:`, error);
        continue;
      }

    }
    console.log('Processed descriptors:', matches.map(m => ({
      id: m.regisId,
      similarity: m.similarity
    })));
    
    // Sort matches by similarity score
    matches.sort((a, b) => b.similarity - a.similarity);

    // Dynamic threshold based on multiple factors
    const baseThreshold = 0.65; // Increased base threshold
    const detectionScoreWeight = 0.1;
    const finalThreshold = baseThreshold - (detectionScoreWeight * (1 - detectionScore));

    // Log recognition metrics for debugging
    console.log('Recognition metrics:', {
      topMatches: matches.slice(0, 3),
      finalThreshold,

      detectionScore,
      totalComparisons: matches.length
    });

    const bestMatch = matches[0];

    if (bestMatch && bestMatch.similarity >= finalThreshold) {
      const userData = await pool.query(
        `SELECT r.*, ec.EMER_NAME, ec.EMER_RELATIONSHIP, ec.EMER_PHONE_NUMBER 
         FROM REGISTRATION r 
         LEFT JOIN EMERGENCY_CONTACT ec ON r.REGIS_ID = ec.REGIS_ID 
         WHERE r.REGIS_ID = $1`,
        [bestMatch.regisId]
      );
      
      res.json({
        recognized: true,
        userData: userData.rows[0],
        confidence: bestMatch.similarity,
        threshold: finalThreshold,
        matchDetails: {
          name: bestMatch.name,
          similarity: bestMatch.similarity
        }
      });
    } else {
      res.json({
        recognized: false,
        confidence: bestMatch?.similarity || 0,
        threshold: finalThreshold,
        message: 'No match found above confidence threshold'
      });
    }
  } catch (err) {
    console.error('Error in face recognition:', err);
    res.status(500).json({ 
      error: 'Face recognition failed',
      details: err.message
    });
  }
});

// Get user profile endpoint
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT r.*, ec.EMER_NAME, ec.EMER_RELATIONSHIP, ec.EMER_PHONE_NUMBER 
       FROM REGISTRATION r 
       LEFT JOIN EMERGENCY_CONTACT ec ON r.REGIS_ID = ec.REGIS_ID 
       WHERE r.REGIS_ID = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile endpoint
app.put('/api/user/:id', upload.single('profileImage'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (req.file) {
      updates.REGIS_PROFILE_IMAGE_PATH = req.file.path;
    }

    // Update registration table
    const registrationResult = await client.query(
      `UPDATE REGISTRATION 
       SET 
         REGIS_FIRST_NAME = COALESCE($1, REGIS_FIRST_NAME),
         REGIS_LAST_NAME = COALESCE($2, REGIS_LAST_NAME),
         REGIS_MIDDLE_NAME = COALESCE($3, REGIS_MIDDLE_NAME),
         REGIS_PROFILE_IMAGE_PATH = COALESCE($4, REGIS_PROFILE_IMAGE_PATH),
         face_descriptor = COALESCE($5, face_descriptor)
       WHERE REGIS_ID = $6
       RETURNING *`,
      [
        updates.firstName,
        updates.lastName,
        updates.middleName,
        updates.REGIS_PROFILE_IMAGE_PATH,
        updates.faceDescriptor ? JSON.stringify(updates.faceDescriptor) : null,
        id
      ]
    );

    // Update emergency contact if provided
    if (updates.emergencyName || updates.emergencyRelationship || updates.emergencyPhone) {
      await client.query(
        `UPDATE EMERGENCY_CONTACT 
         SET 
           EMER_NAME = COALESCE($1, EMER_NAME),
           EMER_RELATIONSHIP = COALESCE($2, EMER_RELATIONSHIP),
           EMER_PHONE_NUMBER = COALESCE($3, EMER_PHONE_NUMBER)
         WHERE REGIS_ID = $4`,
        [
          updates.emergencyName,
          updates.emergencyRelationship,
          updates.emergencyPhone,
          id
        ]
      );
    }

    await client.query('COMMIT');
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: registrationResult.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating profile:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile',
      error: err.message
    });
  } finally {
    client.release();
  }
});

// Serve static files
app.use('/models', express.static(path.join(__dirname, 'public', 'models')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;


/*
postresql database..

CREATE TABLE REGISTRATION (
    REGIS_ID SERIAL PRIMARY KEY,
    REGIS_FIRST_NAME VARCHAR(100) NOT NULL,
    REGIS_LAST_NAME VARCHAR(100) NOT NULL,
    REGIS_MIDDLE_NAME VARCHAR(100),
    REGIS_DATE_OF_BIRTH DATE NOT NULL,
    REGIS_NATIONALITY VARCHAR(100) NOT NULL,
    REGIS_MARITAL_STATUS VARCHAR(50) NOT NULL,
    REGIS_PLACE_OF_BIRTH VARCHAR(100) NOT NULL,
    REGIS_SEX VARCHAR(20) NOT NULL,
    REGIS_GENDER VARCHAR(50) NOT NULL,
    REGIS_RELIGION VARCHAR(100) NOT NULL,
    REGIS_ADDRESS TEXT NOT NULL,
    REGIS_PHONE_NUMBER VARCHAR(50) NOT NULL,
    REGIS_EMAIL VARCHAR(100) NOT NULL,
    REGIS_OCCUPATION VARCHAR(100) NOT NULL,
    REGIS_BLOOD_TYPE VARCHAR(5) NOT NULL,
    REGIS_PROFILE_IMAGE_PATH VARCHAR(255),
    REGIS_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    face_descriptor
);

CREATE TABLE EMERGENCY_CONTACT (
        EMER_ID SERIAL PRIMARY KEY,
        REGIS_ID INTEGER,
        EMER_NAME VARCHAR(200) NOT NULL,
        EMER_RELATIONSHIP VARCHAR(100) NOT NULL,
        EMER_PHONE_NUMBER VARCHAR(50) NOT NULL,
		FOREIGN KEY (REGIS_ID) REFERENCES REGISTRATION(REGIS_ID) ON UPDATE CASCADE ON DELETE CASCADE
      );

*/