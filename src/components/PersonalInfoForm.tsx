
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  summary: string;
}

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoForm = ({ data, onChange }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+233 XX XXX XXXX"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Accra, Ghana"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedIn">LinkedIn Profile</Label>
          <Input
            id="linkedIn"
            value={data.linkedIn || ''}
            onChange={(e) => handleChange('linkedIn', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio Website</Label>
          <Input
            id="portfolio"
            value={data.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="www.johndoe.com"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary *</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a brief professional summary highlighting your key skills and experience..."
          className="mt-1 min-h-[100px]"
        />
        <p className="text-sm text-gray-500 mt-1">
          Tip: Keep it concise and highlight your most relevant achievements
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
