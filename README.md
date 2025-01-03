# IHCI Profiling project
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- Steps on running this system
- npms cors...
- npm install @vladmandic/face-api
- npm install react@18.x
- npm install react-dom@18.x
- npm install react-router-dom@6.x
- npm install lucide-react@0.263.1
- npm install @tailwindcss/forms
- npm install tailwindcss@3.x
- npm install postcss@8.x
- npm install autoprefixer@10.x
- npm install express@4.x
- npm install cors
- npm install pg
- npm install multer
- npm install dotenv
  
# PostreSQL
- CREATE DATABASE IHCIDB;
- CREATE TABLE REGISTRATION (
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
    REGIS_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    face_descriptor TEXT
);

CREATE TABLE EMERGENCY_CONTACT (
    EMER_ID SERIAL PRIMARY KEY,
    REGIS_ID INTEGER,
    EMER_NAME VARCHAR(200) NOT NULL,
    EMER_RELATIONSHIP VARCHAR(100) NOT NULL,
    EMER_PHONE_NUMBER VARCHAR(50) NOT NULL,
    FOREIGN KEY (REGIS_ID) REFERENCES REGISTRATION(REGIS_ID) ON UPDATE CASCADE ON DELETE CASCADE
);


- Download all of the models using the download-models.js
- node backend.js
