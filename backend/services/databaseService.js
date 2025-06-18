import { pool } from '../config/database.js';

export class DatabaseService {
  async executeQuery(sql, params = []) {
    const client = await pool.connect();
    try {
      console.log('Executing SQL:', sql);
      const result = await client.query(sql, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async executeSelect(sql, params = []) {
    const result = await this.executeQuery(sql, params);
    return {
      data: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(field => ({
        name: field.name,
        dataType: field.dataTypeID
      }))
    };
  }

  async executeInsert(sql, params = []) {
    const result = await this.executeQuery(sql, params);
    return {
      success: true,
      rowCount: result.rowCount,
      insertedId: result.rows[0]?.id || null
    };
  }

  async executeUpdate(sql, params = []) {
    const result = await this.executeQuery(sql, params);
    return {
      success: true,
      rowCount: result.rowCount,
      message: `Updated ${result.rowCount} row(s)`
    };
  }

  async executeDelete(sql, params = []) {
    const result = await this.executeQuery(sql, params);
    return {
      success: true,
      rowCount: result.rowCount,
      message: `Deleted ${result.rowCount} row(s)`
    };
  }

  async initializeDatabase() {
    try {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS movies (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          year INTEGER,
          genre VARCHAR(100),
          rating DECIMAL(3,1),
          language VARCHAR(50),
          director VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await this.executeQuery(createTableSQL);
      
      // Insert sample data if table is empty
      const countResult = await this.executeQuery('SELECT COUNT(*) FROM movies');
      const count = parseInt(countResult.rows[0].count);
      
      if (count === 0) {
        const sampleData = `
          INSERT INTO movies (title, year, genre, rating, language, director) VALUES
          ('Bahubali', 2015, 'Action', 8.5, 'Telugu', 'S.S. Rajamouli'),
          ('RRR', 2022, 'Action', 8.8, 'Telugu', 'S.S. Rajamouli'),
          ('KGF Chapter 1', 2018, 'Action', 8.2, 'Kannada', 'Prashanth Neel'),
          ('Pushpa', 2021, 'Action', 7.6, 'Telugu', 'Sukumar'),
          ('Dangal', 2016, 'Drama', 8.4, 'Hindi', 'Nitesh Tiwari'),
          ('3 Idiots', 2009, 'Comedy', 8.4, 'Hindi', 'Rajkumar Hirani'),
          ('Taare Zameen Par', 2007, 'Drama', 8.4, 'Hindi', 'Aamir Khan'),
          ('Zindagi Na Milegi Dobara', 2011, 'Comedy', 8.2, 'Hindi', 'Zoya Akhtar');
        `;
        
        await this.executeQuery(sampleData);
        console.log('✅ Sample movie data inserted');
      }
      
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }
}