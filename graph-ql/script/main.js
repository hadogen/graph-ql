import { handleLogin, handleLogout } from './auth.js';
import { fetchUserData, fetchXpData, fetchProgressData } from './api.js';
import { createXpChart, createPassFailChart } from './graph.js';

let currentPage = null;

async function renderPage() {
  try {
    const app = document.getElementById('app');
        const token = localStorage.getItem('jwt');

    
    while (app.firstChild) app.removeChild(app.firstChild);
    console.log("this is the token", token)
    if (token=== null || token ==="undefined") {
      renderLoginPage(app);
    } else {
      await renderProfilePage(app);

    }
  } catch (error) {
    renderErrorPage(error);
  }
}

function renderLoginPage(container) {
  currentPage = 'login';
  
  const loginForm = document.createElement('form');
  loginForm.id = 'login-form';
  loginForm.innerHTML = `
    <h1>Login</h1>
    <input type="text" id="identifier" placeholder="Username/Email" required>
    <input type="password" id="password" placeholder="Password" required>
    <button type="submit">Login</button>
    <p id="error-message" class="error"></p>
  `;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin();
    renderPage();
  });

  container.appendChild(loginForm);
}

async function renderProfilePage(container) {
  currentPage = 'profile';
  
  try {
    const [userData, xpData, progressData] = await Promise.all([
      fetchUserData(),
      fetchXpData(),
      fetchProgressData()
    ]);
    const profileSection = document.createElement('div');
    profileSection.innerHTML = `
      <header>
        <h1>Welcome ${userData[0].login} </h1>
        <h2>Email ${userData[0].email}</h2>
        <h3> Audit Ratio ${userData[0].auditRatio.toFixed(2)}</h3>
        <button id="logout">Logout</button>
      </header>
      <div class="stats-grid">
        <div class="card">
          <h2> Top 3 Projects validated</h2>
            <ul>${xpData.slice(0,3).map(p => `<li>${p.object.name} xp: ${p.amount}</li>`).join('')}</ul>
          </div>
   
        <div class="card">
          <h2>Recent Projects</h2>
          <ul>${progressData.slice(0, 3).map(p => `<li>${p.object.name}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="graph-section">
        <div id="xp-timeline"></div>
        <div id="pass-fail-chart"></div>
      </div>
    `;

    // Add charts dynamically
    profileSection.querySelector('#xp-timeline').appendChild(
      createXpChart(xpData)
    );
    
    profileSection.querySelector('#pass-fail-chart').appendChild(
      createPassFailChart(progressData)
    );

    profileSection.querySelector('#logout').addEventListener('click', () => {
      handleLogout();
      renderPage();
    });

    container.appendChild(profileSection);
  } catch (error) {
    renderErrorPage(error);
  }
}

function renderErrorPage(error) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="error">${error.message}</div>`;
}

renderPage();