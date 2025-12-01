import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit, Calendar, MessageCircle, Zap, Menu, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col w-full md:w-auto md:flex-row md:items-center gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-8">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Focusly</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/notes"
                    className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
                  >
                    Notes
                  </Link>
                  <Link
                    to="/flashcards"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Flashcards
                  </Link>
                </nav>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="md:hidden w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1 mb-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/notes"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Notes
                </Link>
                <Link
                  to="/flashcards"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Flashcards
                </Link>
              </div>
            )}
          </div>
          <Link to="/notes/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
            {!searchTerm && (
              <Link to="/notes/new">
                <Button className="mt-4">Create Note</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/notes/${note.id}/edit`)}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">{note.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(note.createdAt)}
                      </div>
                      {note.tags && (
                        <div className="flex gap-2">
                          {note.tags.split(',').map((tag, idx) => (
                            <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/chat/${note.id}`)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Chat with PDF"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/notes/${note.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
