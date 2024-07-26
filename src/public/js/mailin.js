document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const tokenElement = document.getElementById('token');
    const token = tokenElement ? tokenElement.textContent : '';
    console.log(token);
    
    
    const response = await fetch(`http://localhost:8080/api/sessions/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      })
      
      if (response.ok) {
  
        alert("Cambio de contraseña exitoso!");
        window.location.href = "http://localhost:8080/"    
    } else {
        const error = await response.json();
        alert(error.error);
      }
  });