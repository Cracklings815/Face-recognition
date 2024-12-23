import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import fs from 'fs';
import cors from 'cors';

// Extract Pool from pg
const { Pool } = pkg;

// Setup __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Configure PostgreSQL connection
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

// Configure multer for file upload
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
    cb(null, `${fullName}${ext}`);
  }
});

const upload = multer({ storage: storage });

app.post('/api/register', upload.single('profileImage'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const registrationResult = await client.query(
      `INSERT INTO REGISTRATION (
        REGIS_FIRST_NAME, REGIS_LAST_NAME, REGIS_MIDDLE_NAME, REGIS_DATE_OF_BIRTH,
        REGIS_NATIONALITY, REGIS_MARITAL_STATUS, REGIS_PLACE_OF_BIRTH, REGIS_SEX,
        REGIS_GENDER, REGIS_RELIGION, REGIS_ADDRESS, REGIS_PHONE_NUMBER,
        REGIS_EMAIL, REGIS_OCCUPATION, REGIS_BLOOD_TYPE, REGIS_PROFILE_IMAGE_PATH
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
        req.file ? req.file.path : null
      ]
    );

    const registrationId = registrationResult.rows[0].id;

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
    res.json({ success: true, message: 'Registration completed successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, message: 'Registration failed' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



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