import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import API_BASE_URL from '../config/api';

const FlashcardSetEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [cards, setCards] = useState([{ front: '', back: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchSet();
    }
  }, [id]);

  const fetchSet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/flashcards/${id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
        setCards(data.cards.length > 0 ? data.cards : [{ front: '', back: '' }]);
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

  const handleAddCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const handleRemoveCard = (index) => {
    if (cards.length === 1) {
      alert('You must have at least one card');
      return;
    }
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const validCards = cards.filter(card => card.front.trim() && card.back.trim());
    if (validCards.length === 0) {
      alert('Please add at least one complete card with both question and answer');
      return;
    }

    setIsSaving(true);
    try {
      const url = isEditing
        ? `${API_BASE_URL}/api/flashcards/${id}`
        : `${API_BASE_URL}/api/flashcards`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          cards: validCards,
        }),
      });

      if (response.ok) {
        navigate('/flashcards');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save flashcard set');
      }
    } catch (error) {
      console.error('Error saving flashcard set:', error);
      alert('Failed to save flashcard set');
    } finally {
      setIsSaving(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Flashcard Set' : 'Create Flashcard Set'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Input
              label="Set Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Biology Chapter 3"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Cards</h2>
              <Button
                type="button"
                onClick={handleAddCard}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </div>

            {cards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Card {index + 1}</h3>
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question (Front)
                    </label>
                    <textarea
                      value={card.front}
                      onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Enter the question..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer (Back)
                    </label>
                    <textarea
                      value={card.back}
                      onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Enter the answer..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/flashcards')}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Update Set' : 'Create Set'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlashcardSetEditor;
