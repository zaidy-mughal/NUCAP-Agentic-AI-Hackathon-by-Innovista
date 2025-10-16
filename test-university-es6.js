async function testUniversityCreation() {
  try {
    console.log('Testing university creation through API...');
    
    // Step 1: Login as admin
    console.log('\n1. Logging in as admin...');
    
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin@nucap',
        password: 'SaadZaidAbdullah@2025'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response data:', loginData);
    
    if (loginResponse.status !== 200) {
      console.log('Login failed');
      return;
    }
    
    // Extract cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received:', cookies);
    
    // Step 2: Create university
    console.log('\n2. Creating university...');
    
    const universityData = {
      name: 'Test University ' + Date.now(),
      shortName: 'TEST' + Date.now(),
      location: 'Test City',
      website: 'https://test.edu.pk',
      testRequired: 'None',
      isActive: true
    };
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add cookie if available
    if (cookies) {
      headers['Cookie'] = cookies;
    }
    
    const createResponse = await fetch('http://localhost:3000/api/admin/universities', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(universityData)
    });
    
    console.log('Create university response status:', createResponse.status);
    const createData = await createResponse.json();
    console.log('Create university response data:', createData);
    
    if (createResponse.status === 201) {
      console.log('✅ University created successfully!');
      console.log('Created university ID:', createData.university.id);
    } else {
      console.log('❌ Failed to create university');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testUniversityCreation();