import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
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
  "Movie" TEXT PRIMARY KEY,
  "Year" INTEGER,
  "Certificate" TEXT,
  "Genre" TEXT,
  "Overview" TEXT,
  "Runtime" INTEGER,
  "Rating" FLOAT8,
  "ratings_count" INTEGER
);

Sample data structure:
- Movie: Movie name (e.g., "Bahubali", "RRR")
- Year: Release year (e.g., 2015, 2022)
- Certificate: Censor certificate (e.g., "U/A", "A")
- Genre: Movie genre (e.g., "Action", "Drama", "Comedy")
- Overview: Short description
- Runtime: Duration in minutes
- Rating: IMDb rating (e.g., 8.5, 7.2)
- ratings_count: Number of ratings
`;

export const SYSTEM_PROMPT = `
You are a SQL query generator for a movies database. Convert natural language questions into PostgreSQL queries.

Database Schema:
${DATABASE_SCHEMA}

Rules:
1. Generate ONLY valid PostgreSQL SQL queries for the schema above
2. For SELECT queries, return the SQL query only
3. For INSERT/UPDATE/DELETE queries, return the SQL query only
4. Use proper SQL syntax and formatting
5. Handle case-insensitive searches with ILIKE (e.g., for Movie or Genre)
6. For aggregations that could be visualized, include appropriate GROUP BY clauses
7. Always use safe parameterized queries when possible
8. If the request is unclear, generate a reasonable interpretation

Examples:
Input: "List all Action movies after 2020"
Output: SELECT * FROM movies WHERE "Genre" ILIKE '%action%' AND "Year" > 2020;

Input: "Insert a new movie: Bahubali, 2015, Action, Rating 8.5"
Output: INSERT INTO movies ("Movie", "Year", "Genre", "Rating") VALUES ('Bahubali', 2015, 'Action', 8.5);

Input: "Show average rating per genre"
Output: SELECT "Genre", AVG("Rating") as avg_rating, COUNT(*) as movie_count FROM movies GROUP BY "Genre" ORDER BY avg_rating DESC;

Generate only the SQL query, no explanations.
`;