# MERN Stack Chat App with LangChain & Gemini

A full-featured chat application that converts natural language queries to SQL using LangChain.js and Google's Gemini API, built with the MERN stack and Supabase PostgreSQL.

## 🚀 Features

- **Natural Language to SQL**: Convert plain English questions to SQL queries using LangChain.js + Gemini API
- **Real-time Chat Interface**: Responsive React-based chat UI with message history
- **Data Visualization**: Automatic chart generation for query results using Recharts
- **Database Operations**: Support for SELECT, INSERT, UPDATE, and DELETE operations
- **Error Handling**: Comprehensive error handling and input validation
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **LangChain.js** for AI agent logic
- **Google Gemini API** for natural language processing
- **Supabase PostgreSQL** for database
- **CORS, Helmet, Morgan** for security and logging

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API communication
- **Lucide React** for icons

## 📁 Project Structure

```
├── backend/
│   ├── agents/           # LangChain Gemini agent logic
│   ├── routes/           # Express routes
│   ├── controllers/      # Request controllers
│   ├── services/         # Database services
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API configuration
│   │   └── utils/        # Utility functions
│   └── public/          # Static assets
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- Supabase account
- Google AI Studio account (for Gemini API)

### 1. Clone the repository
```bash
git clone <repository-url>
cd mern-langchain-chat-app
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Backend Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_DB_URL=postgresql://postgres:[password]@[host]:[port]/[database]

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Get Required API Keys

#### Supabase Setup:
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API to get your URL and anon key
4. Go to Settings > Database to get your connection string

#### Gemini API Setup:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key to your `.env` file

### 5. Database Initialization

The application will automatically create the `movies` table and insert sample data when you first run the backend server.

## 🚀 Running the Application

### Development Mode (Both servers)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:5173`

### Individual Servers

#### Backend only:
```bash
npm run server
```

#### Frontend only:
```bash
npm run client
```

## 📊 Example Queries

Try these natural language queries:

1. **Data Retrieval:**
   - "List all Telugu movies after 2020"
   - "Show movies with rating above 8.0"
   - "Find all action movies"

2. **Aggregations with Visualization:**
   - "Show average rating per genre"
   - "Count movies by language"
   - "Display rating distribution"

3. **Data Modification:**
   - "Insert a new movie: Pushpa 2, 2024, Action, Rating 8.0"
   - "Update the rating of Bahubali to 9.0"
   - "Delete movies with rating below 5.0"

## 🔒 Security Features

- Input sanitization and validation
- SQL injection prevention
- Query type restrictions (no DROP, TRUNCATE, etc.)
- CORS configuration
- Helmet.js security headers
- Error handling without exposing sensitive data

## 📈 Data Visualization

The app automatically detects when query results can be visualized and generates:
- **Bar Charts**: For comparisons (e.g., ratings by genre)
- **Pie Charts**: For distributions (e.g., movie count by language)
- **Line Charts**: For trends over time

## 🛡 Error Handling

- Comprehensive error messages for users
- Detailed logging for developers
- Graceful handling of API failures
- Database connection error recovery

## 🔧 Configuration

### Backend Configuration
- Port: `5000` (configurable via PORT env var)
- CORS: Configured for frontend URL
- Request timeout: 30 seconds
- Body parser limits: 10MB

### Frontend Configuration
- Development server: `5173`
- API proxy: Configured for backend
- Build output: `dist/`

## 📝 API Endpoints

- `POST /api/chat` - Send natural language query
- `GET /api/schema` - Get database schema
- `GET /api/health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues:

1. **Connection Refused**: Make sure both backend and frontend servers are running
2. **API Key Errors**: Verify your Gemini API key is correct and has proper permissions
3. **Database Errors**: Check your Supabase connection string and credentials
4. **CORS Errors**: Ensure FRONTEND_URL in backend .env matches your frontend URL

### Getting Help:

- Check the browser console for frontend errors
- Check the backend terminal for server errors
- Verify all environment variables are set correctly
- Ensure all dependencies are installed

## 🎯 Future Enhancements

- User authentication and session management
- Query history and favorites
- Advanced chart customization
- Export functionality for results
- Real-time collaboration features
- Voice input support