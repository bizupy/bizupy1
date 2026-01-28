import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { api } from '../contexts/AuthContext';
import { Crown, Check } from 'lucide-react';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language_preference: user?.language_preference || 'en',
    business_name: user?.business_name || '',
    business_gstin: user?.business_gstin || '',
    business_address: user?.business_address || '',
    business_phone: user?.business_phone || ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      await api.put('/auth/profile', formData);
      setUser({ ...user, ...formData });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['20 bills/month', 'Basic OCR', 'Ledger & reports']
    },
    {
      name: 'Pro',
      price: 499,
      features: ['Unlimited bills', 'Advanced OCR', 'Excel export', 'Priority support']
    },
    {
      name: 'Business',
      price: 999,
      features: ['Everything in Pro', 'Multi-user access', 'CA integration', 'Dedicated support']
    }
  ];

  return (
    <div data-testid="settings-page" className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-manrope text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">Manage your profile and business information</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-6">Profile</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                data-testid="profile-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="profile-email"
                type="email"
                value={formData.email}
                disabled
                className="bg-slate-50"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                data-testid="profile-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language_preference}
                onValueChange={(value) => setFormData({...formData, language_preference: value})}
              >
                <SelectTrigger data-testid="language-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-6">Business Information</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                data-testid="business-name"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                placeholder="Your business name"
              />
            </div>
            <div>
              <Label htmlFor="business_gstin">Business GSTIN</Label>
              <Input
                id="business_gstin"
                data-testid="business-gstin"
                value={formData.business_gstin}
                onChange={(e) => setFormData({...formData, business_gstin: e.target.value})}
                placeholder="Your GSTIN"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="business_address">Business Address</Label>
            <Input
              id="business_address"
              data-testid="business-address"
              value={formData.business_address}
              onChange={(e) => setFormData({...formData, business_address: e.target.value})}
              placeholder="Your business address"
            />
          </div>
          <div>
            <Label htmlFor="business_phone">Business Phone</Label>
            <Input
              id="business_phone"
              data-testid="business-phone"
              value={formData.business_phone}
              onChange={(e) => setFormData({...formData, business_phone: e.target.value})}
              placeholder="Your business phone"
            />
          </div>
          <Button
            data-testid="update-profile-btn"
            onClick={handleUpdateProfile}
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-6">Subscription</h2>
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 rounded-md bg-primary-50 border border-primary-200">
            <Crown className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">
              Current Plan: {user?.subscription_plan || 'free'}
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-6 ${
                (user?.subscription_plan || 'free').toLowerCase() === plan.name.toLowerCase()
                  ? 'border-primary bg-primary-50/30'
                  : 'border-slate-200'
              }`}
            >
              <h3 className="text-lg font-semibold font-manrope text-slate-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold font-manrope text-slate-900">₹{plan.price}</span>
                <span className="text-slate-600">/month</span>
              </div>
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-600">
                    <Check className="h-4 w-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                variant={(user?.subscription_plan || 'free').toLowerCase() === plan.name.toLowerCase() ? 'outline' : 'default'}
                disabled={(user?.subscription_plan || 'free').toLowerCase() === plan.name.toLowerCase()}
              >
                {(user?.subscription_plan || 'free').toLowerCase() === plan.name.toLowerCase()
                  ? 'Current Plan'
                  : plan.price === 0
                  ? 'Downgrade'
                  : 'Upgrade'}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500">
            <strong>Disclaimer:</strong> This application assists with record-keeping only and does not replace a Chartered Accountant or legal advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;