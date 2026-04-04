const fs = require('fs');
const files = ['workout.html', 'progress.html', 'log.html', 'diet.html', 'dashboard.html', 'bmi.html', 'admin.html'];

files.forEach(f => {
  const p = 'C:/Users/Sukant Rai/OneDrive/Desktop/WEBSITE/client/' + f;
  if (!fs.existsSync(p)) return;
  
  let d = fs.readFileSync(p, 'utf8');
  if (!d.includes('settings.html')) {
    d = d.replace('</nav>', `      <a href="settings.html" class="nav-item" id="nav-settings">\n        <span class="nav-icon">⚙️</span><span>Settings</span>\n      </a>\n    </nav>`);
    fs.writeFileSync(p, d);
  }
});
