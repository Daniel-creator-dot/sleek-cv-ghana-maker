
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, GraduationCap, Briefcase, Code, Plus } from 'lucide-react';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import EducationForm from '@/components/EducationForm';
import ExperienceForm from '@/components/ExperienceForm';
import SkillsForm from '@/components/SkillsForm';
import { CVData } from '@/pages/Index';

interface CVFormProps {
  cvData: CVData;
  updateCVData: (section: keyof CVData, data: any) => void;
}

const CVForm = ({ cvData, updateCVData }: CVFormProps) => {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, description: 'Basic contact information' },
    { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic background' },
    { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history' },
    { id: 'skills', label: 'Skills', icon: Code, description: 'Technical & soft skills' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Build Your Professional CV</h2>
        <p className="text-gray-600">Fill in your information and watch your CV come to life</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex flex-col items-center gap-1 py-3"
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {tab.id === 'personal' && (
                  <PersonalInfoForm 
                    data={cvData.personalInfo} 
                    onChange={(data) => updateCVData('personalInfo', data)} 
                  />
                )}
                {tab.id === 'education' && (
                  <EducationForm 
                    data={cvData.education} 
                    onChange={(data) => updateCVData('education', data)} 
                  />
                )}
                {tab.id === 'experience' && (
                  <ExperienceForm 
                    data={cvData.experience} 
                    onChange={(data) => updateCVData('experience', data)} 
                  />
                )}
                {tab.id === 'skills' && (
                  <SkillsForm 
                    data={cvData.skills} 
                    onChange={(data) => updateCVData('skills', data)} 
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CVForm;
