import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SignOut } from '@/components/SignOut';
import { 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Bell,
  AlertCircle,
  CheckCircle,
  Database,
  BarChart3,
  Award,
  Clock
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

// Define TypeScript interfaces
interface Department {
  id: string;
  name: string;
  degree: string;
  duration: string;
  seats: number | null;
  category: string;
}

interface AdmissionTimeline {
  id: string;
  applicationDeadline: Date | null;
  testDate: Date | null;
  year: number;
  isActive: boolean;
}

interface NustTestSeries {
  id: string;
  seriesName: string;
  onlineRegistration: string | null;
  cbnet: string | null;
  pbnet: string | null;
  testCentre: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MeritList {
  id: string;
  year: number;
  admissionCycle: string;
  meritType: string;
  closingMerit: number;
  publishedDate: Date | null;
  department: {
    name: string;
    degree: string;
  };
  university: {
    shortName: string;
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch user and profile
  let user = await prisma.user.findUnique({
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
    // Create or update the user safely using Clerk data to avoid unique email conflicts
    const cu = await currentUser();
    const emailFromClerk = cu?.primaryEmailAddress?.emailAddress || cu?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.local`;
    const nameFromClerk = cu?.fullName || cu?.username || null;

    await prisma.user.upsert({
      where: { clerkId: userId! },
      create: {
        clerkId: userId!,
        email: emailFromClerk,
        name: nameFromClerk,
        lastLogin: new Date(),
      },
      update: {
        email: emailFromClerk,
        name: nameFromClerk,
        lastLogin: new Date(),
      }
    });

    user = await prisma.user.findUnique({
      where: { clerkId: userId! },
      include: { studentProfile: { include: { matches: { include: { university: true, department: true }, orderBy: { matchScore: 'desc' }, take: 5 } } } }
    });
  }

  // Ensure user is not null before proceeding
  if (!user) {
    // Handle the case where user creation failed
    redirect('/sign-in');
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

  // Fetch recently added merit lists
  const recentMeritLists: MeritList[] = await prisma.meritList.findMany({
    include: {
      department: {
        select: {
          name: true,
          degree: true
        }
      },
      university: {
        select: {
          shortName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  // Fetch NUST test series data
  let nustTestSeries: NustTestSeries[] = [];
  try {
    // Use the existing nust-dates endpoint which is confirmed to work
    const nustResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/nust-dates`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    const nustData = await nustResponse.json();
    nustTestSeries = nustData.data || [];
  } catch (error) {
    console.error('Error fetching NUST test series:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/icons/app-icon.png" 
              alt="NUCAP Logo" 
              className="h-8 w-8 rounded-full object-contain"
            />
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
            <SignOut />
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
            Here&apos;s your admission dashboard
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
                        {user.studentProfile?.matricPercentage?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.studentProfile?.matricBoard}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Inter</div>
                      <div className="text-2xl font-bold text-green-600">
                        {user.studentProfile?.interPercentage?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.studentProfile?.interGroup}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Matches</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {user.studentProfile?.matches?.length || 0}
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

            {/* Top Matches - Moved to be right after Academic Profile */}
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

            {/* Recently Added Merit Lists */}
            {recentMeritLists.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recently Added Merit Lists
                  </CardTitle>
                  <CardDescription>
                    Latest merit data added by administrators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMeritLists.map((merit) => (
                      <div key={merit.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {merit.university.shortName} - {merit.department.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {merit.department.degree} • {merit.year} {merit.admissionCycle}
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {merit.meritType} List
                          </Badge>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm">
                            <span className="font-medium">Closing Merit:</span> {merit.closingMerit}%
                          </div>
                          {merit.publishedDate && (
                            <div className="text-xs text-gray-500">
                              Published: {format(new Date(merit.publishedDate), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NUST Test Series */}
            {nustTestSeries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    NUST Test Series
                  </CardTitle>
                  <CardDescription>
                    Upcoming NUST entry test schedules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nustTestSeries.map((series) => (
                      <div key={series.id} className="border rounded-lg p-4">
                        <div className="font-semibold text-gray-900">{series.seriesName}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {series.onlineRegistration && (
                            <div className="text-sm">
                              <div className="text-gray-500">Online Registration</div>
                              <div className="font-medium">{series.onlineRegistration}</div>
                            </div>
                          )}
                          {series.cbnet && (
                            <div className="text-sm">
                              <div className="text-gray-500">CBNET</div>
                              <div className="font-medium">{series.cbnet}</div>
                            </div>
                          )}
                          {series.pbnet && (
                            <div className="text-sm">
                              <div className="text-gray-500">PBNET</div>
                              <div className="font-medium">{series.pbnet}</div>
                            </div>
                          )}
                          {series.testCentre && (
                            <div className="text-sm">
                              <div className="text-gray-500">Test Centres</div>
                              <div className="font-medium">{series.testCentre}</div>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Last updated: {formatDistanceToNow(new Date(series.updatedAt), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
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