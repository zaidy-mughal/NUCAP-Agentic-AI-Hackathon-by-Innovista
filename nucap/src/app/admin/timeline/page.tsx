'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Calendar, Clock } from 'lucide-react';

interface University {
  id: string;
  name: string;
  shortName: string;
}

interface TimelineEntry {
  universityId: string;
  year: number;
  cycle: string;
  applicationStart?: string;
  applicationDeadline?: string;
  testDate?: string;
  firstMeritList?: string;
  secondMeritList?: string;
  thirdMeritList?: string;
  finalMeritList?: string;
}

export default function AdminTimelinePage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<TimelineEntry>({
    universityId: '',
    year: new Date().getFullYear(),
    cycle: 'Fall'
  });

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

  const handleChange = (field: keyof TimelineEntry, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/add-deadline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle authentication error
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error(data.error || 'Failed to save timeline');
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        universityId: '',
        year: new Date().getFullYear(),
        cycle: 'Fall'
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save timeline');
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
          <h1 className="text-3xl font-bold text-gray-900">Update Admission Timeline</h1>
          <p className="text-gray-600">Set important dates for university admission processes</p>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline Details
            </CardTitle>
            <CardDescription>
              Enter important dates for university admission cycles
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
                Timeline saved successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="university">University</Label>
                  <Select 
                    value={formData.universityId} 
                    onValueChange={(value) => handleChange('universityId', value)}
                  >
                    <SelectTrigger id="university">
                      <SelectValue placeholder="Select university" />
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

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                    min="2020"
                    max="2030"
                  />
                </div>

                <div>
                  <Label htmlFor="cycle">Admission Cycle</Label>
                  <Select 
                    value={formData.cycle} 
                    onValueChange={(value) => handleChange('cycle', value)}
                  >
                    <SelectTrigger id="cycle">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicationStart">Application Start Date</Label>
                  <Input
                    id="applicationStart"
                    type="date"
                    value={formData.applicationStart || ''}
                    onChange={(e) => handleChange('applicationStart', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline || ''}
                    onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="testDate">Test Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    value={formData.testDate || ''}
                    onChange={(e) => handleChange('testDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Merit List Dates
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstMeritList">1st Merit List</Label>
                    <Input
                      id="firstMeritList"
                      type="date"
                      value={formData.firstMeritList || ''}
                      onChange={(e) => handleChange('firstMeritList', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondMeritList">2nd Merit List</Label>
                    <Input
                      id="secondMeritList"
                      type="date"
                      value={formData.secondMeritList || ''}
                      onChange={(e) => handleChange('secondMeritList', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="thirdMeritList">3rd Merit List</Label>
                    <Input
                      id="thirdMeritList"
                      type="date"
                      value={formData.thirdMeritList || ''}
                      onChange={(e) => handleChange('thirdMeritList', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="finalMeritList">Final Merit List</Label>
                    <Input
                      id="finalMeritList"
                      type="date"
                      value={formData.finalMeritList || ''}
                      onChange={(e) => handleChange('finalMeritList', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Timeline'}
                </Button>
                <Link href="/admin">
                  <Button variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}