import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RotateCw, CheckCircle, Zap, Menu, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import API_BASE_URL from '../config/api';

const StudySessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSet();
  }, [id]);

  const fetchSet = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/flashcards/${id}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.cards || data.cards.length === 0) {
          alert('This set has no cards to study');
          navigate('/flashcards');
          return;
        }
        setSet(data);
      } else {
        alert('Flashcard set not found');
        navigate('/flashcards');
      }
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
      alert('Failed to load flashcard set');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRating = async (rating) => {
    const ratingMap = { again: 0, hard: 1, good: 2, easy: 3 };
    const currentCard = set.cards[currentCardIndex];

    setStats(prev => ({
      ...prev,
      [rating]: prev[rating] + 1,
    }));

    if (currentCardIndex < set.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSessionComplete(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!set) return null;

  if (sessionComplete) {
    const totalCards = set.cards.length;
    const totalReviews = stats.again + stats.hard + stats.good + stats.easy;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Complete!</h1>
          <p className="text-gray-600 mb-8">Great job studying {set.title}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.again}</div>
              <div className="text-sm text-red-700">Again</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.hard}</div>
              <div className="text-sm text-orange-700">Hard</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.good}</div>
              <div className="text-sm text-blue-700">Good</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.easy}</div>
              <div className="text-sm text-green-700">Easy</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleRestart} variant="secondary" className="flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              Study Again
            </Button>
            <Button onClick={() => navigate('/flashcards')}>
              Back to Sets
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentCard = set.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / set.cards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="pb-10">
          <div className="flex items-center justify-between">
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
                  className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
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
            <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1">
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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{set.title}</h1>
            <span className="text-sm text-gray-600">
              Card {currentCardIndex + 1} of {set.cards.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="p-8 mb-6 min-h-[300px] flex items-center justify-center">
          <div className="text-center w-full">
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500 uppercase">
                {showAnswer ? 'Answer' : 'Question'}
              </span>
            </div>
            <p className="text-2xl text-gray-900 whitespace-pre-wrap">
              {showAnswer ? currentCard.back : currentCard.front}
            </p>
          </div>
        </Card>

        {!showAnswer ? (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAnswer(true)}
              className="px-8 py-3 text-lg"
            >
              Show Answer
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-center text-sm text-gray-600 mb-4">How well did you know this?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => handleRating('again')}
                variant="secondary"
                className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <div>
                  <div className="font-semibold">Again</div>
                  <div className="text-xs">&lt;1 min</div>
                </div>
              </Button>
              <Button
                onClick={() => handleRating('hard')}
                variant="secondary"
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
              >
                <div>
                  <div className="font-semibold">Hard</div>
                  <div className="text-xs">&lt;6 min</div>
                </div>
              </Button>
              <Button
                onClick={() => handleRating('good')}
                variant="secondary"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              >
                <div>
                  <div className="font-semibold">Good</div>
                  <div className="text-xs">&lt;10 min</div>
                </div>
              </Button>
              <Button
                onClick={() => handleRating('easy')}
                variant="secondary"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <div>
                  <div className="font-semibold">Easy</div>
                  <div className="text-xs">4 days</div>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySessionPage;
