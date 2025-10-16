'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface University {
  id: string;
  name: string;
  shortName: string;
  departments: Department[];
}

interface Department {
  id: string;
  name: string;
  degree: string;
}

interface MeritEntry {
  id?: string;
  universityId: string;
  departmentId: string;
  year: number;
  admissionCycle: string;
  meritType: string;
  closingMerit: number;
  aggregatePercentage?: number;
  matricPercentage?: number;
  interPercentage?: number;
  testScore?: number;
  publishedDate?: string;
}

export default function AdminMeritPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [meritEntries, setMeritEntries] = useState<MeritEntry[]>([
    {
      universityId: '',
      departmentId: '',
      year: new Date().getFullYear(),
      admissionCycle: 'Fall',
      meritType: 'Final',
      closingMerit: 0
    }
  ]);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/admin/universities');
      const data = await response.json();
      if (data.success) {
        setUniversities(data.universities);
      } else {
        // Handle authentication error
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        setError(data.error || 'Failed to fetch universities');
      }
    } catch (err) {
      setError('Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityChange = (universityId: string) => {
    setSelectedUniversity(universityId);
    
    // Update all merit entries with the selected university
    setMeritEntries(prev => prev.map(entry => ({
      ...entry,
      universityId
    })));
    
    // Get departments for the selected university
    const university = universities.find(uni => uni.id === universityId);
    if (university) {
      setDepartments(university.departments);
    }
  };

  const addMeritEntry = () => {
    setMeritEntries(prev => [
      ...prev,
      {
        universityId: selectedUniversity,
        departmentId: '',
        year: new Date().getFullYear(),
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 0
      }
    ]);
  };

  const removeMeritEntry = (index: number) => {
    if (meritEntries.length > 1) {
      setMeritEntries(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateMeritEntry = (index: number, field: keyof MeritEntry, value: string | number) => {
    setMeritEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/merit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meritEntries),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle authentication error
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error(data.error || 'Failed to create merit lists');
      }

      setSuccess(true);
      
      // Reset form after a short delay
      setTimeout(() => {
        setMeritEntries([
          {
            universityId: selectedUniversity,
            departmentId: '',
            year: new Date().getFullYear(),
            admissionCycle: 'Fall',
            meritType: 'Final',
            closingMerit: 0
          }
        ]);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create merit lists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">NUCAP Admin</span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add Merit Lists</h1>
          <p className="text-gray-600">Create new merit lists for university departments</p>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Merit List Details</CardTitle>
            <CardDescription>
              Add closing merits and related information for university departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                Merit lists created successfully!
              </div>
            )}

            <div className="mb-6">
              <Label>Select University</Label>
              <Select value={selectedUniversity} onValueChange={handleUniversityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name} ({uni.shortName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUniversity && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {meritEntries.map((entry, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Merit Entry #{index + 1}</h3>
                        {meritEntries.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMeritEntry(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`department-${index}`}>Department</Label>
                          <Select 
                            value={entry.departmentId} 
                            onValueChange={(value) => updateMeritEntry(index, 'departmentId', value)}
                          >
                            <SelectTrigger id={`department-${index}`}>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name} ({dept.degree})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`year-${index}`}>Year</Label>
                          <Input
                            id={`year-${index}`}
                            type="number"
                            value={entry.year}
                            onChange={(e) => updateMeritEntry(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                            min="2020"
                            max="2030"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`cycle-${index}`}>Admission Cycle</Label>
                          <Select 
                            value={entry.admissionCycle} 
                            onValueChange={(value) => updateMeritEntry(index, 'admissionCycle', value)}
                          >
                            <SelectTrigger id={`cycle-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fall">Fall</SelectItem>
                              <SelectItem value="Spring">Spring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`meritType-${index}`}>Merit Type</Label>
                          <Select 
                            value={entry.meritType} 
                            onValueChange={(value) => updateMeritEntry(index, 'meritType', value)}
                          >
                            <SelectTrigger id={`meritType-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1st">1st Merit List</SelectItem>
                              <SelectItem value="2nd">2nd Merit List</SelectItem>
                              <SelectItem value="3rd">3rd Merit List</SelectItem>
                              <SelectItem value="Final">Final Merit List</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`closingMerit-${index}`}>Closing Merit (%)</Label>
                          <Input
                            id={`closingMerit-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={entry.closingMerit}
                            onChange={(e) => updateMeritEntry(index, 'closingMerit', parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`publishedDate-${index}`}>Published Date (Optional)</Label>
                          <Input
                            id={`publishedDate-${index}`}
                            type="date"
                            value={entry.publishedDate || ''}
                            onChange={(e) => updateMeritEntry(index, 'publishedDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex flex-wrap gap-4">
                  <Button type="button" variant="outline" onClick={addMeritEntry}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Entry
                  </Button>
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Merit Lists'}
                  </Button>
                  
                  <Link href="/admin">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            )}

            {!selectedUniversity && (
              <div className="text-center py-8 text-gray-500">
                Please select a university to add merit lists
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
