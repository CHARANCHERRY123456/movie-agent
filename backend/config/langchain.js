import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  }
});

// Database schema for context
export const DATABASE_SCHEMA = `
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INTEGER,
  genre VARCHAR(100),
  rating DECIMAL(3,1),
  language VARCHAR(50),
  director VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Sample data structure:
- title: Movie name (e.g., "Bahubali", "RRR")
- year: Release year (e.g., 2015, 2022)
- genre: Movie genre (e.g., "Action", "Drama", "Comedy")
- rating: IMDb rating (e.g., 8.5, 7.2)
- language: Movie language (e.g., "Telugu", "Hindi", "English")
- director: Director name
`;

export const SYSTEM_PROMPT = `
You are a SQL query generator for a movies database. Convert natural language questions into PostgreSQL queries.

Database Schema:
${DATABASE_SCHEMA}

Rules:
1. Generate ONLY valid PostgreSQL SQL queries
2. For SELECT queries, return the SQL query only
3. For INSERT/UPDATE/DELETE queries, return the SQL query only
4. Use proper SQL syntax and formatting
5. Handle case-insensitive searches with ILIKE
6. For aggregations that could be visualized, include appropriate GROUP BY clauses
7. Always use safe parameterized queries when possible
8. If the request is unclear, generate a reasonable interpretation

Examples:
Input: "List all Telugu movies after 2020"
Output: SELECT * FROM movies WHERE language ILIKE '%telugu%' AND year > 2020;

Input: "Insert a new movie: Bahubali, 2015, Action, Rating 8.5"
Output: INSERT INTO movies (title, year, genre, rating) VALUES ('Bahubali', 2015, 'Action', 8.5);

Input: "Show average rating per genre"
Output: SELECT genre, AVG(rating) as avg_rating, COUNT(*) as movie_count FROM movies GROUP BY genre ORDER BY avg_rating DESC;

Generate only the SQL query, no explanations.
`;