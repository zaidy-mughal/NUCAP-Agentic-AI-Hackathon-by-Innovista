'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NewUniversityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    location: '',
    website: '',
    testRequired: 'None',
    isActive: true
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // For now, we'll use a simple approach to add a university
      // In a real implementation, you would create an API endpoint for this
      alert('University creation would be implemented here. For now, this is a demo.');
      setSuccess(true);
      
      // Redirect to universities list after a short delay
      setTimeout(() => {
        router.push('/admin/universities');
      }, 1000);
    } catch (err) {
      setError('Failed to create university');
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
          <h1 className="text-3xl font-bold text-gray-900">Add New University</h1>
          <p className="text-gray-600">Create a new university entry in the system</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>University Details</CardTitle>
            <CardDescription>
              Enter the basic information for the new university
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
                University created successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">University Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., National University of Sciences & Technology"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  value={formData.shortName}
                  onChange={(e) => handleChange('shortName', e.target.value)}
                  placeholder="e.g., NUST"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Islamabad"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="e.g., https://nust.edu.pk"
                  required
                />
              </div>

              <div>
                <Label htmlFor="testRequired">Test Required</Label>
                <Select value={formData.testRequired} onValueChange={(value) => handleChange('testRequired', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="NUST">NUST Entry Test</SelectItem>
                    <SelectItem value="FAST">FAST Entry Test</SelectItem>
                    <SelectItem value="NTS">NTS/GAT Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isActive">Active University</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create University'}
                </Button>
                <Link href="/admin/universities">
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