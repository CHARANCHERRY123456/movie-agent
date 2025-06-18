import { model, SYSTEM_PROMPT } from '../config/langchain.js';
import { validateQuery } from '../utils/queryValidator.js';

export class SQLAgent {
  constructor() {
    this.model = model;
  }

  async generateSQL(userQuery) {
    try {
      const prompt = `${SYSTEM_PROMPT}\n\nUser Query: ${userQuery}\n\nSQL Query:`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let sqlQuery = response.text().trim();
      
      // Clean up the response
      sqlQuery = sqlQuery.replace(/```sql/g, '').replace(/```/g, '').trim();
      
      // Validate the generated SQL
      const validation = validateQuery(sqlQuery);
      if (!validation.isValid) {
        throw new Error(`Invalid SQL generated: ${validation.error}`);
      }
      
      return {
        sql: sqlQuery,
        queryType: this.detectQueryType(sqlQuery),
        isValid: true
      };
    } catch (error) {
      console.error('SQL generation error:', error);
      throw new Error(`Failed to generate SQL: ${error.message}`);
    }
  }

  detectQueryType(sql) {
    const upperSQL = sql.toUpperCase().trim();
    if (upperSQL.startsWith('SELECT')) return 'SELECT';
    if (upperSQL.startsWith('INSERT')) return 'INSERT';
    if (upperSQL.startsWith('UPDATE')) return 'UPDATE';
    if (upperSQL.startsWith('DELETE')) return 'DELETE';
    return 'UNKNOWN';
  }

  async analyzeForVisualization(sqlQuery, results) {
    if (!results || results.length === 0) return null;

    try {
      const analysisPrompt = `
      Analyze this SQL query and results to determine if they can be visualized:
      
      SQL: ${sqlQuery}
      Sample Result: ${JSON.stringify(results[0])}
      Total Rows: ${results.length}
      
      Respond with JSON only:
      {
        "canVisualize": boolean,
        "chartType": "bar" | "pie" | "line" | null,
        "xField": "field_name" | null,
        "yField": "field_name" | null,
        "title": "Chart Title" | null
      }
      
      Rules:
      - canVisualize: true if data has numeric values suitable for charts
      - chartType: "bar" for comparisons, "pie" for parts of whole, "line" for trends
      - xField/yField: the column names to use for x and y axes
      `;

      const result = await this.model.generateContent(analysisPrompt);
      const response = await result.response;
      const analysisText = response.text().trim();
      
      // Extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      console.error('Visualization analysis error:', error);
      return null;
    }
  }
}