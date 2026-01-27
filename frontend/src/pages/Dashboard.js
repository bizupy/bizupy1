import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, TrendingUp, Receipt, Upload, ArrowUpRight, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { api } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Bills',
      value: stats?.total_bills || 0,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      testId: 'stat-total-bills'
    },
    {
      name: 'Total Customers',
      value: stats?.total_customers || 0,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      testId: 'stat-total-customers'
    },
    {
      name: 'Total Sales',
      value: `₹${(stats?.total_sales || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      testId: 'stat-total-sales'
    },
    {
      name: 'Total GST',
      value: `₹${(stats?.total_gst || 0).toLocaleString('en-IN')}`,
      icon: Receipt,
      color: 'bg-orange-100 text-orange-600',
      testId: 'stat-total-gst'
    },
  ];

  return (
    <div data-testid="dashboard" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome back! Here's your business overview</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button
            data-testid="quick-upload-btn"
            onClick={() => navigate('/bills')}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Bill
          </Button>
          <Button
            data-testid="quick-invoice-btn"
            onClick={() => navigate('/invoices')}
            variant="outline"
          >
            <Receipt className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              data-testid={stat.testId}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                  <p className="mt-2 text-2xl font-bold font-manrope tabular-nums text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-md ${stat.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-manrope text-slate-900">Monthly Sales</h3>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <p className="text-3xl font-bold font-manrope tabular-nums text-slate-900">
            ₹{(stats?.monthly_sales || 0).toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-sm text-slate-600">Current month revenue</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-manrope text-slate-900">Monthly GST</h3>
            <Receipt className="h-5 w-5 text-warning" />
          </div>
          <p className="text-3xl font-bold font-manrope tabular-nums text-slate-900">
            ₹{(stats?.monthly_gst || 0).toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-sm text-slate-600">GST collected this month</p>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold font-manrope text-slate-900">Recent Bills</h3>
            <Button
              data-testid="view-all-bills-btn"
              onClick={() => navigate('/bills')}
              variant="ghost"
              size="sm"
            >
              View All
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          {stats?.recent_bills?.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_bills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{bill.file_name}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(bill.upload_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold font-manrope tabular-nums text-slate-900">
                      ₹{(bill.extracted_data?.total_amount || 0).toLocaleString('en-IN')}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                      {bill.ocr_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No bills uploaded yet</p>
              <Button
                data-testid="upload-first-bill-btn"
                onClick={() => navigate('/bills')}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Upload Your First Bill
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/ledger')}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all text-left"
        >
          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <h4 className="font-semibold font-manrope text-slate-900 mb-2">View Ledger</h4>
          <p className="text-sm text-slate-600">Access your complete transaction history</p>
        </button>

        <button
          onClick={() => navigate('/customers')}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all text-left"
        >
          <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mb-4">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="font-semibold font-manrope text-slate-900 mb-2">Manage Customers</h4>
          <p className="text-sm text-slate-600">Add and track your customer base</p>
        </button>

        <button
          onClick={() => navigate('/products')}
          className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all text-left"
        >
          <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center mb-4">
            <Receipt className="h-5 w-5 text-purple-600" />
          </div>
          <h4 className="font-semibold font-manrope text-slate-900 mb-2">Manage Products</h4>
          <p className="text-sm text-slate-600">Organize your product catalog</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;