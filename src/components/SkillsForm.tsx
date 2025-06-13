
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from 'lucide-react';

interface Skill {
  id: string;
  category: string;
  items: string[];
}

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [newSkillInputs, setNewSkillInputs] = useState<{[key: string]: string}>({});

  const addSkillCategory = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      category: '',
      items: []
    };
    onChange([...data, newSkill]);
  };

  const updateSkillCategory = (id: string, category: string) => {
    onChange(data.map(skill => 
      skill.id === id ? { ...skill, category } : skill
    ));
  };

  const addSkillItem = (id: string) => {
    const newItem = newSkillInputs[id]?.trim();
    if (!newItem) return;

    onChange(data.map(skill => 
      skill.id === id ? { ...skill, items: [...skill.items, newItem] } : skill
    ));

    setNewSkillInputs(prev => ({ ...prev, [id]: '' }));
  };

  const removeSkillItem = (categoryId: string, itemIndex: number) => {
    onChange(data.map(skill => 
      skill.id === categoryId 
        ? { ...skill, items: skill.items.filter((_, index) => index !== itemIndex) }
        : skill
    ));
  };

  const removeSkillCategory = (id: string) => {
    onChange(data.filter(skill => skill.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkillItem(categoryId);
    }
  };

  return (
    <div className="space-y-4">
      {data.map((skillCategory, index) => (
        <Card key={skillCategory.id} className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Skill Category {index + 1}
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSkillCategory(skillCategory.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Category Name *</Label>
              <Input
                value={skillCategory.category}
                onChange={(e) => updateSkillCategory(skillCategory.id, e.target.value)}
                placeholder="e.g., Programming Languages, Soft Skills"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Skills</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newSkillInputs[skillCategory.id] || ''}
                  onChange={(e) => setNewSkillInputs(prev => ({ 
                    ...prev, 
                    [skillCategory.id]: e.target.value 
                  }))}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => handleKeyPress(e, skillCategory.id)}
                />
                <Button
                  type="button"
                  onClick={() => addSkillItem(skillCategory.id)}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {skillCategory.items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((item, itemIndex) => (
                  <Badge
                    key={itemIndex}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {item}
                    <button
                      onClick={() => removeSkillItem(skillCategory.id, itemIndex)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addSkillCategory}
        className="w-full border-dashed border-2 py-6 text-gray-600 hover:text-gray-800"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Skill Category
      </Button>
    </div>
  );
};

export default SkillsForm;
