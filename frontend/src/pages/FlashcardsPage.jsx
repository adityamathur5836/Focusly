import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, BookOpen, Calendar, Layers, Zap, Menu, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import API_BASE_URL from '../config/api';

const FlashcardsPage = () => {
  const [sets, setSets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/flashcards`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSets(data);
      }
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this flashcard set?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/flashcards/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        setSets(sets.filter(set => set.id !== id));
      }
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDueCount = (cards) => {
    const now = new Date();
    return cards.filter(card => !card.nextReview || new Date(card.nextReview) <= now).length;
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
        <div className='flex justify-between items-center mb-8'>
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
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Notes
                  </Link>
                  <Link
                    to="/flashcards"
                    className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
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
        <div className="flex justify-between items-center mb-8">
          <Link to="/flashcards/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Set
            </Button>
          </Link>
        </div>
        </div>

        {sets.length === 0 ? (
          <Card className="p-12 text-center">
            <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No flashcard sets yet. Create your first set!</p>
            <Link to="/flashcards/new">
              <Button>Create Flashcard Set</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sets.map((set) => {
              const dueCount = getDueCount(set.cards || []);
              const totalCards = set.cards?.length || 0;

              return (
                <Card key={set.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{set.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {totalCards} {totalCards === 1 ? 'card' : 'cards'}
                        </div>
                        {dueCount > 0 && (
                          <div className="flex items-center gap-1 text-orange-600 font-medium">
                            <Calendar className="h-4 w-4" />
                            {dueCount} due
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mb-4">
                    Created {formatDate(set.createdAt)}
                  </div>

                  <div className="flex gap-2">
                    {totalCards > 0 && (
                      <Button
                        onClick={() => navigate(`/flashcards/${set.id}/study`)}
                        className="flex-1"
                        variant="primary"
                      >
                        Study
                      </Button>
                    )}
                    <button
                      onClick={() => navigate(`/flashcards/${set.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(set.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardsPage;
