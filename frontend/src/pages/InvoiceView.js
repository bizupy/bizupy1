import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { ArrowLeft, Download, Share2, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { api, useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const InvoiceView = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${invoiceId}`);
      setInvoice(response.data);
    } catch (error) {
      toast.error('Failed to load invoice');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: invoice ? `Invoice_${invoice.invoice_number}` : 'Invoice',
  });

  const handleDownloadPDF = () => {
    handlePrint();
  };

  const handleShareWhatsApp = () => {
    const message = `Invoice ${invoice.invoice_number}\nAmount: ₹${invoice.total_amount.toLocaleString('en-IN')}\nView: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Invoice ${invoice.invoice_number} - ${user?.business_name || 'Bizupy'}`;
    const body = `Please find invoice details:\n\nInvoice Number: ${invoice.invoice_number}\nDate: ${new Date(invoice.invoice_date).toLocaleDateString('en-IN')}\nAmount: ₹${invoice.total_amount.toLocaleString('en-IN')}\n\nView invoice: ${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const convertHundreds = (n) => {
      let str = '';
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 10 && n <= 19) {
        str += teens[n - 10] + ' ';
      } else if (n >= 20) {
        str += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0 && n < 10) {
        str += ones[n] + ' ';
      }
      return str;
    };

    let rupees = Math.floor(num);
    let paise = Math.round((num - rupees) * 100);
    let words = '';

    if (rupees >= 10000000) {
      words += convertHundreds(Math.floor(rupees / 10000000)) + 'Crore ';
      rupees %= 10000000;
    }
    if (rupees >= 100000) {
      words += convertHundreds(Math.floor(rupees / 100000)) + 'Lakh ';
      rupees %= 100000;
    }
    if (rupees >= 1000) {
      words += convertHundreds(Math.floor(rupees / 1000)) + 'Thousand ';
      rupees %= 1000;
    }
    if (rupees > 0) {
      words += convertHundreds(rupees);
    }

    words += 'Rupees';
    if (paise > 0) {
      words += ' and ' + convertHundreds(paise) + 'Paise';
    }
    return words + ' Only';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-6 print:hidden">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Invoices
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button
                onClick={handleShareEmail}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto px-4">
        <div ref={componentRef} className="bg-white shadow-lg" style={{ padding: '40px', minHeight: '297mm' }}>
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-slate-800">
            <div className="flex items-start gap-4">
              {user?.business_logo && (
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL}${user.business_logo}`}
                  alt="Business Logo" 
                  className="h-16 w-16 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  {user?.business_name || 'Your Business Name'}
                </h1>
                <p className="text-sm text-slate-600">{user?.business_address || 'Business Address'}</p>
                {user?.business_gstin && (
                  <p className="text-sm text-slate-600 font-semibold">GSTIN: {user.business_gstin}</p>
                )}
                <p className="text-sm text-slate-600">
                  {user?.business_phone && `Phone: ${user.business_phone}`}
                  {user?.email && ` | Email: ${user.email}`}
                </p>
              </div>
            </div>
            <div className="text-right border-2 border-slate-800 p-3 bg-slate-50">
              <p className="text-xs font-semibold text-slate-500 mb-1">TAX INVOICE</p>
              <p className="text-lg font-bold text-slate-900 mb-1">{invoice.invoice_number}</p>
              <p className="text-sm text-slate-600">Date: {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}</p>
              <p className="text-xs text-slate-500 mt-1">ORIGINAL</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2">BILLED TO:</p>
            <div className="border border-slate-300 p-3 bg-slate-50">
              <p className="font-semibold text-slate-900">{invoice.customer_name}</p>
              {invoice.customer_address && (
                <p className="text-sm text-slate-600">{invoice.customer_address}</p>
              )}
              {invoice.customer_gstin && (
                <p className="text-sm text-slate-600 font-semibold">GSTIN: {invoice.customer_gstin}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6 border border-slate-300">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="border border-slate-600 p-2 text-left text-xs font-semibold w-12">#</th>
                <th className="border border-slate-600 p-2 text-left text-xs font-semibold">Description</th>
                <th className="border border-slate-600 p-2 text-center text-xs font-semibold w-24">HSN/SAC</th>
                <th className="border border-slate-600 p-2 text-center text-xs font-semibold w-20">Qty</th>
                <th className="border border-slate-600 p-2 text-right text-xs font-semibold w-24">Rate</th>
                <th className="border border-slate-600 p-2 text-right text-xs font-semibold w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-2 text-sm">{index + 1}</td>
                  <td className="border border-slate-300 p-2 text-sm">
                    {item.product_name}
                    {item.unit && <span className="text-xs text-slate-500"> ({item.unit})</span>}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-center">
                    {item.hsn_code || '-'}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-right tabular-nums">
                    ₹{item.rate.toFixed(2)}
                  </td>
                  <td className="border border-slate-300 p-2 text-sm text-right font-semibold tabular-nums">
                    ₹{item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-80">
              <table className="w-full border border-slate-300">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 text-sm font-semibold">Subtotal</td>
                    <td className="border border-slate-300 p-2 text-sm text-right tabular-nums">
                      ₹{invoice.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  {invoice.cgst > 0 && (
                    <>
                      <tr>
                        <td className="border border-slate-300 p-2 text-sm">CGST</td>
                        <td className="border border-slate-300 p-2 text-sm text-right tabular-nums">
                          ₹{invoice.cgst.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-sm">SGST</td>
                        <td className="border border-slate-300 p-2 text-sm text-right tabular-nums">
                          ₹{invoice.sgst.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  )}
                  {invoice.igst > 0 && (
                    <tr>
                      <td className="border border-slate-300 p-2 text-sm">IGST</td>
                      <td className="border border-slate-300 p-2 text-sm text-right tabular-nums">
                        ₹{invoice.igst.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-800 text-white">
                    <td className="border border-slate-600 p-3 text-base font-bold">TOTAL</td>
                    <td className="border border-slate-600 p-3 text-base text-right font-bold tabular-nums">
                      ₹{invoice.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-6 border border-slate-300 p-3 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 mb-1">AMOUNT IN WORDS:</p>
            <p className="text-sm font-semibold text-slate-900">
              {numberToWords(invoice.total_amount)}
            </p>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 mb-1">NOTES:</p>
              <p className="text-sm text-slate-600">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-300">
            <div className="flex justify-between items-end">
              <div className="text-xs text-slate-500">
                <p className="font-semibold mb-1">DECLARATION:</p>
                <p className="max-w-md">
                  We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 mb-8">For {user?.business_name || 'Your Business'}</p>
                <p className="text-sm font-semibold text-slate-900 border-t border-slate-800 pt-2 mt-8">
                  Authorized Signatory
                </p>
              </div>
            </div>
          </div>

          {/* GST Compliance Note */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          [data-testid] {
            display: none !important;
          }
          #root > div > div:last-child {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;