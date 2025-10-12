import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  Calculator, 
  Bell, 
  TrendingUp,
  Clock,
  Target,
  Users,
  Award
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">NUCAP</span>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Never Miss Your
            <span className="text-blue-600"> University Admission </span>
            Deadline Again
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find the best-fit universities based on your academic profile. 
            Get real-time deadline alerts and calculate your admission chances instantly.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Find Your University
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explore Universities
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600">4+</div>
              <div className="text-sm text-gray-600">Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">1M+</div>
              <div className="text-sm text-gray-600">Target Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Problem We're Solving
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Every year, thousands of talented students miss university admission deadlines 
              because information is scattered across multiple websites. Merit lists are confusing, 
              and students don't know which universities match their academic profile.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-xl font-semibold text-red-600">
                Don't let missed deadlines cost you a year of your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need in One Place
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Calculator className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Merit Calculator</CardTitle>
                <CardDescription>
                  Calculate your merit for NUST, FAST, COMSATS, and more universities instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Get personalized university recommendations based on your academic profile
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 text-yellow-600 mb-2" />
                <CardTitle>Deadline Alerts</CardTitle>
                <CardDescription>
                  Never miss important dates with automated deadline notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Merit Analysis</CardTitle>
                <CardDescription>
                  See your admission chances with historical merit data and trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Real-Time Updates</CardTitle>
                <CardDescription>
                  Get instant notifications about merit lists and admission announcements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Department Info</CardTitle>
                <CardDescription>
                  Explore detailed information about programs, seats, and requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-pink-600 mb-2" />
                <CardTitle>Multi-University</CardTitle>
                <CardDescription>
                  Compare and track admissions across NUST, FAST, COMSATS, and Punjab
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-cyan-600 mb-2" />
                <CardTitle>Complete Profile</CardTitle>
                <CardDescription>
                  Maintain your academic records and preferences in one secure place
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How NUCAP Works
          </h2>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Enter your Matric and Inter marks
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Matches</h3>
              <p className="text-gray-600">
                See universities that match your profile
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Deadlines</h3>
              <p className="text-gray-600">
                Get alerts for important dates
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2">Apply Confidently</h3>
              <p className="text-gray-600">
                Know your chances before applying
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Find Your Perfect University?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students who are making smarter admission decisions
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">NUCAP</span>
              </div>
              <p className="text-gray-600 text-sm">
                Making university admissions easier for Pakistani students
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/universities">Universities</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Universities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>NUST</li>
                <li>FAST</li>
                <li>COMSATS</li>
                <li>Punjab University</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 NUCAP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
