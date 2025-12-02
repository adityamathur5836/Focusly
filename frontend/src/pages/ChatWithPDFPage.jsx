import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, MessageCircle, Zap, LogOut } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import Button from '../components/ui/Button';
import API_BASE_URL from '../config/api';

const ChatWithPDFPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNoteAndStartSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const noteResponse = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!noteResponse.ok) {
        throw new Error('Failed to load note');
      }

      const noteData = await noteResponse.json();
      setNote(noteData.note);

      // Reuse the same token and headers for the chat request
      const chatHeaders = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        chatHeaders['Authorization'] = `Bearer ${token}`;
      }

      const chatResponse = await fetch(`${API_BASE_URL}/api/chat/start`, {
        method: 'POST',
        headers: chatHeaders,
        credentials: 'include',
        body: JSON.stringify({
          noteId: noteId,
          title: `Chat: ${noteData.note.title}`
        })
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to start chat session');
      }

      const chatData = await chatResponse.json();
      setConversationId(chatData.conversation.id);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    loadNoteAndStartSession();
  }, [loadNoteAndStartSession]);

  const handleLogout = async () => {
    try {
      // Clear localStorage first to prevent AuthRedirect from seeing authenticated user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call logout endpoint (fire and forget)
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(err => console.error('Logout API call failed:', err));
      
      // Navigate to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading study session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Focusly</span>
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              Chat with PDF
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Link 
                to="/dashboard"
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-3"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h2 className="text-2xl font-bold text-gray-900">{note?.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Created {new Date(note?.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="prose prose-sm max-w-none">
              {note?.content ? (
                <div 
                  className="markdown-content whitespace-pre-wrap"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {note.content}
                </div>
              ) : (
                <p className="text-gray-500">No content available</p>
              )}
            </div>
          </div>

          <div style={{ height: 'calc(100vh - 200px)' }}>
            {conversationId ? (
              <ChatInterface 
                conversationId={conversationId}
                noteTitle={note?.title}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-full">
                <p className="text-gray-500">Starting chat session...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithPDFPage;
