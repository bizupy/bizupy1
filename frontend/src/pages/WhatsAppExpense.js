import React, { useState } from 'react';
import { MessageSquare, Camera, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';

const WhatsAppExpense = () => {
  const { user } = useAuth();
  const whatsappNumber = user?.whatsapp_expense_number || 'Not configured';

  return (
    <div data-testid="whatsapp-expense-page" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-manrope text-slate-900">WhatsApp Expense Upload</h1>
        <p className="mt-2 text-slate-600">Send expenses via WhatsApp and track them automatically</p>
      </div>

      {/* Configuration Status */}
      <Alert className="border-primary-200 bg-primary-50">
        <MessageSquare className="h-4 w-4 text-primary" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">Your Expense Inbox: </span>
              <span className="text-primary font-mono">{whatsappNumber}</span>
            </div>
            {!user?.whatsapp_expense_number && (
              <span className="text-xs text-slate-500">
                Configure in Settings → Business Information
              </span>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* How It Works */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          How It Works
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary">
              1
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Configure Your Expense Inbox</h3>
              <p className="text-sm text-slate-600">
                Go to Settings → Business Information and add your WhatsApp number as "Expense Inbox"
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary">
              2
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Send Expenses to WhatsApp</h3>
              <p className="text-sm text-slate-600 mb-3">
                Send bill photos or simple text messages to this number. Our AI will automatically extract expense details.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-700 mb-2">Supported Text Formats:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <code className="bg-white px-2 py-1 rounded border border-slate-200">Petrol 1200</code>
                    <span className="text-xs text-slate-500">→ ₹1,200 fuel expense</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <code className="bg-white px-2 py-1 rounded border border-slate-200">Office tea 300</code>
                    <span className="text-xs text-slate-500">→ ₹300 office expense</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <code className="bg-white px-2 py-1 rounded border border-slate-200">Shop rent 15000</code>
                    <span className="text-xs text-slate-500">→ ₹15,000 rent expense</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary">
              3
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Automatic Data Extraction</h3>
              <p className="text-sm text-slate-600 mb-2">
                Our AI extracts the following details from your messages:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Amount:</strong> Automatically detected from text or bill image</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Date:</strong> Extracted from bill or uses message timestamp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Description:</strong> Item or service name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Category:</strong> Auto-categorized (Fuel, Food, Rent, Office Supplies, etc.)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary">
              4
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Review & Approve</h3>
              <p className="text-sm text-slate-600">
                Low-confidence entries are marked for manual review. You can edit or approve them before they're added to your expense ledger.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Photo or Text - Both Work</h3>
              <p className="text-sm text-slate-600">
                Send photos of receipts for detailed extraction, or send quick text messages for instant logging. Perfect for busy business owners.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md bg-purple-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Daily Summary Notification</h3>
              <p className="text-sm text-slate-600">
                Receive a WhatsApp notification every night with today's expense summary. Stay on top of your spending without logging in.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Automatic Categorization</h3>
              <p className="text-sm text-slate-600">
                AI automatically categorizes expenses (Fuel, Food, Rent, Supplies, etc.) for better tracking and analysis.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-md bg-orange-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Smart Confidence Scoring</h3>
              <p className="text-sm text-slate-600">
                Each expense gets a confidence score. Low-confidence entries are flagged for your review, ensuring accuracy.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Example Messages */}
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-white border-primary-200">
        <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-4">Example Messages</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Quick Text Expenses:</h3>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <code className="text-sm text-slate-900">Lunch 450</code>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <code className="text-sm text-slate-900">Taxi to office 280</code>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <code className="text-sm text-slate-900">Office supplies 1500</code>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Photo Expenses:</h3>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-3 border border-slate-200 flex items-center gap-2">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-900">Bill photo + "Office lunch"</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 flex items-center gap-2">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-900">Fuel receipt photo</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 flex items-center gap-2">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-900">Electricity bill photo</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer Note */}
      <Alert>
        <AlertDescription className="text-sm text-slate-600">
          <strong>Note:</strong> This feature requires WhatsApp Business API integration. Configure your Expense Inbox number in Settings to get started. 
          Messages are processed securely and stored only in your account.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WhatsAppExpense;