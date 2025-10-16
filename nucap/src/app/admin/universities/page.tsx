'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Trash2 } from 'lucide-react';

interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  website: string;
  testRequired: string;
  isActive: boolean;
  _count?: {
    departments: number;
  };
  departments?: Department[];
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string, name: string) => {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone and will also delete all associated departments and data.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/admin/universities?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove university from state
        setUniversities(universities.filter(uni => uni.id !== id));
        // Show success message
        alert('University deleted successfully');
      } else {
        setError(data.error || 'Failed to delete university');
      }
    } catch (err) {
      setError('Failed to delete university');
    } finally {
      setDeletingId(null);
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
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
                              {(uni._count?.departments || uni.departments?.length || 0)} Departments
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/universities/${uni.id}/edit`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                          <Link href={`/admin/universities/${uni.id}/departments?name=${encodeURIComponent(uni.name)}`}>
                            <Button variant="outline" size="sm">Departments</Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(uni.id, uni.name)}
                            disabled={deletingId === uni.id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {deletingId === uni.id ? (
                              <span className="flex items-center">
                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></span>
                                Deleting...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </span>
                            )}
                          </Button>
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