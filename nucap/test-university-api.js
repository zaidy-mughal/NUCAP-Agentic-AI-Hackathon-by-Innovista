const testUniversityCreation = async () => {
  try {
    // First, login as admin
    console.log('Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3002/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@nucap',
        password: 'SaadZaidAbdullah@2025'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginResponse.ok) {
      console.log('Login failed');
      return;
    }
    
    // Get cookies from login response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    // Try to create a university
    console.log('\nCreating university...');
    const universityData = {
      name: 'Test University',
      shortName: 'TEST',
      location: 'Test City',
      website: 'https://test.edu.pk',
      testRequired: 'None',
      isActive: true
    };
    
    const createResponse = await fetch('http://localhost:3002/api/admin/universities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(universityData)
    });
    
    console.log('Create response status:', createResponse.status);
    const createData = await createResponse.json();
    console.log('Create response:', createData);
    
  } catch (error) {
    console.error('Error:', error);
  }
};

testUniversityCreation();