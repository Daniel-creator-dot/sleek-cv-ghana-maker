
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
      const lineHeight = 7;
      
      // Helper function to add text with word wrapping and better formatting
      const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, color: number[] = [0, 0, 0], font: string = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', font as any);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return lines.length * lineHeight;
      };

      // Create beautiful gradient header background
      doc.setFillColor(59, 130, 246); // Blue color
      doc.rect(0, 0, pageWidth, 70, 'F');
      
      // Add purple gradient overlay
      for (let i = 0; i < 20; i++) {
        const alpha = i / 20;
        const r = Math.round(59 + (147 - 59) * alpha);
        const g = Math.round(130 + (51 - 130) * alpha);
        const b = Math.round(246 + (234 - 246) * alpha);
        doc.setFillColor(r, g, b);
        doc.rect(pageWidth * 0.6 + i, 0, 2, 70, 'F');
      }

      yPosition = 25;

      // Header with name (large, bold, white text)
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(cvData.personalInfo.fullName || 'Your Name', margin, yPosition);
      yPosition += 20;

      // Contact information in a professional layout
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const contactItems = [
        { icon: '✉', text: cvData.personalInfo.email, width: 0 },
        { icon: '📞', text: cvData.personalInfo.phone, width: 0 },
        { icon: '📍', text: cvData.personalInfo.location, width: 0 },
        { icon: '💼', text: cvData.personalInfo.linkedIn, width: 0 },
        { icon: '🌐', text: cvData.personalInfo.portfolio, width: 0 }
      ].filter(item => item.text);

      // Calculate widths and arrange in two rows if needed
      contactItems.forEach(item => {
        item.width = doc.getTextWidth(`${item.icon} ${item.text}`);
      });

      let xOffset = margin;
      let currentRowWidth = 0;
      const maxRowWidth = pageWidth - 2 * margin;

      contactItems.forEach((item, index) => {
        if (currentRowWidth + item.width + 20 > maxRowWidth && index > 0) {
          yPosition += 8;
          xOffset = margin;
          currentRowWidth = 0;
        }
        
        doc.setTextColor(255, 255, 255);
        doc.text(`${item.icon} ${item.text}`, xOffset, yPosition);
        xOffset += item.width + 20;
        currentRowWidth += item.width + 20;
      });

      yPosition = 85; // Move past the header with proper spacing

      // Professional Summary Section
      if (cvData.personalInfo.summary) {
        // Section header with modern styling
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        
        // Add decorative underline
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1.2);
        doc.line(margin, yPosition + 3, margin + 80, yPosition + 3);
        
        yPosition += 15;
        
        // Summary text with proper formatting
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const summaryHeight = addText(cvData.personalInfo.summary, margin, yPosition, pageWidth - 2 * margin, 11, [60, 60, 60]);
        yPosition += summaryHeight + 12;
      }

      // Professional Experience Section
      if (cvData.experience.length > 0) {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          yPosition = 25;
        }

        // Section header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
        
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1.2);
        doc.line(margin, yPosition + 3, margin + 90, yPosition + 3);
        
        yPosition += 15;

        cvData.experience.forEach((exp, index) => {
          if (yPosition > pageHeight - 60) {
            doc.addPage();
            yPosition = 25;
          }

          // Add subtle background for each experience entry
          doc.setFillColor(248, 250, 252);
          doc.rect(margin - 5, yPosition - 8, pageWidth - 2 * margin + 10, 35, 'F');

          // Position title (larger, bold)
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 30, 30);
          doc.text(exp.position, margin, yPosition);
          yPosition += 9;

          // Company name and date range on same line
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(59, 130, 246);
          doc.text(exp.company, margin, yPosition);
          
          const dateRange = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
          const dateWidth = doc.getTextWidth(dateRange);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          doc.text(dateRange, pageWidth - margin - dateWidth, yPosition);
          yPosition += 10;

          // Description with proper formatting
          if (exp.description) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(70, 70, 70);
            doc.setFontSize(10);
            const descHeight = addText(exp.description, margin, yPosition, pageWidth - 2 * margin, 10, [70, 70, 70]);
            yPosition += descHeight + 5;
          }
          
          yPosition += 10; // Extra spacing between entries
        });
      }

      // Education Section
      if (cvData.education.length > 0) {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          yPosition = 25;
        }

        // Section header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('EDUCATION', margin, yPosition);
        
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1.2);
        doc.line(margin, yPosition + 3, margin + 45, yPosition + 3);
        
        yPosition += 15;

        cvData.education.forEach((edu) => {
          if (yPosition > pageHeight - 50) {
            doc.addPage();
            yPosition = 25;
          }

          // Add subtle background
          doc.setFillColor(248, 250, 252);
          doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 25, 'F');

          // Degree and field
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 30, 30);
          doc.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
          yPosition += 8;

          // Institution and dates
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(59, 130, 246);
          doc.text(edu.institution, margin, yPosition);
          
          const dateRange = `${edu.startDate} - ${edu.endDate}`;
          const dateWidth = doc.getTextWidth(dateRange);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          doc.text(dateRange, pageWidth - margin - dateWidth, yPosition);
          yPosition += 7;

          // GPA if available
          if (edu.gpa) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(70, 70, 70);
            doc.setFontSize(10);
            doc.text(`GPA: ${edu.gpa}`, margin, yPosition);
            yPosition += 6;
          }
          yPosition += 12;
        });
      }

      // Skills Section with beautiful layout
      if (cvData.skills.length > 0) {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          yPosition = 25;
        }

        // Section header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('SKILLS', margin, yPosition);
        
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(1.2);
        doc.line(margin, yPosition + 3, margin + 30, yPosition + 3);
        
        yPosition += 15;

        cvData.skills.forEach((skillCategory) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 25;
          }

          // Category title
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 30, 30);
          doc.text(skillCategory.category, margin, yPosition);
          yPosition += 10;

          // Create beautiful skill tags
          let xPos = margin;
          const tagHeight = 8;
          const tagPadding = 4;
          const tagSpacing = 6;
          
          skillCategory.items.forEach((skill, skillIndex) => {
            doc.setFontSize(9);
            const skillWidth = doc.getTextWidth(skill) + (tagPadding * 2);
            
            // Check if we need to wrap to next line
            if (xPos + skillWidth > pageWidth - margin) {
              yPosition += tagHeight + 4;
              xPos = margin;
            }
            
            // Draw skill tag with rounded corners effect
            const colors = [
              [219, 234, 254], // Light blue
              [233, 213, 255], // Light purple
              [220, 252, 231], // Light green
              [254, 240, 138], // Light yellow
              [254, 226, 226]  // Light red
            ];
            const colorIndex = skillIndex % colors.length;
            
            doc.setFillColor(colors[colorIndex][0], colors[colorIndex][1], colors[colorIndex][2]);
            doc.roundedRect(xPos, yPosition - 6, skillWidth, tagHeight, 2, 2, 'F');
            
            // Add subtle border
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(0.2);
            doc.roundedRect(xPos, yPosition - 6, skillWidth, tagHeight, 2, 2, 'S');
            
            // Add skill text
            const textColors = [
              [30, 64, 175],   // Dark blue
              [109, 40, 217],  // Dark purple
              [5, 150, 105],   // Dark green
              [180, 83, 9],    // Dark yellow/orange
              [220, 38, 127]   // Dark pink
            ];
            doc.setTextColor(textColors[colorIndex][0], textColors[colorIndex][1], textColors[colorIndex][2]);
            doc.setFont('helvetica', 'normal');
            doc.text(skill, xPos + tagPadding, yPosition - 1);
            
            xPos += skillWidth + tagSpacing;
          });
          
          yPosition += tagHeight + 8;
        });
      }

      // Add a subtle footer
      const footerY = pageHeight - 15;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated with Professional CV Maker', pageWidth / 2, footerY, { align: 'center' });

      // Save the PDF with a professional filename
      const fileName = `${cvData.personalInfo.fullName || 'Professional_CV'}_Resume.pdf`;
      doc.save(fileName);
      
      console.log('Beautiful PDF generated successfully:', fileName);
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
