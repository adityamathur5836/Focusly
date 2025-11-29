import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Book, Clock, Trophy, MoreVertical, Search, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Focusly</span>
            </Link>
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes, flashcards..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 w-64 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="primary" className="hidden sm:flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John! 👋</h1>
          <p className="text-gray-600">You're on a 3-day streak. Keep it up!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Study Time</p>
              <p className="text-xl font-bold text-gray-900">12.5 hrs</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Book className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Notes Created</p>
              <p className="text-xl font-bold text-gray-900">24</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cards Mastered</p>
              <p className="text-xl font-bold text-gray-900">156</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
            <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-indigo-100">Daily Goal</p>
              <p className="text-xl font-bold">85%</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Notes</h2>
              <Link to="/notes" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
            </div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        Introduction to Molecular Biology
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule.
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <span className="bg-gray-100 px-2 py-1 rounded">Biology</span>
                    <span>•</span>
                    <span>2 hours ago</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <Card className="p-6 bg-gradient-to-br from-indigo-900 to-violet-900 text-white">
              <h3 className="font-bold text-lg mb-2">AI Tutor</h3>
              <p className="text-indigo-200 text-sm mb-4">
                Need help understanding a topic? Ask your personal AI tutor.
              </p>
              <Button className="w-full bg-blue text-indigo-900 hover:bg-indigo-50">
                Start Chatting
              </Button>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Due for Review</h2>
              </div>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Book className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">History 101</p>
                      <p className="text-xs text-gray-500">24 cards due</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="text-xs">Review</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Book className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Chemistry</p>
                      <p className="text-xs text-gray-500">12 cards due</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="text-xs">Review</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
