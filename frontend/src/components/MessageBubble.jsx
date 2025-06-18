import React from 'react';
import { User, Bot, Database, Clock } from 'lucide-react';
import { formatTimestamp } from '../utils/formatters';

const MessageBubble = ({ message }) => {
  const { type, content, timestamp, data, sql, queryType, rowCount, isError } = message;

  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`message-bubble ${type === 'user' ? 'user-message' : 'bot-message'} ${isError ? 'border-red-200 bg-red-50' : ''}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          {type === 'user' ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className={`w-4 h-4 ${isError ? 'text-red-500' : 'text-primary-500'}`} />
          )}
          <span className="text-xs opacity-75">
            {type === 'user' ? 'You' : 'Assistant'}
          </span>
          <Clock className="w-3 h-3 opacity-50" />
          <span className="text-xs opacity-50">
            {formatTimestamp(timestamp)}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{content}</p>

          {/* SQL Query Display */}
          {sql && (
            <div className="bg-gray-100 rounded p-2 border-l-4 border-primary-500">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">
                  Generated SQL ({queryType})
                </span>
              </div>
              <code className="text-xs text-gray-800 font-mono break-all">
                {sql}
              </code>
            </div>
          )}

          {/* Data Results */}
          {data && data.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Results ({rowCount} row{rowCount !== 1 ? 's' : ''})
                </span>
              </div>
              
              {data.length <= 10 ? (
                // Show all data if 10 or fewer rows
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(data[0]).map((key) => (
                          <th key={key} className="px-2 py-1 text-left font-medium text-gray-700 border-b">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-2 py-1 text-gray-800">
                              {value !== null ? String(value) : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Show summary for large datasets
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Showing first 5 rows of {data.length} total results:
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          {Object.keys(data[0]).map((key) => (
                            <th key={key} className="px-2 py-1 text-left font-medium text-gray-700 border-b">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 5).map((row, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-2 py-1 text-gray-800">
                                {value !== null ? String(value) : 'NULL'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No data message */}
          {data && data.length === 0 && (
            <div className="text-xs text-gray-500 italic">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;