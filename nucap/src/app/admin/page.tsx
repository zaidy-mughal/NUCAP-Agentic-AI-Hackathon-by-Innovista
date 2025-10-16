import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default async function AdminPage() {
  // Check admin authentication
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  // Fetch statistics
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
                  {recentLogs.map((log) => (
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
                            {log.university.shortName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.dataType} • {new Date(log.completedAt).toLocaleString()}
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
                  ))}
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
                <Link href="/admin/merit">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Add Merit List
                  </Button>
                </Link>
                <Link href="/admin/timeline">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Update Timeline
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scraping Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Successful</span>
                    <span className="font-semibold text-green-600">{successfulScrapes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <span className="font-semibold text-red-600">{failedScrapes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-semibold">
                      {recentLogs.length > 0 
                        ? Math.round((successfulScrapes / recentLogs.length) * 100)
                        : 0}%
                    </span>
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