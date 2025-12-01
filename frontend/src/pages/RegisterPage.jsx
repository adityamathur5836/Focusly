import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Check, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const validate = (name, value) => {
    let error = '';
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Please enter a valid email address';
    }
    if (name === 'password' && value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
    if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Passwords do not match';
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    const error = validate(name, val);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'agreeTerms') {
        const error = validate(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
        }));
        
        console.log('Registration successful:', data);
        alert('Registration successful! Welcome to Focusly!');
        
        window.location.href = '/';
      } else {
        setErrors({ email: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Failed to connect to server. Please try again.' });
    }
  };

  const isValid = 
    formData.name && 
    formData.email && 
    formData.password && 
    formData.confirmPassword && 
    formData.agreeTerms && 
    Object.keys(errors).every(key => !errors[key]);

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Focusly</span>
          </Link>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Join thousands of learners mastering new skills daily.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            "Focusly has completely transformed how I study. The AI tutor feels like having a professor in my pocket."
          </p>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 text-sm text-indigo-200">
            <span>© 2024 Focusly</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Log in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div className="flex items-center">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={!isValid}
            >
              Create Account
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full" disabled>
                Google
              </Button>
              <Button variant="secondary" className="w-full" disabled>
                GitHub
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
