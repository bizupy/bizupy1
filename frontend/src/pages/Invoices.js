import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Receipt, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_gstin: '',
    customer_address: '',
    items: [{ product_name: '', quantity: 1, rate: 0, amount: 0 }],
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data);
    } catch (error) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to load customers');
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_name: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    if (!formData.customer_name || formData.items.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check GST requirement based on quantity (>500kg rule)
    const totalQuantity = formData.items.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
    if (totalQuantity > 500 && !formData.customer_gstin) {
      toast.error('GSTIN is required for orders above 500 units');
      return;
    }

    try {
      await api.post('/invoices', formData);
      toast.success('Invoice created successfully');
      setShowCreate(false);
      fetchInvoices();
      setFormData({
        customer_name: '',
        customer_gstin: '',
        customer_address: '',
        items: [{ product_name: '', quantity: 1, rate: 0, amount: 0 }],
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalQuantity = formData.items.reduce((sum, item) => sum + parseFloat(item.quantity || 0), 0);
  const showGSTIN = totalQuantity > 500;

  return (
    <div data-testid="invoices-page" className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-slate-900">Invoices</h1>
          <p className="mt-2 text-slate-600">Create and manage GST invoices</p>
        </div>
        <Button
          data-testid="create-invoice-btn"
          onClick={() => setShowCreate(true)}
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {invoices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              data-testid={`invoice-card-${invoice.id}`}
              onClick={() => navigate(`/invoices/${invoice.id}`)}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{invoice.invoice_number}</h3>
              <p className="text-sm text-slate-600 mb-2">{invoice.customer_name}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {invoice.items.length} item(s)
                </span>
                <span className="text-lg font-bold font-manrope text-primary tabular-nums">
                  ₹{invoice.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No invoices yet</p>
          <Button
            data-testid="create-first-invoice-btn"
            onClick={() => setShowCreate(true)}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Create Your First Invoice
          </Button>
        </div>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto" data-testid="create-invoice-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-manrope">Create Invoice</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Customer Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    data-testid="customer-name-input"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
                {showGSTIN && (
                  <div>
                    <Label htmlFor="customer_gstin">Customer GSTIN *</Label>
                    <Input
                      id="customer_gstin"
                      data-testid="customer-gstin-input"
                      value={formData.customer_gstin}
                      onChange={(e) => setFormData({...formData, customer_gstin: e.target.value})}
                      placeholder="Required for quantity > 500"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="customer_address">Customer Address</Label>
                <Textarea
                  id="customer_address"
                  data-testid="customer-address-input"
                  value={formData.customer_address}
                  onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
                  placeholder="Enter customer address"
                  rows={2}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Items</h3>
                <Button
                  data-testid="add-item-btn"
                  onClick={handleAddItem}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid gap-4">
                    <div>
                      <Label>Product Name *</Label>
                      <Input
                        data-testid={`item-name-${index}`}
                        value={item.product_name}
                        onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Quantity *</Label>
                        <Input
                          data-testid={`item-quantity-${index}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Rate (₹) *</Label>
                        <Input
                          data-testid={`item-rate-${index}`}
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label>Amount (₹)</Label>
                        <Input
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="bg-slate-50"
                        />
                      </div>
                    </div>
                    {formData.items.length > 1 && (
                      <Button
                        data-testid={`remove-item-${index}`}
                        onClick={() => handleRemoveItem(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-fit"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {showGSTIN && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm text-warning-foreground">
                    ⚠️ Total quantity is {totalQuantity.toFixed(2)} units. GSTIN is required for orders above 500 units.
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                data-testid="invoice-notes-input"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Add any additional notes"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
              <Button
                data-testid="cancel-invoice-btn"
                onClick={() => setShowCreate(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                data-testid="save-invoice-btn"
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;