import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Mic } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import VoiceRecorder from '../components/VoiceRecorder';
import API_BASE_URL from '../config/api';

const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          content: data.content,
          tags: data.tags || '',
        });
      } else {
        alert('Note not found');
        navigate('/notes');
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Failed to load note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVoiceTranscript = (transcript) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content + (prev.content ? ' ' : '') + transcript
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    setIsSaving(true);
    try {
      const url = isEditing 
        ? `${API_BASE_URL}/api/notes/${id}`
        : `${API_BASE_URL}/api/notes`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/notes');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
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
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter note title..."
              required
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <button
                  type="button"
                  onClick={() => setShowVoiceInput(!showVoiceInput)}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Mic className="h-4 w-4" />
                  {showVoiceInput ? 'Hide' : 'Show'} Voice Input
                </button>
              </div>
              
              {showVoiceInput && (
                <div className="mb-4">
                  <VoiceRecorder onTranscriptChange={handleVoiceTranscript} />
                </div>
              )}

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Start typing or use voice input..."
                required
              />
            </div>

            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. biology, study, exam"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/notes')}
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
                  {isEditing ? 'Update Note' : 'Create Note'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditorPage;
