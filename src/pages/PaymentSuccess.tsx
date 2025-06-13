
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState('');

  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setError('Payment reference not found');
      setIsVerifying(false);
      return;
    }

    verifyPayment();
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const { data, error: functionError } = await supabase.functions.invoke('verify-payment', {
        body: { reference },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      setVerificationResult(data);
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Failed to verify payment');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadPDF = () => {
    // Get CV data from localStorage (saved during form filling)
    const savedCVData = localStorage.getItem('cvData');
    if (savedCVData) {
      const cvData = JSON.parse(savedCVData);
      // Trigger PDF generation (this would be implemented in the main app)
      window.dispatchEvent(new CustomEvent('downloadPDF', { detail: cvData }));
    }
    
    // Navigate back to main page
    navigate('/');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !verificationResult?.verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto p-8">
            <Alert variant="destructive">
              <AlertDescription>
                {error || 'Payment verification failed. Please contact support.'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CV Maker
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your payment. You can now download your professional CV.
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-green-700">
              <strong>Payment Reference:</strong> {verificationResult.data.reference}
            </p>
            <p className="text-sm text-green-700">
              <strong>Amount:</strong> ₵{verificationResult.data.amount}
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleDownloadPDF}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Your CV
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CV Maker
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
