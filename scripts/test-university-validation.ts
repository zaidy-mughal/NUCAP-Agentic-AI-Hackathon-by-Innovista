import { z } from 'zod';

const universitySchema = z.object({
  name: z.string().min(1, "University name is required"),
  shortName: z.string().min(1, "Short name is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Invalid website URL"),
  testRequired: z.enum(['None', 'NUST', 'FAST', 'NTS']),
  isActive: z.boolean().default(true),
});

// Test data that should work
const testData = {
  name: 'Test University',
  shortName: 'TEST',
  location: 'Test City',
  website: 'https://test.edu',
  testRequired: 'None',
  isActive: true
};

try {
  const validatedData = universitySchema.parse(testData);
  console.log('Validation successful:', validatedData);
} catch (error) {
  console.error('Validation error:', error);
}