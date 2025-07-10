import { SQLAgent } from '../agents/sqlAgent.js';
import { DatabaseService } from '../services/databaseService.js';
import { sanitizeInput } from '../utils/queryValidator.js';

const sqlAgent = new SQLAgent();
const dbService = new DatabaseService();

export const handleChatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    const sanitizedMessage = sanitizeInput(message);
    console.log('Processing query:', sanitizedMessage);

    // Generate SQL using LangChain + Gemini
    const sqlResult = await sqlAgent.generateSQL(sanitizedMessage);
    console.log('Generated SQL:', sqlResult.sql);

    let response = {
      success: true,
      userQuery: sanitizedMessage,
      generatedSQL: sqlResult.sql,
      queryType: sqlResult.queryType
    };

    // Execute the SQL query
    switch (sqlResult.queryType) {
      case 'SELECT':
        const selectResult = await dbService.executeSelect(sqlResult.sql);
        response.data = selectResult.data;
        response.rowCount = selectResult.rowCount;
        response.message = `Found ${selectResult.rowCount} result(s)`;
        
        // Analyze for visualization
        const vizAnalysis = await sqlAgent.analyzeForVisualization(
          sqlResult.sql, 
          selectResult.data
        );
        if (vizAnalysis && vizAnalysis.canVisualize) {
          response.visualization = vizAnalysis;
        }

        // Generate a natural language summary using Gemini
        if (selectResult.data && selectResult.data.length > 0) {
          const summaryPrompt = `User request: ${sanitizedMessage}\n\nMovie data: ${JSON.stringify(selectResult.data.slice(0, 10))}\n\nWrite a natural language answer for the user request above, based on the movie data. Be concise and clear.`;
          try {
            const summaryResult = await sqlAgent.model.generateContent(summaryPrompt);
            const summaryText = await summaryResult.response.text();
            response.summary = summaryText.trim();
          } catch (summaryError) {
            console.error('Summary generation error:', summaryError);
            response.summary = null;
          }
        } else {
          response.summary = 'No results found.';
        }
        break;

      case 'INSERT':
        const insertResult = await dbService.executeInsert(sqlResult.sql);
        response.result = insertResult;
        response.message = 'Record inserted successfully';
        break;

      case 'UPDATE':
        const updateResult = await dbService.executeUpdate(sqlResult.sql);
        response.result = updateResult;
        response.message = updateResult.message;
        break;

      case 'DELETE':
        const deleteResult = await dbService.executeDelete(sqlResult.sql);
        response.result = deleteResult;
        response.message = deleteResult.message;
        break;

      default:
        throw new Error('Unsupported query type');
    }

    res.json(response);
  } catch (error) {
    console.error('Chat query error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process query',
      userQuery: req.body.message
    });
  }
};

export const getSchema = async (req, res) => {
  try {
    const schemaQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'movies' 
      ORDER BY ordinal_position;
    `;
    
    const result = await dbService.executeSelect(schemaQuery);
    
    res.json({
      success: true,
      schema: result.data,
      tableName: 'movies'
    });
  } catch (error) {
    console.error('Schema fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch database schema'
    });
  }
};