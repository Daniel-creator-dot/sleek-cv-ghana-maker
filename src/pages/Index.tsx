
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import Header from '@/components/Header';
import PaymentModal from '@/components/PaymentModal';
import PDFGenerator from '@/components/PDFGenerator';

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    summary: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
}

const Index = () => {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: []
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const updateCVData = (section: keyof CVData, data: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Save CV data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  // Listen for PDF download event from payment success page
  useEffect(() => {
    const handleDownloadPDF = (event: any) => {
      const pdfGenerator = document.querySelector('button') as HTMLButtonElement;
      if (pdfGenerator) {
        pdfGenerator.click();
      }
    };

    window.addEventListener('downloadPDF', handleDownloadPDF);
    return () => window.removeEventListener('downloadPDF', handleDownloadPDF);
  }, []);

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    // The PDF download will be handled by the PaymentSuccess page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CVForm cvData={cvData} updateCVData={updateCVData} />
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <Card className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Auto-updating</span>
                </div>
              </div>
              <CVPreview cvData={cvData} />
            </Card>
          </div>
        </div>

        {/* Action Section */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border-0">
            <h3 className="text-2xl font-bold mb-4">Ready to Download Your Professional CV?</h3>
            <p className="text-blue-100 mb-6">Get your beautifully formatted CV as a high-quality PDF for just ₵3.99</p>
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
            >
              Download PDF - ₵3.99
            </button>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cvData={cvData}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <PDFGenerator cvData={cvData} />
    </div>
  );
};

export default Index;
