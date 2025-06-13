
import { CVData } from '@/pages/Index';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CVPreviewProps {
  cvData: CVData;
}

const CVPreview = ({ cvData }: CVPreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white text-gray-800 max-w-4xl mx-auto shadow-lg" style={{ minHeight: '800px' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">
          {cvData.personalInfo.fullName || 'Your Name'}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm">
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {cvData.personalInfo.email}
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {cvData.personalInfo.phone}
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {cvData.personalInfo.location}
            </div>
          )}
          {cvData.personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              {cvData.personalInfo.linkedIn}
            </div>
          )}
          {cvData.personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {cvData.personalInfo.portfolio}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Professional Summary */}
        {cvData.personalInfo.summary && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
              Education
            </h2>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                      <p className="text-blue-600">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvData.skills.map((skillCategory) => (
                <div key={skillCategory.id}>
                  <h3 className="font-semibold text-gray-800 mb-2">{skillCategory.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVPreview;
