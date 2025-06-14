
import { useRef, useImperativeHandle, forwardRef } from 'react';
import { CVData } from '@/pages/Index';

interface PDFGeneratorProps {
  cvData: CVData;
}

export interface PDFGeneratorRef {
  generatePDF: () => void;
}

const PDFGenerator = forwardRef<PDFGeneratorRef, PDFGeneratorProps>(({ cvData }, ref) => {
  const generatePDF = async () => {
    try {
      // Import jsPDF dynamically
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
          // Check if we need a new page
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    generatePDF
  }));

  return null;
});

PDFGenerator.displayName = 'PDFGenerator';

export default PDFGenerator;
