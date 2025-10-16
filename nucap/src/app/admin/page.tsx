import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { 
  Users, 
  GraduationCap, 
  Activity, 
  TrendingUp, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Define types for our data
interface ScrapingLog {
  id: string;
  status: string;
  dataType: string;
  errorMessage: string | null;
  executionTime: number | null;
  completedAt: Date;
  university: {
    shortName: string;
  } | null;
}

interface DashboardData {
  totalStudents: number;
  totalUniversities: number;
  totalDepartments: number;
  totalMatches: number;
  recentLogs: ScrapingLog[];
  error?: string;
}

// Fetch dashboard data with error handling
async function getDashboardData(): Promise<DashboardData> {
  try {
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`;
    
    const [
      totalStudents,
      totalUniversities,
      totalDepartments,
      totalMatches,
      recentLogs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.university.count({ where: { isActive: true } }),
      prisma.department.count(),
      prisma.studentMatch.count(),
      prisma.scrapingLog.findMany({
        include: { university: true },
        orderBy: { completedAt: 'desc' },
        take: 10
      })
    ]);

    return {
      totalStudents,
      totalUniversities,
      totalDepartments,
      totalMatches,
      recentLogs
    };
  } catch (error) {
    console.error('Database error in admin dashboard:', error);
    return {
      totalStudents: 0,
      totalUniversities: 0,
      totalDepartments: 0,
      totalMatches: 0,
      recentLogs: [],
      error: 'Unable to connect to database. Please check your connection.'
    };
  }
}

export default async function AdminPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const dashboardData = await getDashboardData();
  const { 
    totalStudents, 
    totalUniversities, 
    totalDepartments, 
    totalMatches, 
    recentLogs, 
    error 
  } = dashboardData;

  const successfulScrapes = recentLogs.filter(log => log.status === 'success').length;
  const failedScrapes = recentLogs.filter(log => log.status === 'failed').length;

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
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/admin/universities">
              <Button variant="ghost">Manage Universities</Button>
            </Link>
            <form action="/api/admin/logout" method="POST">
              <Button variant="ghost" type="submit">Logout</Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage universities, scraping, and monitor system health
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
            <h3 className="font-bold">Database Connection Error</h3>
            <p>{error}</p>
            <p className="mt-2 text-sm">The application is currently unable to connect to the database. Some features may be limited.</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Universities
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUniversities}</div>
              <p className="text-xs text-gray-500 mt-1">
                Active universities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Departments
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDepartments}</div>
              <p className="text-xs text-gray-500 mt-1">
                Total programs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Matches Generated
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMatches}</div>
              <p className="text-xs text-gray-500 mt-1">
                Student-university matches
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scraping Status */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Recent Scraping Activity
                  </span>
                  <form action="/api/cron/scrape-universities" method="POST">
                    <Button size="sm" variant="outline">
                      Trigger Scraping
                    </Button>
                  </form>
                </CardTitle>
                <CardDescription>
                  Last 10 scraping jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {log.status === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          <div>
                            <div className="font-semibold text-sm">
                              {log.university?.shortName || 'Unknown University'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.dataType} • <time
                                suppressHydrationWarning
                                dateTime={new Date(log.completedAt).toISOString()}
                              >
                                {new Date(log.completedAt).toISOString().replace('T', ' ').slice(0, 16)}
                              </time>
                            </div>
                            {log.errorMessage && (
                              <div className="text-xs text-red-600 mt-1">
                                {log.errorMessage}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                          {log.executionTime && (
                            <div className="text-xs text-gray-500 mt-1">
                              {log.executionTime}ms
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No scraping activity found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/universities/new">
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Add University
                  </Button>
                </Link>
                <Link href="/admin/universities">
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </Link>
                <Link href="/admin/merit">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Manage Merit Lists
                  </Button>
                </Link>
                <Link href="/admin/timeline">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Admission Timelines
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge variant={error ? "destructive" : "default"}>
                      {error ? "Disconnected" : "Connected"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scraping Success</span>
                    <span className="text-sm font-medium">{successfulScrapes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Scraping Failed</span>
                    <span className="text-sm font-medium">{failedScrapes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}