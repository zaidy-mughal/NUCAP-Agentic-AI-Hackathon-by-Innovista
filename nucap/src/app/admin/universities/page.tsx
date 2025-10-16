'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  website: string;
  testRequired: string;
  isActive: boolean;
  departments: Department[];
}

interface Department {
  id: string;
  name: string;
  degree: string;
  category: string;
}

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <Link href="/admin/universities/new">
              <Button>Add University</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Universities</h1>
          <p className="text-gray-600">Add, edit, or remove universities and their details</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading universities...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>All Universities</CardTitle>
                <CardDescription>
                  {universities.length} universities in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {universities.map((uni) => (
                    <div key={uni.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{uni.name}</h3>
                          <p className="text-gray-600">{uni.shortName} • {uni.location}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {uni.testRequired}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {uni.departments.length} Departments
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/universities/${uni.id}/edit`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                          <Link href={`/admin/universities/${uni.id}/departments`}>
                            <Button variant="outline" size="sm">Departments</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}