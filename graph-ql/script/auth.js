
  export async function handleLogin() {
    try {
      const identifier = document.getElementById('identifier').value;
      const password = document.getElementById('password').value;
      const credentials = btoa(`${identifier}:${password}`);
  
      const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Invalid credentials');
      
      const token  = await response.json();
      console.log("token in login", token)
      localStorage.setItem('jwt', token);
      return true;
    } catch (error) {
      document.getElementById('error-message').textContent = error.message;
      throw error;
    }
  }
  
  export function handleLogout() {
    localStorage.removeItem('jwt');
  }