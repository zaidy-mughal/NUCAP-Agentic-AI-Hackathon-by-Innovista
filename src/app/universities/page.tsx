'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, MapPin, Calendar, TrendingUp, Search } from 'lucide-react';

interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  website: string;
  testRequired: string;
  _count: {
    departments: number;
    meritLists: number;
  };
  timelines: Array<{
    applicationDeadline: string | null;
  }>;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities');
      const data = await response.json();
      if (data.success) {
        setUniversities(data.universities);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || uni.location.toLowerCase().includes(filterCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">NUCAP</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Universities
          </h1>
          <p className="text-gray-600">
            Browse through top universities in Pakistan
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="islamabad">Islamabad</SelectItem>
              <SelectItem value="karachi">Karachi</SelectItem>
              <SelectItem value="lahore">Lahore</SelectItem>
              <SelectItem value="peshawar">Peshawar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading universities...</p>
          </div>
        )}

        {/* Universities Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => (
              <Card key={uni.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{uni.shortName}</Badge>
                    <Badge variant="outline">{uni.testRequired}</Badge>
                  </div>
                  <CardTitle className="text-xl">{uni.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {uni.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Departments</span>
                      <span className="font-semibold">{uni._count.departments}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Merit Lists</span>
                      <span className="font-semibold">{uni._count.meritLists}</span>
                    </div>
                    {uni.timelines[0]?.applicationDeadline && (
                      <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(uni.timelines[0].applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="pt-2 flex gap-2">
                      <Link href={`/universities/${uni.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button className="w-full" size="sm">
                          Visit Website
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No universities found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Create your profile and get personalized university recommendations
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

