import { checkAuth, handleLogin, handleLogout } from './auth.js';
import { fetchUserData, fetchXpData, fetchProgressData } from './api.js';
import { createXpChart, createPassFailChart } from './graph.js';

let currentPage = null;

async function renderPage() {
  try {
    const isAuthenticated = await checkAuth();
    const app = document.getElementById('app');
    
    // Clear previous content
    while (app.firstChild) app.removeChild(app.firstChild);

    if (isAuthenticated) {
      await renderProfilePage(app);
    } else {
      renderLoginPage(app);
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
        <h1>${userData.login}</h1>
        <button id="logout">Logout</button>
      </header>
      <div class="stats-grid">
        <div class="card">
          <h2>Total XP</h2>
          <p>${xpData.reduce((sum, t) => sum + t.amount, 0)} XP</p>
        </div>
        <div class="card">
          <h2>Audit Ratio</h2>
          <p>${calculateAuditRatio(progressData)}</p>
        </div>
        <div class="card">
          <h2>Recent Projects</h2>
          <ul>${progressData.map(p => `<li>${p.object.name}</li>`).join('')}</ul>
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

// Initial render
renderPage();