import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { GraduationCap, TrendingUp, MapPin, Award, ExternalLink } from 'lucide-react';

export default async function MatchesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user and profile with matches
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      studentProfile: {
        include: {
          matches: {
            include: {
              university: true,
              department: true
            },
            orderBy: { matchScore: 'desc' }
          }
        }
      }
    }
  });

  if (!user) {
    redirect('/profile/create');
  }

  if (!user.studentProfile) {
    redirect('/profile/create');
  }

  const matches = user.studentProfile.matches;

  const getChanceColor = (chance: string) => {
    switch (chance) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            <Link href="/universities">
              <Button variant="ghost">Universities</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your University Matches
          </h1>
          <p className="text-gray-600">
            Based on your academic profile and preferences
          </p>
        </div>

        {/* Profile Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Academic Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Matric</div>
                <div className="text-2xl font-bold text-blue-600">
                  {user.studentProfile.matricPercentage.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Inter</div>
                <div className="text-2xl font-bold text-green-600">
                  {user.studentProfile.interPercentage.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Group</div>
                <div className="text-lg font-semibold">
                  {user.studentProfile.interGroup}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Matches</div>
                <div className="text-2xl font-bold text-purple-600">
                  {matches.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Matches */}
        {matches.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Matches Generated Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Click the button below to generate your university matches
              </p>
              <form action="/api/student/generate-matches" method="POST">
                <Button size="lg" type="submit">
                  Generate Matches
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Matches Grid */}
        {matches.length > 0 && (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="text-base">
                          {match.university.shortName}
                        </Badge>
                        <Badge className={`${getChanceColor(match.admissionChance)} border`}>
                          {match.admissionChance} Chance
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {match.department.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-3">
                        {match.department.degree} • {match.department.duration}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        {match.university.location}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Your Merit</div>
                          <div className="text-lg font-bold text-blue-600">
                            {match.estimatedMerit.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Required Merit</div>
                          <div className="text-lg font-bold text-purple-600">
                            {match.requiredMerit.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          match.meritGap >= 0 ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <div className="text-xs text-gray-600 mb-1">Merit Gap</div>
                          <div className={`text-lg font-bold ${
                            match.meritGap >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {match.meritGap > 0 ? '+' : ''}{match.meritGap.toFixed(1)}
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600 mb-1">Match Score</div>
                          <div className="text-lg font-bold text-orange-600">
                            {match.matchScore}/100
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/universities/${match.universityId}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <a 
                          href={match.university.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="gap-2">
                            Apply Now
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-3xl font-bold text-blue-600">
                        {match.matchScore}
                      </div>
                      <div className="text-xs text-gray-500">Match Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh Matches */}
        {matches.length > 0 && (
          <div className="mt-8 text-center">
            <form action="/api/student/generate-matches" method="POST" className="inline-block">
              <Button variant="outline" type="submit">
                <TrendingUp className="h-4 w-4 mr-2" />
                Regenerate Matches
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

