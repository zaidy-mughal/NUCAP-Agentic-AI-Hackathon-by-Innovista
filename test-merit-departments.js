async function testMeritDepartments() {
  try {
    console.log('Testing merit list department functionality...');
    
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
    
    // Create a test university
    console.log('\n2. Creating test university...');
    const universityData = {
      name: 'Test University for Merit ' + Date.now(),
      shortName: 'TESTMERIT' + Date.now(),
      location: 'Test City',
      website: 'https://test.edu.pk',
      testRequired: 'None',
      isActive: true
    };
    
    const createUniResponse = await fetch('http://localhost:3000/api/admin/universities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(universityData)
    });
    
    console.log('Create university status:', createUniResponse.status);
    const uniData = await createUniResponse.json();
    console.log('University created:', uniData.university?.name);
    
    if (createUniResponse.status !== 201) {
      console.log('Failed to create university');
      return;
    }
    
    const universityId = uniData.university.id;
    
    // Create test departments
    console.log('\n3. Creating test departments...');
    const departments = [
      { name: 'Computer Science', degree: 'BS', duration: '4 Years', category: 'Computer Science' },
      { name: 'Electrical Engineering', degree: 'BE', duration: '4 Years', category: 'Engineering' },
      { name: 'Business Administration', degree: 'BBA', duration: '4 Years', category: 'Business' }
    ];
    
    for (const dept of departments) {
      const createDeptResponse = await fetch(`http://localhost:3000/api/universities/${universityId}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dept)
      });
      
      console.log(`Department ${dept.name} creation status:`, createDeptResponse.status);
      const deptData = await createDeptResponse.json();
      console.log(`Department created:`, deptData.department?.name);
    }
    
    // Test fetching universities with departments
    console.log('\n4. Testing university fetch with departments...');
    const fetchResponse = await fetch('http://localhost:3000/api/admin/universities?include=departments');
    console.log('Fetch universities with departments status:', fetchResponse.status);
    const fetchData = await fetchResponse.json();
    
    if (fetchData.success) {
      const testUni = fetchData.universities.find(u => u.id === universityId);
      console.log('Test university found:', testUni?.name);
      console.log('Departments count:', testUni?.departments?.length);
      console.log('Departments:', testUni?.departments?.map(d => d.name));
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testMeritDepartments();