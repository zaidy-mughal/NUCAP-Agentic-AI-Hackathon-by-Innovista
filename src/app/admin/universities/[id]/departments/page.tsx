'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, PlusCircle } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  degree: string;
  duration: string;
  seats: number | null;
  category: string;
}

export default function AddDepartmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const universityName = searchParams.get('name') || 'University';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    duration: '',
    seats: '',
    category: ''
  });

  // Fetch existing departments
  useEffect(() => {
    fetchDepartments();
  }, [params.id]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`/api/universities/${params.id}/departments`);
      const data = await response.json();
      
      if (data.success) {
        setDepartments(data.departments);
      } else {
        setError(data.error || 'Failed to fetch departments');
      }
    } catch (err) {
      setError('Failed to fetch departments');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`/api/universities/${params.id}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          seats: formData.seats ? parseInt(formData.seats) : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create department');
      }

      setSuccess(true);
      setFormData({
        name: '',
        degree: '',
        duration: '',
        seats: '',
        category: ''
      });
      
      // Refresh departments list
      fetchDepartments();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department');
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
            <Link href="/admin/universities">
              <Button variant="ghost">Universities</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/universities" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Universities
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Departments</h1>
          <p className="text-gray-600">Add departments to {universityName}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Department Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add New Department</CardTitle>
                <CardDescription>
                  Create a new department for {universityName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>Department created successfully!</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="degree">Degree Type</Label>
                    <Select value={formData.degree} onValueChange={(value) => handleChange('degree', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BS">BS (Bachelor of Science)</SelectItem>
                        <SelectItem value="BE">BE (Bachelor of Engineering)</SelectItem>
                        <SelectItem value="BBA">BBA (Bachelor of Business Administration)</SelectItem>
                        <SelectItem value="MBBS">MBBS (Bachelor of Medicine)</SelectItem>
                        <SelectItem value="LLB">LLB (Bachelor of Laws)</SelectItem>
                        <SelectItem value="BA">BA (Bachelor of Arts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      placeholder="e.g., 4 Years"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="seats">Seats (Optional)</Label>
                    <Input
                      id="seats"
                      type="number"
                      value={formData.seats}
                      onChange={(e) => handleChange('seats', e.target.value)}
                      placeholder="e.g., 60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Law">Law</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Department
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Existing Departments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Existing Departments</CardTitle>
                <CardDescription>
                  {departments.length} departments in {universityName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {departments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No departments found for this university.</p>
                    <p className="mt-2">Add your first department using the form.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {departments.map((dept) => (
                      <div key={dept.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{dept.name}</h3>
                            <p className="text-gray-600">{dept.degree} • {dept.duration}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {dept.category}
                              </span>
                              {dept.seats && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {dept.seats} Seats
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}