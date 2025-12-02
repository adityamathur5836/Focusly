import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, LogOut, Sparkles, Brain, TrendingUp, BookOpen, Layers, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import FileUpload from '../components/FileUpload';
import FeatureCard from '../components/FeatureCard';
import FAQItem from '../components/FAQItem';
import API_BASE_URL from '../config/api';

const DashboardPage = () => {
  const navigate = useNavigate();

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

  const handleUploadSuccess = (data) => {
    if (data.note) {
      navigate('/notes');
    } else if (data.set) {
      navigate('/flashcards');
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Flashcards & Quizzes & Exams',
      description: 'Flashcards, quizzes, and exams are automatically created from your notes and study materials.',
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Brain,
      title: 'Get help & Summaries',
      description: 'Get instant help on any topic. AI will summarize your notes and answer your questions.',
      iconBgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: Target,
      title: 'Study with your friends',
      description: 'Invite others so you can collaborate on study materials and share your progress.',
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ];

  const faqs = [
    {
      question: 'What is Focusly AI?',
      answer: 'Focusly AI is an intelligent study platform that uses artificial intelligence to help you create notes, flashcards, and study materials from your documents. It leverages advanced AI to summarize content, generate questions, and help you learn more effectively.'
    },
    {
      question: 'What are Focusly AI\'s different tools? What can I study with?',
      answer: 'Focusly offers multiple AI-powered tools including: automatic note generation from PDFs and documents, AI-generated flashcards for spaced repetition learning, intelligent summaries of complex topics, and personalized study recommendations based on your learning patterns.'
    },
    {
      question: 'What happens if I don\'t have a Focusly AI subscription?',
      answer: 'You can still use Focusly with limited features. Free users can create notes manually, upload a limited number of documents per month, and access basic flashcard functionality. Premium features like unlimited AI generation and advanced analytics require a subscription.'
    },
    {
      question: 'What AI sources/references are available in Focusly AI?',
      answer: 'Focusly uses Google\'s Gemini AI, one of the most advanced language models available. The AI is trained on a vast corpus of educational materials and can understand and process content across multiple subjects and languages.'
    },
    {
      question: 'How can I best upload documents to Focusly AI?',
      answer: 'For best results, upload text-based PDFs or TXT files with clear, readable content. Focusly now supports scanned PDFs and image-based documents using OCR (Optical Character Recognition), though processing may take 10-30 seconds. For optimal OCR results, ensure scanned documents have clear, high-contrast text. Avoid encrypted PDFs or corrupted files. Files should contain at least 50 characters of text and be under 10MB in size.'
    },
    {
      question: 'How was Focusly AI built using responsible AI?',
      answer: 'Focusly is built with responsible AI principles in mind. We prioritize user privacy, don\'t train our models on your personal documents, and implement safeguards to ensure accurate and helpful content generation. We\'re committed to transparency and ethical AI use.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Hey, studying starts with <span className="text-indigo-600">Focusly AI</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your notes, PDFs, or scanned documents and let AI create study materials for you
          </p>
        </div>

        <div className="mb-16">
          <FileUpload onSuccess={handleUploadSuccess} />
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Ace your studies with Focusly AI
          </h2>
          <p className="text-center text-gray-600 mb-10">
            We built a super smart AI tool to help you study and help you study
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Record and transcribe your class on the go
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Stay focused in class, your focus will be your ally after the class ends
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Focus first, notes later
                </h3>
                <p className="text-gray-600">
                  Record lectures and let AI create comprehensive notes
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Layers className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Playback your classes
                </h3>
                <p className="text-gray-600">
                  Review and study at your own pace with AI assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">
            Ready to transform your studying experience?
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/notes/new">
              <Button variant="primary" className="px-8">
                Create Your First Note
              </Button>
            </Link>
            <Link to="/notes">
              <Button variant="secondary" className="px-8">
                View All Notes
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2024 Focusly. All rights reserved.</p>
          <p className="mt-2">
            Powered by AI • Built for Students
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
