
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
      let yPosition = 0;
      const margin = 20;
      const lineHeight = 6;
      
      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, color: number[] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return lines.length * lineHeight;
      };

      // Create gradient-like header background
      doc.setFillColor(59, 130, 246); // Blue color
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      // Add a purple gradient effect
      doc.setFillColor(147, 51, 234); // Purple color
      doc.rect(pageWidth * 0.7, 0, pageWidth * 0.3, 60, 'F');

      yPosition = 20;

      // Header with name (white text on colored background)
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // White text
      doc.text(cvData.personalInfo.fullName || 'Your Name', margin, yPosition);
      yPosition += 15;

      // Contact information (white text)
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const contactItems = [
        { icon: '✉', text: cvData.personalInfo.email },
        { icon: '📞', text: cvData.personalInfo.phone },
        { icon: '📍', text: cvData.personalInfo.location },
        { icon: '💼', text: cvData.personalInfo.linkedIn },
        { icon: '🌐', text: cvData.personalInfo.portfolio }
      ].filter(item => item.text);

      let xOffset = margin;
      contactItems.forEach((item, index) => {
        if (xOffset + 40 > pageWidth - margin) {
          yPosition += 8;
          xOffset = margin;
        }
        doc.text(`${item.icon} ${item.text}`, xOffset, yPosition);
        xOffset += doc.getTextWidth(`${item.icon} ${item.text}`) + 15;
      });

      yPosition = 75; // Move past the header

      // Professional Summary with styled header
      if (cvData.personalInfo.summary) {
        // Section header with underline
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246); // Blue color
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        
        // Add underline
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition + 2, margin + 60, yPosition + 2);
        
        yPosition += 12;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99); // Gray color
        yPosition += addText(cvData.personalInfo.summary, margin, yPosition, pageWidth - 2 * margin, 11, [75, 85, 99]);
        yPosition += 10;
      }

      // Experience Section
      if (cvData.experience.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        // Section header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
        
        // Add underline
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition + 2, margin + 70, yPosition + 2);
        
        yPosition += 12;

        cvData.experience.forEach((exp) => {
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 20;
          }

          // Position title
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(exp.position, margin, yPosition);
          yPosition += 8;

          // Company and date
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(59, 130, 246);
          doc.text(exp.company, margin, yPosition);
          
          const dateRange = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
          const dateWidth = doc.getTextWidth(dateRange);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(107, 114, 128);
          doc.text(dateRange, pageWidth - margin - dateWidth, yPosition);
          yPosition += 8;

          if (exp.description) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(75, 85, 99);
            yPosition += addText(exp.description, margin, yPosition, pageWidth - 2 * margin, 10, [75, 85, 99]);
          }
          yPosition += 8;
        });
      }

      // Education Section
      if (cvData.education.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        // Section header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('EDUCATION', margin, yPosition);
        
        // Add underline
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition + 2, margin + 35, yPosition + 2);
        
        yPosition += 12;

        cvData.education.forEach((edu) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
          yPosition += 7;

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(59, 130, 246);
          doc.text(edu.institution, margin, yPosition);
          
          const dateRange = `${edu.startDate} - ${edu.endDate}`;
          const dateWidth = doc.getTextWidth(dateRange);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(107, 114, 128);
          doc.text(dateRange, pageWidth - margin - dateWidth, yPosition);
          yPosition += 6;

          if (edu.gpa) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(75, 85, 99);
            doc.text(`GPA: ${edu.gpa}`, margin, yPosition);
            yPosition += 6;
          }
          yPosition += 6;
        });
      }

      // Skills Section
      if (cvData.skills.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        // Section header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('SKILLS', margin, yPosition);
        
        // Add underline
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition + 2, margin + 25, yPosition + 2);
        
        yPosition += 12;

        cvData.skills.forEach((skillCategory) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(skillCategory.category + ':', margin, yPosition);
          yPosition += 7;

          // Create skill tags visually
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          let xPos = margin;
          const tagHeight = 6;
          const tagPadding = 3;
          
          skillCategory.items.forEach((skill) => {
            const skillWidth = doc.getTextWidth(skill) + (tagPadding * 2);
            
            if (xPos + skillWidth > pageWidth - margin) {
              yPosition += tagHeight + 3;
              xPos = margin;
            }
            
            // Draw skill tag background
            doc.setFillColor(219, 234, 254); // Light blue background
            doc.roundedRect(xPos, yPosition - 4, skillWidth, tagHeight, 2, 2, 'F');
            
            // Add skill text
            doc.setTextColor(30, 64, 175); // Dark blue text
            doc.text(skill, xPos + tagPadding, yPosition);
            
            xPos += skillWidth + 5;
          });
          
          yPosition += tagHeight + 5;
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
