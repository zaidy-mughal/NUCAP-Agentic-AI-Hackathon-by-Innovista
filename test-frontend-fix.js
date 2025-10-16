// This test verifies that the frontend fix works correctly
// We'll check if the merit list page can now fetch universities with departments

async function testFrontendFix() {
  console.log('Testing frontend fix for merit list departments...');
  
  try {
    // Test the universities API endpoint that the merit list page uses
    const response = await fetch('http://localhost:3000/api/admin/universities?include=departments');
    console.log('Status:', response.status);
    
    const jsonData = await response.json();
    console.log('Success:', jsonData.success);
    console.log('Universities count:', jsonData.universities?.length);
    
    if (jsonData.universities && jsonData.universities.length > 0) {
      const firstUni = jsonData.universities[0];
      console.log('First university:', firstUni.name);
      console.log('Has departments array:', !!firstUni.departments);
      console.log('Departments count:', firstUni.departments?.length || 0);
      
      if (firstUni.departments) {
        console.log('✅ Departments are properly included in the response!');
        console.log('✅ Merit list page should now display departments correctly.');
      } else {
        console.log('❌ Departments are not included in the response');
        console.log('❌ Merit list page will not display departments');
      }
    }
  } catch (error) {
    console.log('Test error:', error);
  }
}

testFrontendFix();