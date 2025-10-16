'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignOut } from '@/components/SignOut';

const CITIES = ['Islamabad', 'Karachi', 'Lahore', 'Peshawar', 'Rawalpindi', 'Multan', 'Faisalabad', 'Quetta'];
const FIELDS = ['Computer Science', 'Engineering', 'Medical', 'Business', 'Arts'];
const BOARDS = ['Federal', 'Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'GBSE'];

interface FormData {
  // Matric
  matricTotalMarks: number;
  matricObtainedMarks: number;
  matricBoard: string;
  matricYear: number;
  
  // Inter
  interTotalMarks: number;
  interObtainedMarks: number;
  interBoard: string;
  interGroup: string;
  interYear: number;
  
  // Test Scores
  nustTestScore: number;
  fastTestScore: number;
  ntsTestScore: number;
  
  // Preferences
  preferredCities: string[];
  preferredFields: string[];
  budgetRange: string;
}

export default function CreateProfilePage() {
  const router = useRouter();
	const { isLoaded, isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    // Matric
    matricTotalMarks: 1100,
    matricObtainedMarks: 0,
    matricBoard: '',
    matricYear: new Date().getFullYear() - 2,
    
    // Inter
    interTotalMarks: 1100,
    interObtainedMarks: 0,
    interBoard: '',
    interGroup: '',
    interYear: new Date().getFullYear(),
    
    // Test Scores
    nustTestScore: 0,
    fastTestScore: 0,
    ntsTestScore: 0,
    
    // Preferences
    preferredCities: [],
    preferredFields: [],
    budgetRange: ''
  });

  // Redirect if user is not authenticated or if profile already exists
	useEffect(() => {
		if (!isLoaded) return;
		if (!isSignedIn) {
			router.push('/sign-in');
		}
	}, [isLoaded, isSignedIn, router]);

  const handleChange = (field: keyof FormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'preferredCities' | 'preferredFields', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If profile already exists (409 Conflict), redirect to dashboard
        if (response.status === 409) {
          console.log('Profile already exists, redirecting to dashboard...');
          router.push('/dashboard');
          return;
        }
        throw new Error(data.error || 'Failed to create profile');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

	// Redirecting via useEffect; render nothing during navigation
	if (!isSignedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold">NUCAP</span>
          <div className="ml-auto">
            <SignOut />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  } ${s < 4 ? 'mr-2' : ''}`}
                />
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Step {step} of 4
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Matric Information'}
                {step === 2 && 'Intermediate Information'}
                {step === 3 && 'Expected Test Scores'}
                {step === 4 && 'Preferences'}
              </CardTitle>
              <CardDescription>
                {step === 1 && 'Enter your Matric (SSC) marks and details'}
                {step === 2 && 'Enter your Intermediate (HSSC) marks and details'}
                {step === 3 && 'Enter your expected or actual test scores (optional)'}
                {step === 4 && 'Select your preferred cities and fields of study'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Matric */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="matricObtained">Obtained Marks</Label>
                      <Input
                        id="matricObtained"
                        type="number"
                        value={formData.matricObtainedMarks || ''}
                        onChange={e => handleChange('matricObtainedMarks', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 950"
                      />
                    </div>
                    <div>
                      <Label htmlFor="matricTotal">Total Marks</Label>
                      <Input
                        id="matricTotal"
                        type="number"
                        value={formData.matricTotalMarks}
                        onChange={e => handleChange('matricTotalMarks', parseInt(e.target.value) || 1100)}
                        placeholder="e.g., 1100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="matricBoard">Board</Label>
                    <Select value={formData.matricBoard} onValueChange={v => handleChange('matricBoard', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOARDS.map(board => (
                          <SelectItem key={board} value={board}>{board}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="matricYear">Year</Label>
                    <Input
                      id="matricYear"
                      type="number"
                      value={formData.matricYear}
                      onChange={e => handleChange('matricYear', parseInt(e.target.value))}
                      placeholder="e.g., 2022"
                    />
                  </div>

                  {formData.matricObtainedMarks > 0 && formData.matricTotalMarks > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Your Percentage</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {((formData.matricObtainedMarks / formData.matricTotalMarks) * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Inter */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="interObtained">Obtained Marks</Label>
                      <Input
                        id="interObtained"
                        type="number"
                        value={formData.interObtainedMarks || ''}
                        onChange={e => handleChange('interObtainedMarks', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="interTotal">Total Marks</Label>
                      <Input
                        id="interTotal"
                        type="number"
                        value={formData.interTotalMarks}
                        onChange={e => handleChange('interTotalMarks', parseInt(e.target.value) || 1100)}
                        placeholder="e.g., 1100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interBoard">Board</Label>
                    <Select value={formData.interBoard} onValueChange={v => handleChange('interBoard', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOARDS.map(board => (
                          <SelectItem key={board} value={board}>{board}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interGroup">Group</Label>
                    <Select value={formData.interGroup} onValueChange={v => handleChange('interGroup', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pre-Eng">Pre-Engineering</SelectItem>
                        <SelectItem value="Pre-Med">Pre-Medical</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interYear">Year</Label>
                    <Input
                      id="interYear"
                      type="number"
                      value={formData.interYear}
                      onChange={e => handleChange('interYear', parseInt(e.target.value))}
                      placeholder="e.g., 2024"
                    />
                  </div>

                  {formData.interObtainedMarks > 0 && formData.interTotalMarks > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Your Percentage</div>
                      <div className="text-3xl font-bold text-green-600">
                        {((formData.interObtainedMarks / formData.interTotalMarks) * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Test Scores */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Enter your expected or actual test scores. Leave blank if you haven&apos;t taken the test yet.
                  </p>

                  <div>
                    <Label htmlFor="nustScore">NUST Entry Test (out of 200)</Label>
                    <Input
                      id="nustScore"
                      type="number"
                      value={formData.nustTestScore || ''}
                      onChange={e => handleChange('nustTestScore', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 140"
                      max={200}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fastScore">FAST Entry Test (out of 100)</Label>
                    <Input
                      id="fastScore"
                      type="number"
                      value={formData.fastTestScore || ''}
                      onChange={e => handleChange('fastTestScore', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 75"
                      max={100}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ntsScore">NTS/GAT Test (out of 100)</Label>
                    <Input
                      id="ntsScore"
                      type="number"
                      value={formData.ntsTestScore || ''}
                      onChange={e => handleChange('ntsTestScore', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 70"
                      max={100}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Preferences */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Preferred Cities</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {CITIES.map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleArrayItem('preferredCities', city)}
                          className={`p-3 border rounded-lg text-sm transition-colors ${
                            formData.preferredCities.includes(city)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Preferred Fields</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {FIELDS.map(field => (
                        <button
                          key={field}
                          type="button"
                          onClick={() => toggleArrayItem('preferredFields', field)}
                          className={`p-3 border rounded-lg text-sm transition-colors ${
                            formData.preferredFields.includes(field)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Range (Optional)</Label>
                    <Select value={formData.budgetRange} onValueChange={v => handleChange('budgetRange', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Public Universities)</SelectItem>
                        <SelectItem value="medium">Medium (50k-200k/semester)</SelectItem>
                        <SelectItem value="high">High (200k+/semester)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button onClick={nextStep} className="ml-auto">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
                    {loading ? 'Creating...' : 'Complete Profile'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}