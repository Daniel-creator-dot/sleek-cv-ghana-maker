
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CVData } from '@/pages/Index';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onPaymentSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, cvData, onPaymentSuccess }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!cvData.personalInfo.email || !cvData.personalInfo.fullName) {
      setError('Please fill in your email and full name in the Personal Info section.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { data, error: functionError } = await supabase.functions.invoke('process-payment', {
        body: {
          email: cvData.personalInfo.email,
          fullName: cvData.personalInfo.fullName,
          amount: 3.99,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // Redirect to Paystack payment page
      window.location.href = data.data.authorization_url;
      
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Your Professional CV
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">₵3.99</div>
            <p className="text-gray-600">One-time payment for high-quality PDF download</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">What you'll get:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Professional PDF format</li>
              <li>• ATS-friendly design</li>
              <li>• High-quality download</li>
              <li>• Instant access after payment</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Paystack
                </>
              )}
            </Button>
            
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="w-full"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Secure payment processed by Paystack. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
