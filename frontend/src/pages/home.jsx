import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="font-inter text-gray-900 bg-white">
      {/* Navbar */}
      <header className="fixed w-full top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Focusly</h1>

          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#benefits" className="hover:text-blue-600 transition">Benefits</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQs</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#120C2C] via-[#1D1B52] to-[#101020] text-white pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 items-center gap-16">
          {/* Left Text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Learn So Fast, It Feels Like <span className="text-blue-400">Cheating</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg">
              Focusly combines the power of AI and neuroscience-backed learning
              to help students generate notes, practice flashcards, and get instant,
              meaningful feedback — all in one beautiful desktop experience.
            </p>

            <div className="flex gap-4">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
              >
                Start Learning Free
              </Link>
              <button className="border border-gray-400 hover:border-blue-400 px-6 py-3 rounded-lg font-semibold text-gray-300 hover:text-white transition">
                Watch Demo
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-gray-400">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" className="w-8 h-8 rounded-full border border-white" />
                <img src="https://randomuser.me/api/portraits/men/2.jpg" className="w-8 h-8 rounded-full border border-white" />
                <img src="https://randomuser.me/api/portraits/women/3.jpg" className="w-8 h-8 rounded-full border border-white" />
              </div>
              <span>+2200 learners trust Focusly</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <img
              src="../assets/hero_image.png"
              alt="Focusly AI Dashboard"
              className="rounded-xl shadow-2xl border border-white/10 w-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section id="benefits" className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-4">Why Choose Focusly?</h2>
        <p className="text-gray-500 max-w-3xl mx-auto mb-10">
          Focusly uses intelligent automation to remove distractions and enhance focus.
          Whether you're summarizing textbooks or testing your memory, Focusly adapts to
          your learning speed and goals.
        </p>

        <div className="flex flex-wrap justify-center gap-16">
          <div>
            <h3 className="text-4xl font-bold text-blue-600">66%</h3>
            <p className="text-gray-500 mt-2">Faster Learning Speed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">10x</h3>
            <p className="text-gray-500 mt-2">More Productive Sessions</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">33%</h3>
            <p className="text-gray-500 mt-2">Improved Knowledge Retention</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 space-y-24">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img src="../assets/AI_notes.png" alt="AI Notes" className="rounded-lg shadow-lg w-[420px]" />
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">AI-Powered Note Generation</h3>
              <p className="text-gray-600 mb-6">
                Focusly’s note generator converts dense lectures, PDFs, or voice transcripts into
                clean, concise notes instantly. You’ll never need to rewrite or reformat — Focusly’s
                algorithm understands topics, context, and key takeaways for optimal recall.
              </p>
              <p className="text-gray-500 mb-6">
                Add highlights, track important topics, and auto-organize everything into subjects
                and summaries.
              </p>
              <button className="text-blue-600 font-medium hover:underline">Learn More →</button>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">Interactive Flashcards & Real-Time Feedback</h3>
              <p className="text-gray-600 mb-6">
                Focusly builds smart flashcards automatically from your study material and adapts
                your quiz difficulty dynamically. It tracks your learning curve to strengthen weak
                areas using spaced repetition and gamified insights.
              </p>
              <p className="text-gray-500 mb-6">
                Practice mode offers instant AI explanations for wrong answers, ensuring deeper
                understanding after every attempt.
              </p>
              <button className="text-blue-600 font-medium hover:underline">Explore Tools →</button>
            </div>
            <img src="../assets/Flashcards.png" alt="Flashcards" className="rounded-lg shadow-lg w-[400px]" />
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img src="../assets/transcription.png" alt="Voice Study" className="rounded-lg shadow-lg w-[420px]" />
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">Voice-Activated Study Room</h3>
              <p className="text-gray-600 mb-6">
                Want to learn hands-free? Just speak. Focusly transcribes your voice,
                generates questions, and organizes ideas in real time. Ideal for auditory
                learners and productivity enthusiasts.
              </p>
              <p className="text-gray-500 mb-6">
                Say “Summarize Chapter 3” and watch Focusly transform speech into detailed,
                bullet-based learning material.
              </p>
              <button className="text-blue-600 font-medium hover:underline">Try Voice Mode →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8">Trusted by Students Worldwide</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-12">
          “Focusly completely redefined my workflow. I went from cramming notes the night before exams
          to actually understanding concepts deeply.”  
          <br />– <strong>Alex</strong>, Computer Science Major
        </p>
        <div className="flex justify-center gap-6 opacity-80">
          <img src="/assets/logo1.svg" className="h-6" alt="University Logo" />
          <img src="/assets/logo2.svg" className="h-6" alt="Institute Logo" />
          <img src="/assets/logo3.svg" className="h-6" alt="Partner Logo" />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                q: "How does Focusly generate notes?",
                a: "Focusly uses natural language processing (NLP) and AI models to identify key ideas and structure them into clean notes. You can upload PDFs, lecture text, or even dictate them via voice.",
              },
              {
                q: "Will my data be private and secure?",
                a: "Absolutely. All user data is encrypted at rest and in transit. Focusly uses secure JWT authentication and HTTPS-only API endpoints for protection.",
              },
              {
                q: "Does Focusly support teams or classrooms?",
                a: "Yes! Focusly includes group study modes, teacher dashboards, and shared flashcard sets for collaborative learning.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition">
                <h4 className="font-semibold text-lg mb-3">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D15] text-gray-400 py-10 text-sm">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Focusly</h3>
            <p className="text-gray-400">
              AI-augmented learning for the next generation of focused learners.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>Help Center</li>
              <li>Documentation</li>
              <li>API Reference</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-10">
          © {new Date().getFullYear()} Focusly. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
