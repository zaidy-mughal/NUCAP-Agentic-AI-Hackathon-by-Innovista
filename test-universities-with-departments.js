async function testUniversitiesWithDepartments() {
  try {
    console.log('Testing universities fetch with departments...');
    
    // First login
    console.log('\n1. Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
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
    
    if (loginResponse.status !== 200) {
      console.log('Login failed');
      return;
    }
    
    // Get cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received');
    
    // Test fetching universities with departments
    console.log('\n2. Testing university fetch with departments...');
    const fetchResponse = await fetch('http://localhost:3000/api/admin/universities?include=departments');
    console.log('Fetch universities with departments status:', fetchResponse.status);
    const fetchData = await fetchResponse.json();
    
    if (fetchData.success) {
      console.log('Number of universities:', fetchData.universities.length);
      
      // Show details of first few universities
      const sampleUniversities = fetchData.universities.slice(0, 3);
      sampleUniversities.forEach((uni, index) => {
        console.log(`\nUniversity ${index + 1}: ${uni.name}`);
        console.log(`  Short name: ${uni.shortName}`);
        console.log(`  Departments count: ${uni._count?.departments || 0}`);
        console.log(`  Departments included: ${!!uni.departments}`);
        if (uni.departments) {
          console.log(`  Department names: ${uni.departments.map(d => d.name).join(', ')}`);
        }
      });
    } else {
      console.log('Failed to fetch universities:', fetchData.error);
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testUniversitiesWithDepartments();