import React, { useState, useEffect } from 'react';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hsn_code: '',
    unit: 'pcs',
    default_price: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Product name is required');
      return;
    }

    try {
      if (editMode) {
        await api.put(`/products/${selectedProduct.id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product added successfully');
      }
      setShowDialog(false);
      fetchProducts();
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editMode ? 'update' : 'add'} product`);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      hsn_code: product.hsn_code || '',
      unit: product.unit || 'pcs',
      default_price: product.default_price || 0
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', hsn_code: '', unit: 'pcs', default_price: 0 });
    setEditMode(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="products-page" className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-manrope text-slate-900">Products</h1>
          <p className="mt-2 text-slate-600">Manage your product catalog</p>
        </div>
        <Button
          data-testid="add-product-btn"
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              data-testid={`product-card-${product.id}`}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{product.name}</h3>
              <div className="space-y-1 text-sm">
                {product.hsn_code && (
                  <p className="text-slate-600">HSN: {product.hsn_code}</p>
                )}
                <p className="text-slate-600">Unit: {product.unit}</p>
                <p className="text-lg font-bold font-manrope text-primary tabular-nums mt-3">
                  ₹{(product.default_price || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No products yet</p>
          <Button
            onClick={() => setShowDialog(true)}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Add Your First Product
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent data-testid="product-dialog">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                data-testid="product-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="hsn_code">HSN Code</Label>
              <Input
                id="hsn_code"
                data-testid="product-hsn"
                value={formData.hsn_code}
                onChange={(e) => setFormData({...formData, hsn_code: e.target.value})}
                placeholder="Enter HSN code"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                data-testid="product-unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="e.g., pcs, kg, ltr"
              />
            </div>
            <div>
              <Label htmlFor="default_price">Default Price (₹)</Label>
              <Input
                id="default_price"
                data-testid="product-price"
                type="number"
                value={formData.default_price}
                onChange={(e) => setFormData({...formData, default_price: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
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
                data-testid="save-product-btn"
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
              >
                {editMode ? 'Update' : 'Add'} Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;