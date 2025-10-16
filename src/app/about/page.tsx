import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  Target, 
  Users, 
  Heart,
  Github,
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">NUCAP</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/universities">
              <Button variant="ghost">Universities</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            About NUCAP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            National University Admission Platform - Empowering 1M+ Pakistani students 
            to never miss a university deadline
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to university admissions information in Pakistan by 
                providing a centralized, automated platform that helps students make 
                informed decisions and never miss critical deadlines.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To become Pakistan's most trusted platform for university admissions, 
                helping every student find their perfect academic match and ensuring 
                no talented individual loses opportunities due to missed information.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Problem & Solution */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-bold text-red-900 mb-2">Scattered Information</h3>
              <p className="text-sm text-red-800">
                Students have to check multiple university websites daily, wasting hours searching for updates.
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">Missed Deadlines</h3>
              <p className="text-sm text-orange-800">
                Thousands of students miss admission opportunities every year due to lack of centralized tracking.
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">Uncertainty</h3>
              <p className="text-sm text-yellow-800">
                Students don't know their admission chances and which universities they should realistically apply to.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white rounded-full p-1 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900">Centralized Platform</h4>
                <p className="text-sm text-gray-600">All university information in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white rounded-full p-1 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900">Automated Tracking</h4>
                <p className="text-sm text-gray-600">Real-time deadline monitoring and alerts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white rounded-full p-1 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900">Merit Calculator</h4>
                <p className="text-sm text-gray-600">Calculate merit for all universities instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white rounded-full p-1 mt-1">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900">Smart Matching</h4>
                <p className="text-sm text-gray-600">AI-powered university recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Built With Modern Technology</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold mb-1">Next.js 15</h3>
                <p className="text-xs text-gray-600">React Framework</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="font-bold mb-1">TypeScript</h3>
                <p className="text-xs text-gray-600">Type Safety</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">🗄️</div>
                <h3 className="font-bold mb-1">PostgreSQL</h3>
                <p className="text-xs text-gray-600">Database</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">🔐</div>
                <h3 className="font-bold mb-1">Clerk</h3>
                <p className="text-xs text-gray-600">Authentication</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">🎯 For Students</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Create comprehensive academic profile</li>
                <li>• Calculate merit for multiple universities</li>
                <li>• Get personalized university recommendations</li>
                <li>• Track admission deadlines with countdowns</li>
                <li>• Receive real-time updates and alerts</li>
                <li>• Compare admission chances across departments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🛠️ For Administrators</h3>
              <ul className="space-y-2 text-blue-100">
                <li>• Manage university information</li>
                <li>• Automated web scraping system</li>
                <li>• Monitor system statistics</li>
                <li>• Manual data entry forms</li>
                <li>• Scraping logs and analytics</li>
                <li>• Content management dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">Target Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <GraduationCap className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">4+</div>
              <div className="text-sm text-gray-600">Universities</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Target className="h-10 w-10 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">100+</div>
              <div className="text-sm text-gray-600">Departments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-10 w-10 text-red-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </CardContent>
          </Card>
        </div>

        {/* Developer Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Meet the Developer</h2>
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Saad Khan Tareen</h3>
              <p className="text-gray-600 mb-4">
                Full-Stack Developer | Open Source Enthusiast
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                NUCAP was built to solve a real problem faced by Pakistani students every year. 
                As a developer passionate about education technology, I wanted to create a platform 
                that could genuinely help students navigate the complex university admission process.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <a 
                href="https://github.com/saadkhantareen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
              <a 
                href="https://github.com/saadkhantareen/pak-institutioner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                View Project
              </a>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white text-center">
          <Github className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Open Source Project</h2>
          <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
            NUCAP is proudly open source. Contribute to the project, report issues, 
            or suggest features on GitHub.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/saadkhantareen/pak-institutioner" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="gap-2">
                <Github className="h-5 w-5" />
                Star on GitHub
              </Button>
            </a>
            <a 
              href="https://github.com/saadkhantareen/pak-institutioner/issues" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
                Report Issue
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">NUCAP</span>
              </div>
              <p className="text-gray-600 text-sm">
                Empowering Pakistani students to never miss a university admission deadline
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/universities">Universities</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="https://github.com/saadkhantareen/pak-institutioner" target="_blank" rel="noopener noreferrer">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/saadkhantareen/pak-institutioner/issues" target="_blank" rel="noopener noreferrer">
                    Support
                  </a>
                </li>
                <li>
                  <a href="https://github.com/saadkhantareen/pak-institutioner" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a 
                  href="https://github.com/saadkhantareen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="mailto:support@nucap.pk" 
                  className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">
              &copy; 2024 NUCAP. All rights reserved. | Built with ❤️ for Pakistani Students
            </p>
            <p className="text-xs text-gray-500">
              Open Source Project • 
              <a 
                href="https://github.com/saadkhantareen/pak-institutioner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

