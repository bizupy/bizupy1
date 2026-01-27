import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { FileText, BookOpen, Receipt, TrendingUp, Check, Upload, Download, BarChart } from 'lucide-react';
import { toast } from 'sonner';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold font-manrope text-primary">Bizupy</h1>
            <Button 
              data-testid="get-started-btn" 
              onClick={handleGoogleLogin} 
              className="bg-primary hover:bg-primary/90"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-manrope text-slate-900 tracking-tight leading-tight">
                Smart GST Bill &<br />Business Tracker
              </h2>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Upload bills, extract data automatically, maintain digital records, and create professional GST-compliant invoices - all in one place.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  data-testid="hero-get-started-btn" 
                  size="lg" 
                  onClick={handleGoogleLogin} 
                  className="bg-primary hover:bg-primary/90 h-12 px-8 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Free plan: 20 bills/month • No credit card required
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7111490/pexels-photo-7111490.jpeg"
                alt="Professional business invoice and accounting"
                className="rounded-lg shadow-xl border border-slate-200 w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold font-manrope text-slate-900">Everything You Need</h3>
            <p className="mt-4 text-lg text-slate-600">Simple tools for modern Indian businesses</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold font-manrope text-slate-900 mb-2">Bill Upload & OCR</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload photos or PDFs and extract all GST data automatically with AI-powered OCR
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold font-manrope text-slate-900 mb-2">Excel-like Ledger</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Maintain structured digital records with easy export to Excel/CSV formats
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold font-manrope text-slate-900 mb-2">Professional Invoices</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create and share GST-compliant invoices with automatic calculations
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold font-manrope text-slate-900 mb-2">Reports & Analytics</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track sales, customers, and GST with visual reports and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold font-manrope text-slate-900">Simple, Transparent Pricing</h3>
            <p className="mt-4 text-lg text-slate-600">Choose the plan that fits your business</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg border-2 border-slate-200 p-8">
              <h4 className="text-xl font-bold font-manrope text-slate-900">Free</h4>
              <p className="mt-2 text-sm text-slate-600">Perfect to get started</p>
              <div className="mt-4">
                <span className="text-4xl font-bold font-manrope text-slate-900">₹0</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">20 bill uploads/month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">Basic OCR extraction</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">Ledger & reports</span>
                </li>
              </ul>
              <Button 
                data-testid="free-plan-btn" 
                className="w-full mt-8" 
                variant="outline" 
                onClick={handleGoogleLogin}
              >
                Get Started
              </Button>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-primary rounded-lg border-2 border-primary p-8 relative transform md:scale-105 shadow-lg">
              <div className="absolute top-0 right-0 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h4 className="text-xl font-bold font-manrope text-white">Pro</h4>
              <p className="mt-2 text-sm text-primary-100">For growing businesses</p>
              <div className="mt-4">
                <span className="text-4xl font-bold font-manrope text-white">₹499</span>
                <span className="text-primary-100">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0" />
                  <span className="text-sm text-white">Unlimited bill uploads</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0" />
                  <span className="text-sm text-white">Advanced OCR with AI</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0" />
                  <span className="text-sm text-white">Export to Excel/CSV</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 flex-shrink-0" />
                  <span className="text-sm text-white">Priority support</span>
                </li>
              </ul>
              <Button 
                data-testid="pro-plan-btn" 
                className="w-full mt-8 bg-white text-primary hover:bg-primary-50" 
                onClick={handleGoogleLogin}
              >
                Upgrade Now
              </Button>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white rounded-lg border-2 border-slate-200 p-8">
              <h4 className="text-xl font-bold font-manrope text-slate-900">Business</h4>
              <p className="mt-2 text-sm text-slate-600">For established businesses</p>
              <div className="mt-4">
                <span className="text-4xl font-bold font-manrope text-slate-900">₹999</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">Multi-user access</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">CA export & integration</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-success mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-600">Dedicated support</span>
                </li>
              </ul>
              <Button 
                data-testid="business-plan-btn" 
                className="w-full mt-8 bg-primary hover:bg-primary/90" 
                onClick={handleGoogleLogin}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-500">
            <p>© 2025 Bizupy. All rights reserved.</p>
            <p className="mt-2 text-xs">
              Disclaimer: This application assists with record-keeping only and does not replace a Chartered Accountant or legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;