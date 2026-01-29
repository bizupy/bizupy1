import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, FileText, Receipt, DollarSign, BarChart3 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Analysis = () => {
  const [dateRange, setDateRange] = useState('today');
  const [dataType, setDataType] = useState('invoices');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, [dateRange, dataType]);

  const getDateRangeParams = () => {
    const today = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);
        startDate = weekStart;
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case 'custom':
        startDate = customStartDate ? new Date(customStartDate) : new Date();
        endDate = customEndDate ? new Date(customEndDate) : new Date();
        break;
      default:
        startDate = new Date();
        endDate = new Date();
    }

    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };

  const fetchAnalysis = async () => {
    if (dateRange === 'custom' && (!customStartDate || !customEndDate)) {
      return;
    }

    setLoading(true);
    try {
      const { start_date, end_date } = getDateRangeParams();
      const response = await api.get('/analysis/summary', {
        params: {
          type: dataType,
          start_date,
          end_date
        }
      });
      setAnalysisData(response.data);
    } catch (error) {
      console.error('Analysis fetch error:', error);
      toast.error('Failed to load analysis data');
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      fetchAnalysis();
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'invoices':
        return 'Sales Invoices';
      case 'expenses':
        return 'Expenses';
      case 'bills':
        return 'Purchases / Ledger';
      default:
        return 'Data';
    }
  };

  return (
    <div data-testid="analysis-page" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-manrope text-slate-900">Analysis</h1>
        <p className="mt-2 text-slate-600">Analyze your business data with smart insights</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Date Range Selection */}
          <div>
            <Label htmlFor="dateRange" className="mb-2 block">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger data-testid="date-range-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {dateRange === 'custom' && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                  <input
                    type="date"
                    id="startDate"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs">End Date</Label>
                  <input
                    type="date"
                    id="endDate"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md text-sm"
                  />
                </div>
                <Button
                  onClick={handleCustomDateChange}
                  size="sm"
                  className="w-full"
                  disabled={!customStartDate || !customEndDate}
                >
                  Apply Custom Range
                </Button>
              </div>
            )}
          </div>

          {/* Data Type Selection */}
          <div>
            <Label htmlFor="dataType" className="mb-2 block">Data Type</Label>
            <Select value={dataType} onValueChange={setDataType}>
              <SelectTrigger data-testid="data-type-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoices">Invoices (Sales)</SelectItem>
                <SelectItem value="expenses">Expenses</SelectItem>
                <SelectItem value="bills">Purchases / Ledger</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : analysisData ? (
        <>
          {/* Main Stats */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-white border-primary-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold font-manrope text-primary tabular-nums">
                    {formatCurrency(analysisData.total_amount)}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">{getDataTypeLabel()}</p>
                </div>
                <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Number of Entries</p>
                  <p className="text-3xl font-bold font-manrope text-blue-600 tabular-nums">
                    {analysisData.count}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {analysisData.count === 1 ? 'entry' : 'entries'}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-md bg-blue-600 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Breakdown Section */}
          {analysisData.breakdown && Object.keys(analysisData.breakdown).length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Breakdown
              </h2>

              {/* Day-wise Breakdown */}
              {analysisData.breakdown.daily && analysisData.breakdown.daily.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Day-wise Total</h3>
                  <div className="space-y-2">
                    {analysisData.breakdown.daily.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">
                            {new Date(item.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900 tabular-nums">
                            {formatCurrency(item.total)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.count} {item.count === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category-wise Breakdown (for expenses) */}
              {analysisData.breakdown.by_category && analysisData.breakdown.by_category.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Category-wise Total</h3>
                  <div className="space-y-2">
                    {analysisData.breakdown.by_category.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <span className="text-sm font-medium text-slate-900">{item.category || 'Uncategorized'}</span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900 tabular-nums">
                            {formatCurrency(item.total)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.count} {item.count === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer-wise Breakdown (for invoices) */}
              {analysisData.breakdown.by_customer && analysisData.breakdown.by_customer.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Customer-wise Total</h3>
                  <div className="space-y-2">
                    {analysisData.breakdown.by_customer.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <span className="text-sm font-medium text-slate-900">{item.customer || 'Unknown'}</span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900 tabular-nums">
                            {formatCurrency(item.total)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.count} {item.count === 1 ? 'invoice' : 'invoices'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </>
      ) : (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No data available for selected criteria</p>
          <p className="text-sm text-slate-500 mt-2">Try selecting a different date range or data type</p>
        </Card>
      )}
    </div>
  );
};

export default Analysis;