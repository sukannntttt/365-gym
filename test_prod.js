const fs = require('fs');

async function testApi() {
  try {
    // 1. Register test user
    const email = 'test_debug_' + Date.now() + '@example.com';
    let res = await fetch('https://gym-backend-aukv.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test', email, password: 'password123', age: 25, height: 180, weight: 80, goal: 'fat loss'
      })
    });
    
    let data = await res.json();
    if (!data.token) {
      console.log('Register failed:', data);
      return;
    }
    const token = data.token;
    console.log('Registered successfully. Token:', token.substring(0, 10) + '...');

    // 2. Try to post progress
    let res2 = await fetch('https://gym-backend-aukv.onrender.com/api/progress/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ weight: 79, date: new Date().toISOString() })
    });
    
    let text = await res2.text();
    console.log('Progress POST status:', res2.status);
    console.log('Progress POST response:', text);

    // 3. Try log
    let res3 = await fetch('https://gym-backend-aukv.onrender.com/api/workout-log/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ exercise: "Bench", sets: 3, reps: 10, weight: 60, date: new Date().toISOString() })
    });
    
    let text3 = await res3.text();
    console.log('Log POST status:', res3.status);
    console.log('Log POST response:', text3);

  } catch (err) {
    console.error('Script Error:', err);
  }
}
testApi();
