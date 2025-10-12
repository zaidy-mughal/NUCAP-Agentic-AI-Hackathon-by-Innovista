import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Bell,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user and profile
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
            orderBy: { matchScore: 'desc' },
            take: 5
          }
        }
      }
    }
  });

  if (!user) {
    // Create user if doesn't exist
    redirect('/profile/create');
  }

  const hasProfile = !!user.studentProfile;

  // Fetch upcoming deadlines
  const upcomingDeadlines = await prisma.admissionTimeline.findMany({
    where: {
      isActive: true,
      applicationDeadline: {
        gte: new Date()
      }
    },
    include: {
      university: true
    },
    orderBy: {
      applicationDeadline: 'asc'
    },
    take: 5
  });

  // Fetch recent updates
  const recentUpdates = await prisma.universityUpdate.findMany({
    where: {
      priority: 'high'
    },
    include: {
      university: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">NUCAP</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/universities">
              <Button variant="ghost">Universities</Button>
            </Link>
            <Link href="/matches">
              <Button variant="ghost">My Matches</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Here's your admission dashboard
          </p>
        </div>

        {/* Profile Completion Alert */}
        {!hasProfile && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-1">
                Complete Your Profile
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                Add your academic details to get personalized university recommendations
              </p>
              <Link href="/profile/create">
                <Button size="sm">Complete Profile</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Stats */}
            {hasProfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Academic Profile</CardTitle>
                  <CardDescription>Quick overview of your credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Matric</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {user.studentProfile?.matricPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.studentProfile?.matricBoard}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Inter</div>
                      <div className="text-2xl font-bold text-green-600">
                        {user.studentProfile?.interPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.studentProfile?.interGroup}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Matches</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {user.studentProfile?.matches.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        Universities
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href="/profile">
                      <Button variant="outline" size="sm">Edit Profile</Button>
                    </Link>
                    <Link href="/matches">
                      <Button size="sm">View All Matches</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Matches */}
            {hasProfile && user.studentProfile?.matches && user.studentProfile.matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Top University Matches
                  </CardTitle>
                  <CardDescription>
                    Based on your academic profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.studentProfile.matches.map((match) => (
                      <div 
                        key={match.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {match.university.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.department.name} - {match.department.degree}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge 
                              variant={
                                match.admissionChance === 'High' ? 'default' :
                                match.admissionChance === 'Good' ? 'secondary' :
                                'outline'
                              }
                            >
                              {match.admissionChance} Chance
                            </Badge>
                            <Badge variant="outline">
                              Merit: {match.estimatedMerit.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {match.matchScore}
                          </div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/matches">
                      <Button variant="outline" className="w-full">
                        View All Matches
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Updates
                </CardTitle>
                <CardDescription>
                  Latest announcements from universities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {recentUpdates.map((update) => (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {update.title}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {update.description}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">
                                {update.university.shortName}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(update.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent updates available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingDeadlines.map((timeline) => (
                      <div key={timeline.id} className="border-b pb-3 last:border-0">
                        <div className="font-semibold text-sm text-gray-900">
                          {timeline.university.shortName}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Application Deadline
                        </div>
                        <div className="text-sm font-medium text-red-600 mt-1">
                          {timeline.applicationDeadline
                            ? formatDistanceToNow(timeline.applicationDeadline, { addSuffix: true })
                            : 'TBA'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No upcoming deadlines
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/universities">
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Explore Universities
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

