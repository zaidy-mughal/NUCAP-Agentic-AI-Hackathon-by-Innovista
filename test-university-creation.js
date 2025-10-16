const http = require('http');

async function testUniversityCreation() {
  try {
    console.log('Testing university creation through API...');
    
    // Step 1: Login as admin
    console.log('\n1. Logging in as admin...');
    
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const loginResult = await new Promise((resolve, reject) => {
      const req = http.request(loginOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
      });
      
      req.on('error', reject);
      req.write(JSON.stringify({
        username: 'admin@nucap',
        password: 'SaadZaidAbdullah@2025'
      }));
      req.end();
    });
    
    console.log('Login response status:', loginResult.statusCode);
    console.log('Login response data:', loginResult.data);
    
    if (loginResult.statusCode !== 200) {
      console.log('Login failed');
      return;
    }
    
    // Extract cookies
    const cookies = loginResult.headers['set-cookie'];
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
    
    const createOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/universities',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies ? cookies.join('; ') : ''
      }
    };
    
    const createResult = await new Promise((resolve, reject) => {
      const req = http.request(createOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      });
      
      req.on('error', reject);
      req.write(JSON.stringify(universityData));
      req.end();
    });
    
    console.log('Create university response status:', createResult.statusCode);
    console.log('Create university response data:', createResult.data);
    
    if (createResult.statusCode === 201) {
      console.log('✅ University created successfully!');
      const result = JSON.parse(createResult.data);
      console.log('Created university ID:', result.university.id);
    } else {
      console.log('❌ Failed to create university');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testUniversityCreation();