async function testAPI() {
  try {
    console.log('Testing university creation API...');
    
    // First login
    const loginResponse = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@nucap',
        password: 'SaadZaidAbdullah@2025'
      })
    });
    
    console.log('Login status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login data:', loginData);
    
    // Get cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies:', cookies);
    
    // Try to create university
    const universityData = {
      name: 'Test University API',
      shortName: 'TESTAPI',
      location: 'Test City',
      website: 'https://test.edu.pk',
      testRequired: 'None',
      isActive: true
    };
    
    const createResponse = await fetch('http://localhost:3001/api/admin/universities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(universityData)
    });
    
    console.log('Create university status:', createResponse.status);
    const createData = await createResponse.json();
    console.log('Create university data:', createData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();