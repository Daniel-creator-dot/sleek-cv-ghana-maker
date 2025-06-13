
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationForm = ({ data, onChange }: EducationFormProps) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    onChange([...data, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      {data.map((education, index) => (
        <Card key={education.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Education {index + 1}
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(education.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Institution *</Label>
                <Input
                  value={education.institution}
                  onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                  placeholder="University of Ghana"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Degree *</Label>
                <Input
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Field of Study *</Label>
              <Input
                value={education.field}
                onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                placeholder="Computer Science"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="month"
                  value={education.startDate}
                  onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input
                  type="month"
                  value={education.endDate}
                  onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa || ''}
                  onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full border-dashed border-2 py-6 text-gray-600 hover:text-gray-800"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};

export default EducationForm;
