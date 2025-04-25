import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentService from '../../services/payment-service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');
  const receiptRef = useRef(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Function to generate a unique payment ID if one isn't provided
  const generatePaymentId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PH${timestamp}${random}`;
  };

  useEffect(() => {
    const orderId = location.state?.orderId || new URLSearchParams(window.location.search).get('order_id');
    const paymentId = location.state?.payment_id || new URLSearchParams(window.location.search).get('payment_id');
    
    if (!orderId) {
      setError('Order ID not found. Unable to verify payment confirmation.');
      setLoading(false);
      return;
    }

    // Fetch payment confirmation details
    const fetchPaymentSuccess = async () => {
      try {
        const response = await PaymentService.getPaymentStatus(orderId, paymentId);
        
        // Ensure transaction date is properly set
        const data = response.data;
        if (data) {
          // Set a default transaction date if not present
          if (!data.transactionDate) {
            data.transactionDate = new Date().toISOString();
          }
          
          // Generate a payment ID if not present
          if (!data.paymentId) {
            data.paymentId = generatePaymentId();
            console.log('Generated payment ID:', data.paymentId);
          }
        }
        
        setPaymentDetails(data);
      } catch (err) {
        console.error('Error fetching payment confirmation:', err);
        setError('Unable to verify payment details. Please contact customer support with your order ID.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSuccess();
  }, [location]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const generatePDF = () => {
    if (!paymentDetails) return;
    
    setGeneratingPdf(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add company logo or header (optional)
      doc.setFontSize(20);
      doc.setTextColor(44, 62, 80);
      doc.text('Payment Receipt', 105, 20, { align: 'center' });
      
      // Add payment confirmation logo
      doc.setFillColor(237, 247, 237);
      doc.circle(105, 40, 10, 'F');
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1);
      doc.circle(105, 40, 10, 'S');
      
      // Add checkmark in the circle
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1.5);
      doc.line(100, 40, 103, 43);
      doc.line(103, 43, 110, 36);
      
      // Add confirmation text
      doc.setFontSize(14);
      doc.setTextColor(34, 197, 94);
      doc.text('Payment Successful', 105, 60, { align: 'center' });
      
      // Add payment details
      doc.setFontSize(12);
      doc.setTextColor(44, 62, 80);
      doc.text('Payment Details', 20, 75);
      
      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 78, 190, 78);
      
      // Add payment information
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      
      // Ensure transaction date is available
      const transactionDate = paymentDetails.transactionDate || new Date().toISOString();
      
      const details = [
        ['Order ID:', paymentDetails.orderId || 'N/A'],
        ['Payment ID:', paymentDetails.paymentId || 'N/A'],
        ['Amount:', `LKR ${paymentDetails.amount?.toFixed(2) || '0.00'}`],
        ['Status:', paymentDetails.status || 'Confirmed'],
        ['Payment Method:', paymentDetails.paymentMethod || 'PayHere'],
        ['Transaction Date:', formatDate(transactionDate)]
      ];
      
      let yPos = 90;
      details.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(label, 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(value, 70, yPos);
        yPos += 10;
      });
      
      // Add order items if available
      if (paymentDetails.items && paymentDetails.items.length > 0) {
        yPos += 10;
        doc.setFont(undefined, 'bold');
        doc.text('Order Summary', 20, yPos);
        yPos += 3;
        
        // Add horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        yPos += 10;
        
        // Prepare table data
        const tableColumn = ['Item', 'Price (LKR)'];
        const tableRows = [];
        
        paymentDetails.items.forEach(item => {
          const itemData = [
            item.name,
            item.price?.toFixed(2) || '0.00'
          ];
          tableRows.push(itemData);
        });
        
        // Add total row
        tableRows.push(['Total', paymentDetails.amount?.toFixed(2) || '0.00']);
        
        // Add items table
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: yPos,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
          margin: { top: 10, bottom: 10 }
        });
      }
      
      // Add footer with customer support info
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('For any assistance, please contact our customer support at support@example.com', 105, pageHeight - 20, { align: 'center' });
      doc.text(`Generated on ${formatDate(new Date())}`, 105, pageHeight - 15, { align: 'center' });
      
      // Save the PDF
      doc.save(`payment-receipt-${paymentDetails.orderId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again later.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-6 bg-green-100 rounded-full">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Payment Confirmed</h1>
          <p className="mt-2 text-lg text-gray-600">Your payment has been successfully processed through PayHere</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <svg className="w-12 h-12 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-lg text-gray-600">Verifying payment details...</span>
          </div>
        ) : error ? (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
            <p className="mt-2">If you've completed payment, please save your order ID for reference.</p>
          </div>
        ) : paymentDetails && (
          <>
            <div ref={receiptRef} className="p-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-gray-700">Payment Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="font-medium text-gray-800">{paymentDetails.orderId}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Payment ID</span>
                  <span className="font-medium text-gray-800">{paymentDetails.paymentId || 'N/A'}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Amount Paid</span>
                  <span className="text-lg font-semibold text-gray-800">LKR {paymentDetails.amount?.toFixed(2)}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {paymentDetails.status || 'Confirmed'}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Payment Method</span>
                  <span className="font-medium text-gray-800">{paymentDetails.paymentMethod || 'PayHere'}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Transaction Date</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(paymentDetails.transactionDate || new Date().toISOString())}
                  </span>
                </div>
                
                {paymentDetails.customerEmail && (
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-sm text-gray-500">Confirmation sent to</span>
                    <span className="font-medium text-gray-800">{paymentDetails.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {paymentDetails.items && paymentDetails.items.length > 0 && (
              <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">Order Summary</h2>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Item</th>
                        <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentDetails.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-800">LKR {item.price?.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">Total</td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-gray-800">LKR {paymentDetails.amount?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col items-center justify-center gap-4 mt-8 md:flex-row">
          <button
            onClick={() => navigate('/orders')}
            className="w-full px-6 py-3 font-medium text-white transition duration-300 bg-[#FC8A06] rounded-md md:w-auto hover:bg-[#FC8A06] "
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/restaurants')}
            className="w-full px-6 py-3 font-medium text-gray-100 transition duration-300 bg-gray-500 border border-gray-500 rounded-md md:w-auto hover:bg-gray-800"
          >
            Continue Shopping
          </button>
          {paymentDetails && (
            <button
              onClick={generatePDF}
              disabled={generatingPdf}
              className="flex items-center justify-center w-full px-6 py-3 font-medium text-gray-100 transition duration-300 bg-gray-500 border border-gray-500 rounded-md md:w-auto hover:bg-gray-800 disabled:opacity-70"
            >
              {generatingPdf ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Download Receipt
                </>
              )}
            </button>
          )}
        </div>
        
        {paymentDetails && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
              <br />
              For any assistance, please contact our customer support at <span className="font-medium">support@example.com</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;