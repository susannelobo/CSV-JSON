# KelpAssignment

- Kelp Coding Challenge: CSV to JSON API

This is a Node.js (Express) application built for the Kelp coding challenge. It provides an API endpoint that reads a CSV file, parses it, uploads the data to a PostgreSQL database, and then prints an age distribution report to the console.

# Features

1. Custom CSV Parser: Reads and parses large CSV files (50,000+ rows) line-by-line using Node.js Streams, without using any third-party CSV libraries.
2. Nested JSON Conversion: Correctly handles dot-notation headers (e.g., `name.firstName`) to create nested JSON objects.
3. Batch Database Insertion: Uses efficient batch-inserting to upload data to PostgreSQL for high performance.
4. Data Mapping: Maps mandatory fields (`name`, `age`, `address`) to specific columns and all other fields to a `additional_info` JSONB column.
5. Age Distribution Report: Automatically calculates and prints an age distribution report to the console after the upload is complete.

# Requirements

[Node.js](https://nodejs.org/)
[PostgreSQL](https://www.postgresql.org/)

A test `data.csv` file (example provided in the repository).

# Setup and Installation

1. Clone the Repository
2. Install Dependencies - npm install
3. Set Up the Database
   CREATE TABLE public.users (
   id serial PRIMARY KEY,
   "name" varchar NOT NULL,
   age int4 NOT NULL,
   address jsonb NULL,
   additional_info jsonb NULL
   );
4. Configure Environment Variables
   cp example.env .env
5. Edit the new .env file with your specific database connection string:
    .env file
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DB_NAME
CSV_FILE_PATH=./data.csv
6. Running the Application
  1. node index.js
  2. Run the following curl command to trigger the /upload endpoint:
   curl -X POST http://localhost:3000/upload

# Final log 
Upload request received. Starting CSV processing...

Successfully inserted batch of 10 records.

All data has been successfully uploaded to the database.


Calculating Age Distribution:

<img width="407" height="222" alt="image" src="https://github.com/user-attachments/assets/c900bf9b-f36e-4f91-97f0-1e2bb4d3d9a8" />

