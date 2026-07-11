const data = {
  name: "Demo User",
  email: "demo@example.com",
  password: "password123"
};

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => {
  if (json.success || (json.message && json.message.includes('already exists'))) {
    console.log("Success! Account is ready.");
  } else {
    console.log("Response:", json);
  }
})
.catch(err => console.error(err));
