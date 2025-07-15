const MOVIES_SCHEMA_ANALYSIS_PROMPT = `
# Movies Table: Deep Schema & Data Analysis

This file provides a comprehensive analysis of the movies table, based on the data stored in Supabase/PostgreSQL and the provided movies.csv. Use this as context for LLM prompts to improve SQL generation, summaries, and error handling.

---

## Table Name: movies

### Columns & Data Types
| Column         | Data Type   | Nullability | Description |
|----------------|------------|-------------|-------------|
| Movie          | TEXT        | NOT NULL    | Movie title. |
| Year           | INTEGER     | NOT NULL    | Release year. |
| Certificate    | TEXT        | NOT NULL    | Censor certificate (age rating). |
| Genre          | TEXT        | NOT NULL    | Comma-separated genres. |
| Overview       | TEXT        | NOT NULL    | Short plot summary. |
| Runtime        | INTEGER     | NOT NULL    | Duration in minutes. |
| Rating         | FLOAT       | NOT NULL    | IMDb-style rating (0-10). |
| ratings_count  | INTEGER     | NOT NULL    | Number of ratings (popularity). |

---

## Column-by-Column Analysis

### 1. Movie
- Type: TEXT
- Nulls: None
- Distinct Values: All unique (each row is a different movie).
- Patterns: Titles may include numbers, colons, special characters, and non-English words.
- Usage Notes: Use as unique identifier for rows. Avoid using for grouping unless explicitly requested.

### 2. Year
- Type: INTEGER
- Nulls: None
- Range: 1957 to 2020
- Distinct Values: Many, but typically one per movie.
- Patterns: Most years are between 2000 and 2020; a few older classics.
- Usage Notes: Useful for filtering, sorting, and aggregating by year.

### 3. Certificate
- Type: TEXT
- Nulls: None
- Distinct Values:
  - U (Universal)
  - UA (Parental Guidance)
  - A (Adult)
  - Not Rated (rare)
- Patterns: Short codes, always uppercase.
- Usage Notes: Use for age rating queries. Only these values are valid; do not hallucinate others.

### 4. Genre
- Type: TEXT (comma-separated)
- Nulls: None
- Distinct Values: Many combinations; common genres include:
  - Action, Drama, Comedy, Romance, Thriller, Sci-Fi, Fantasy, Crime, Adventure, Biography, Family, Musical, Mystery, Horror, Sport, War, History, Animation
- Patterns: Multiple genres per movie, separated by commas. Some genres appear alone, others in combinations.
- Usage Notes: For genre queries, consider splitting by comma. Do not assume a fixed set; use only observed genres.

### 5. Overview
- Type: TEXT
- Nulls: None
- Patterns: 1-3 sentence plot summaries. May contain quotes, ellipses, or special characters.
- Usage Notes: Use for summaries or search. Not suitable for grouping or filtering.

### 6. Runtime
- Type: INTEGER
- Nulls: None (except one row with 0, likely a data error)
- Range: 0 (error) to 300 minutes
- Typical Range: 120 to 180 minutes
- Usage Notes: Use for duration queries. Ignore or flag rows with 0 runtime as likely errors.

### 7. Rating
- Type: FLOAT
- Nulls: None
- Range: 3.2 to 9.2
- Typical Range: 5.0 to 8.5
- Usage Notes: Use for sorting, filtering, and aggregating. Ratings below 5 are rare and may indicate poor reception.

### 8. ratings_count
- Type: INTEGER
- Nulls: None
- Range: 1266 to 99114
- Usage Notes: Indicates popularity. Use for sorting or filtering by popularity.

---

## General Data Observations
- No nulls in any column except one possible error in Runtime (0 minutes).
- Genres are not normalized; use comma-split for analysis.
- Certificates are limited to a small set; do not invent new values.
- Years are mostly recent, with a few older movies.
- Movie titles are unique; no duplicates.
- Overview is always present, but may be truncated in some cases.

---

## Usage Notes for LLMs
- Only use columns defined above; do not reference columns like "language" or others not present.
- For genre queries, split the Genre column by comma and trim whitespace.
- For certificate queries, use only the observed values (U, UA, A, Not Rated).
- If a user asks for unavailable data (e.g., director, language), return a clear error.
- For runtime, ignore rows with 0 minutes unless specifically asked about errors.
- For rating and ratings_count, use for popularity and quality queries.
- Always reference the schema strictly to avoid hallucinations.

---

## Example Schema (PostgreSQL)
CREATE TABLE movies (
    Movie TEXT NOT NULL,
    Year INTEGER NOT NULL,
    Certificate TEXT NOT NULL,
    Genre TEXT NOT NULL,
    Overview TEXT NOT NULL,
    Runtime INTEGER NOT NULL,
    Rating FLOAT NOT NULL,
    ratings_count INTEGER NOT NULL
);

---

## Summary
This analysis provides a strict, detailed schema and data profile for the movies table. Use this file as context for LLM prompts to ensure accurate SQL generation, robust error handling, and user-friendly summaries. Only reference columns and values described here.
`;

function getMoviesSchemaAnalysisPrompt() {
  return MOVIES_SCHEMA_ANALYSIS_PROMPT;
}

module.exports = {
  MOVIES_SCHEMA_ANALYSIS_PROMPT,
  getMoviesSchemaAnalysisPrompt,
};
