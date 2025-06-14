
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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    
    try {
      // Get CV data from localStorage
      const savedCVData = localStorage.getItem('cvData');
      if (!savedCVData) {
        throw new Error('CV data not found');
      }

      const cvData = JSON.parse(savedCVData);
      
      // Import jsPDF and generate PDF directly here
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 20;
      const lineHeight = 7;
      
      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return lines.length * lineHeight;
      };

      // Header with name and contact info
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(cvData.personalInfo.fullName || 'Your Name', margin, yPosition);
      yPosition += 12;

      // Contact information
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const contactInfo = [
        cvData.personalInfo.email,
        cvData.personalInfo.phone,
        cvData.personalInfo.location,
        cvData.personalInfo.linkedIn,
        cvData.personalInfo.portfolio
      ].filter(Boolean).join(' | ');
      
      if (contactInfo) {
        yPosition += addText(contactInfo, margin, yPosition, pageWidth - 2 * margin);
        yPosition += 5;
      }

      // Professional Summary
      if (cvData.personalInfo.summary) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        yPosition += lineHeight + 2;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        yPosition += addText(cvData.personalInfo.summary, margin, yPosition, pageWidth - 2 * margin);
        yPosition += 8;
      }

      // Experience Section
      if (cvData.experience.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
        yPosition += lineHeight + 2;

        cvData.experience.forEach((exp) => {
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(exp.position, margin, yPosition);
          yPosition += lineHeight;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          const dateRange = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
          doc.text(`${exp.company} | ${dateRange}`, margin, yPosition);
          yPosition += lineHeight + 2;

          if (exp.description) {
            doc.setFont('helvetica', 'normal');
            yPosition += addText(exp.description, margin, yPosition, pageWidth - 2 * margin);
          }
          yPosition += 5;
        });
      }

      // Education Section
      if (cvData.education.length > 0) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EDUCATION', margin, yPosition);
        yPosition += lineHeight + 2;

        cvData.education.forEach((edu) => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
          yPosition += lineHeight;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          const dateRange = `${edu.startDate} - ${edu.endDate}`;
          doc.text(`${edu.institution} | ${dateRange}`, margin, yPosition);
          yPosition += lineHeight;

          if (edu.gpa) {
            doc.setFont('helvetica', 'normal');
            doc.text(`GPA: ${edu.gpa}`, margin, yPosition);
            yPosition += lineHeight;
          }
          yPosition += 3;
        });
      }

      // Skills Section
      if (cvData.skills.length > 0) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('SKILLS', margin, yPosition);
        yPosition += lineHeight + 2;

        cvData.skills.forEach((skillCategory) => {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(skillCategory.category + ':', margin, yPosition);
          yPosition += lineHeight;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const skillsText = skillCategory.items.join(', ');
          yPosition += addText(skillsText, margin, yPosition, pageWidth - 2 * margin);
          yPosition += 3;
        });
      }

      // Save the PDF
      const fileName = `${cvData.personalInfo.fullName || 'CV'}_Resume.pdf`;
      doc.save(fileName);
      
      console.log('PDF generated successfully:', fileName);
      
      // Wait a bit for the download to start, then navigate
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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
              disabled={isDownloading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Your CV
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full"
              disabled={isDownloading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CV Maker
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
