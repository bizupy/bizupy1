import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Loader, Trash2, Edit, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { api } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/bills');
      setBills(response.data);
    } catch (error) {
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/bills/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Bill uploaded and processed successfully!');
      setBills([response.data, ...bills]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to upload bill';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  }, [bills]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleDelete = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;

    try {
      await api.delete(`/bills/${billId}`);
      setBills(bills.filter(b => b.id !== billId));
      toast.success('Bill deleted successfully');
      setSelectedBill(null);
    } catch (error) {
      toast.error('Failed to delete bill');
    }
  };

  const handleEdit = () => {
    setEditData(selectedBill.extracted_data);
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/bills/${selectedBill.id}`, editData);
      toast.success('Bill data updated successfully');
      setEditMode(false);
      fetchBills();
      setSelectedBill(null);
    } catch (error) {
      toast.error('Failed to update bill');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div data-testid="bills-page" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-manrope text-slate-900">Bills</h1>
        <p className="mt-2 text-slate-600">Upload and manage your GST bills</p>
      </div>

      {/* Upload Zone */}
      <div
        {...getRootProps()}
        data-testid="upload-dropzone"
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragActive
            ? 'border-primary bg-primary-50'
            : 'border-slate-300 hover:border-primary hover:bg-slate-50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} data-testid="file-input" />
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium text-primary">Processing bill...</p>
            <p className="text-sm text-slate-500 mt-2">Extracting data with AI-powered OCR</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-2">
              {isDragActive ? 'Drop your bill here' : 'Drag & drop bill images or PDFs here'}
            </p>
            <p className="text-sm text-slate-500 mb-4">or click to browse</p>
            <p className="text-xs text-slate-400">Supports JPG, PNG, PDF (Max 10MB)</p>
          </div>
        )}
      </div>

      {/* Bills List */}
      <div>
        <h2 className="text-xl font-semibold font-manrope text-slate-900 mb-4">
          Uploaded Bills ({bills.length})
        </h2>
        {bills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                data-testid={`bill-card-${bill.id}`}
                onClick={() => setSelectedBill(bill)}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    bill.ocr_status === 'completed'
                      ? 'bg-success/10 text-success'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {bill.ocr_status}
                  </span>
                </div>
                <h3 className="font-medium text-slate-900 truncate mb-1">{bill.file_name}</h3>
                <p className="text-sm text-slate-500 mb-2">
                  {new Date(bill.upload_date).toLocaleDateString('en-IN')}
                </p>
                {bill.extracted_data && (
                  <div className="text-sm space-y-1">
                    <p className="text-slate-600">
                      <span className="font-medium">Amount:</span>{' '}
                      <span className="font-semibold text-slate-900 tabular-nums">
                        ₹{(bill.extracted_data.total_amount || 0).toLocaleString('en-IN')}
                      </span>
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium">Confidence:</span>{' '}
                      <span className={`font-semibold ${
                        (bill.extracted_data.confidence_score || 0) >= 0.8
                          ? 'text-success'
                          : 'text-warning'
                      }`}>
                        {((bill.extracted_data.confidence_score || 0) * 100).toFixed(0)}%
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No bills uploaded yet</p>
            <p className="text-sm text-slate-500 mt-2">Upload your first bill to get started</p>
          </div>
        )}
      </div>

      {/* Bill Details Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => {
        setSelectedBill(null);
        setEditMode(false);
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" data-testid="bill-details-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Bill Details</span>
              <div className="flex gap-2">
                {!editMode ? (
                  <>
                    <Button
                      data-testid="edit-bill-btn"
                      size="sm"
                      variant="outline"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      data-testid="delete-bill-btn"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedBill.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      data-testid="save-edit-btn"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      data-testid="cancel-edit-btn"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-6 mt-4">
              <div>
                <Label>File Name</Label>
                <p className="text-sm text-slate-900 mt-1">{selectedBill.file_name}</p>
              </div>

              {selectedBill.extracted_data && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Seller Name</Label>
                      {editMode ? (
                        <Input
                          value={editData?.seller_name || ''}
                          onChange={(e) => setEditData({...editData, seller_name: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 mt-1">
                          {selectedBill.extracted_data.seller_name || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Seller GSTIN</Label>
                      {editMode ? (
                        <Input
                          value={editData?.seller_gstin || ''}
                          onChange={(e) => setEditData({...editData, seller_gstin: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 mt-1">
                          {selectedBill.extracted_data.seller_gstin || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Invoice Number</Label>
                      {editMode ? (
                        <Input
                          value={editData?.invoice_number || ''}
                          onChange={(e) => setEditData({...editData, invoice_number: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 mt-1">
                          {selectedBill.extracted_data.invoice_number || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Invoice Date</Label>
                      {editMode ? (
                        <Input
                          type="date"
                          value={editData?.invoice_date || ''}
                          onChange={(e) => setEditData({...editData, invoice_date: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 mt-1">
                          {selectedBill.extracted_data.invoice_date || 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subtotal</Label>
                      <p className="text-sm font-semibold text-slate-900 tabular-nums mt-1">
                        ₹{(selectedBill.extracted_data.subtotal || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <Label>Total GST</Label>
                      <p className="text-sm font-semibold text-slate-900 tabular-nums mt-1">
                        ₹{(selectedBill.extracted_data.total_gst || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>CGST</Label>
                      <p className="text-sm text-slate-900 tabular-nums mt-1">
                        ₹{(selectedBill.extracted_data.cgst || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <Label>SGST</Label>
                      <p className="text-sm text-slate-900 tabular-nums mt-1">
                        ₹{(selectedBill.extracted_data.sgst || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <Label>IGST</Label>
                      <p className="text-sm text-slate-900 tabular-nums mt-1">
                        ₹{(selectedBill.extracted_data.igst || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Total Amount</Label>
                    <p className="text-2xl font-bold font-manrope text-primary tabular-nums mt-1">
                      ₹{(selectedBill.extracted_data.total_amount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <Label>Confidence Score</Label>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(selectedBill.extracted_data.confidence_score || 0) * 100}%` }}
                        />
                      </div>
                      <span className="ml-3 text-sm font-semibold text-slate-900">
                        {((selectedBill.extracted_data.confidence_score || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bills;