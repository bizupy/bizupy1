import React, { useState, useEffect } from 'react';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gstin: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Customer name is required');
      return;
    }

    try {
      if (editMode) {
        await api.put(`/customers/${selectedCustomer.id}`, formData);
        toast.success('Customer updated successfully');
      } else {
        await api.post('/customers', formData);
        toast.success('Customer added successfully');
      }
      setShowDialog(false);
      fetchCustomers();
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editMode ? 'update' : 'add'} customer`);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      gstin: customer.gstin || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await api.delete(`/customers/${customerId}`);
      setCustomers(customers.filter(c => c.id !== customerId));
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', gstin: '', email: '', phone: '', address: '' });
    setEditMode(false);
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="customers-page" className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-slate-900">Customers</h1>
          <p className="mt-2 text-slate-600">Manage your customer database</p>
        </div>
        <Button
          data-testid="add-customer-btn"
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {customers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              data-testid={`customer-card-${customer.id}`}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {customer.name[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{customer.name}</h3>
              {customer.gstin && (
                <p className="text-sm text-slate-600 mb-2">GSTIN: {customer.gstin}</p>
              )}
              {customer.phone && (
                <p className="text-sm text-slate-600 mb-2">{customer.phone}</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">Total Purchases</p>
                <p className="text-lg font-bold font-manrope text-primary tabular-nums">
                  ₹{(customer.total_purchases || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No customers yet</p>
          <Button
            onClick={() => setShowDialog(true)}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Add Your First Customer
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent data-testid="customer-dialog">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                data-testid="customer-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                data-testid="customer-gstin"
                value={formData.gstin}
                onChange={(e) => setFormData({...formData, gstin: e.target.value})}
                placeholder="Enter GSTIN"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="customer-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                data-testid="customer-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                data-testid="customer-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                data-testid="save-customer-btn"
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
              >
                {editMode ? 'Update' : 'Add'} Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;