import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { FileText, BookOpen, Receipt, TrendingUp, Check, Upload, Download, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/send-otp`, { email });
      toast.success(`OTP sent! Use: ${response.data.otp}`);
      setOtpSent(true);
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/verify-otp`, { email, otp });
      login(response.data.access_token, response.data.user);
      toast.success('Login successful!');
      setShowAuth(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold font-manrope text-primary">Bizupy</h1>
            <Button data-testid="get-started-btn" onClick={() => setShowAuth(true)} className="bg-primary hover:bg-primary/90">
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
                <Button data-testid="hero-get-started-btn" size="lg" onClick={() => setShowAuth(true)} className="bg-primary hover:bg-primary/90 h-12 px-8">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Watch Demo
                </Button>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Free plan: 20 bills/month • No credit card required
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1618034712596-6fa88a15bb15?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzaG9wa2VlcGVyJTIwdXNpbmclMjBzbWFydHBob25lfGVufDB8fHx8MTc2OTUzNDMwOHww&ixlib=rb-4.1.0&q=85"
                alt="Indian shopkeeper managing business"
                className="rounded-lg shadow-xl border border-slate-200"
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
              <Button data-testid="free-plan-btn" className="w-full mt-8" variant="outline" onClick={() => setShowAuth(true)}>
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
              <Button data-testid="pro-plan-btn" className="w-full mt-8 bg-white text-primary hover:bg-primary-50" onClick={() => setShowAuth(true)}>
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
              <Button data-testid="business-plan-btn" className="w-full mt-8 bg-primary hover:bg-primary/90" onClick={() => setShowAuth(true)}>
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

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-manrope">Welcome to Bizupy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {!otpSent ? (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    data-testid="email-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
                <Button
                  data-testid="send-otp-btn"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    data-testid="otp-input"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  />
                  <p className="text-xs text-slate-500 mt-2">OTP sent to {email}</p>
                </div>
                <Button
                  data-testid="verify-otp-btn"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button
                  data-testid="resend-otp-btn"
                  onClick={() => setOtpSent(false)}
                  variant="ghost"
                  className="w-full"
                >
                  Change Email
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;