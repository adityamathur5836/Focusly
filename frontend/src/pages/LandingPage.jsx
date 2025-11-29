import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, BookOpen, Brain, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: AI Tutor 2.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-tight">
            Learn so fast it feels like <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">cheating</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Focusly turns your messy notes into structured summaries, flashcards, and interactive quizzes instantly. Powered by advanced AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/register">
              <Button className="h-12 px-8 text-lg shadow-xl shadow-indigo-500/20">
                Start Learning for Free
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="secondary" className="h-12 px-8 text-lg">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Free tier available</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to master any subject</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop wasting time formatting notes. Let Focusly handle the busy work while you focus on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Voice Notes</h3>
              <p className="text-gray-600 leading-relaxed">
                Record lectures or thoughts. We'll transcribe, summarize, and organize them into structured notes automatically.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Flashcards</h3>
              <p className="text-gray-600 leading-relaxed">
                Turn any text or note into a deck of flashcards. Our spaced repetition algorithm ensures you never forget.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="h-12 w-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Tutor</h3>
              <p className="text-gray-600 leading-relaxed">
                Stuck on a concept? Chat with your personal AI tutor who knows your notes and can explain anything instantly.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
