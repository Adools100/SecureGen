const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*-_=+[]?~'
};

// DOM elements
const passwordOutput = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const savedPasswordsList = document.getElementById('savedPasswordsList');
const clearAllBtn = document.getElementById('clearAllBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');
const strengthIndicator = document.getElementById('strengthIndicator');
const charIndicators = document.getElementById('charIndicators');
const saveCounter = document.getElementById('saveCounter');
const achievement = document.getElementById('achievement');
const celebration = document.getElementById('celebration');
let currentPassword = '';
let saveCount = parseInt(localStorage.getItem('saveCount') || '0');

// Update save counter display
function updateSaveCounter() {
  if (saveCount > 0) {
      saveCounter.textContent = saveCount;
      saveCounter.classList.add('show');
  } else {
      saveCounter.classList.remove('show');
  }
}

function generateSecurePassword() {
  let password = '';
  const allSets = Object.values(charSets);
  
  password += getRandomChar(charSets.uppercase);
  password += getRandomChar(charSets.lowercase);
  password += getRandomChar(charSets.numbers);
  password += getRandomChar(charSets.symbols);
  
  const allChars = allSets.join('');
  for (let i = 4; i < 8; i++) {
      password += getRandomChar(allChars);
  }
  
  return shuffleString(password);
}

function getRandomChar(charset) {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}

function shuffleString(str) {
  return str.split('').sort(() => Math.random() - 0.5).join('');
}

function analyzePassword(password) {
  const analysis = {
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*\-_=+\[\]?~]/.test(password)
  };
  
  document.getElementById('upperIndicator').classList.toggle('active', analysis.hasUpper);
  document.getElementById('lowerIndicator').classList.toggle('active', analysis.hasLower);
  document.getElementById('numberIndicator').classList.toggle('active', analysis.hasNumber);
  document.getElementById('symbolIndicator').classList.toggle('active', analysis.hasSymbol);
  
  const strengthBars = strengthIndicator.querySelectorAll('.strength-bar');
  const activeTypes = Object.values(analysis).filter(Boolean).length;
  const lengthScore = password.length >= 8 ? 1 : 0;
  const totalStrength = Math.min(5, activeTypes + lengthScore);
  
  strengthBars.forEach((bar, index) => {
      bar.classList.toggle('active', index < totalStrength);
  });
  
  
  strengthIndicator.style.opacity = '1';
  charIndicators.style.opacity = '1';
}

function generatePassword() {
  currentPassword = generateSecurePassword();
  passwordOutput.value = currentPassword;
  
  // Add sparkle effect
  createSparkles();
  
  analyzePassword(currentPassword);
  
  passwordOutput.parentElement.classList.add('newly-generated');
  setTimeout(() => {
      passwordOutput.parentElement.classList.remove('newly-generated');
  }, 2500);
  
  showToast('🎉', 'New secure password generated!');
}

function createSparkles() {
  const container = document.querySelector('.generator-container');
  for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 2000);
  }
}

async function copyToClipboard() {
  if (!currentPassword) {
      showToast('❌', 'No password to copy!');
      return;
  }

  try {
      await navigator.clipboard.writeText(currentPassword);
      showToast('✅', 'Password copied to clipboard!');
  } catch (err) {
      showToast('❌', 'Failed to copy password');
  }
}

function savePassword() {
  if (!currentPassword) {
      showToast('❌', 'No password to save!');
      return;
  }

  const savedPasswords = getSavedPasswords();
  const newPassword = {
      id: Date.now(),
      password: currentPassword,
      createdAt: new Date().toLocaleString(),
      label: `Password ${savedPasswords.length + 1}`,
  };

  savedPasswords.unshift(newPassword);
  localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
  
  saveCount++;
  localStorage.setItem('saveCount', saveCount.toString());
  updateSaveCounter();
  
  updateSavedPasswordsList();
  showToast('💾', 'Password saved successfully!');
  
  if (saveCount === 7) {
      triggerAchievement();
  }
}

function triggerAchievement() {
  createConfetti();
  
  setTimeout(() => {
      achievement.classList.add('show');
      showToast('🏆', 'Achievement Unlocked: Password Master!');
      
      setTimeout(() => {
          achievement.classList.remove('show');
      }, 4000);
  }, 500);
}

function createConfetti() {
  const colors = ['#ff6b6b', '#feca57', '#48cab2', '#667eea', '#764ba2'];
  
  for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      celebration.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
  }
}

function getSavedPasswords() {
  const saved = localStorage.getItem('savedPasswords');
  return saved ? JSON.parse(saved) : [];
}

function updateSavedPasswordsList() {
  const savedPasswords = getSavedPasswords();

  if (savedPasswords.length === 0) {
      savedPasswordsList.innerHTML = `
          <div class="empty-state">
              <div class="empty-state-icon">🔒</div>
              <h3>No saved passwords</h3>
              <p>Generate and save passwords to see them here</p>
          </div>
      `;
      clearAllBtn.style.display = 'none';
      return;
  }

  clearAllBtn.style.display = 'block';
  savedPasswordsList.innerHTML = savedPasswords
      .map((item) => `
          <div class="saved-password-item" data-id="${item.id}">
              <div class="saved-password-header">
                  <span class="saved-password-label">${item.label}</span>
                  <span class="saved-password-date">${item.createdAt}</span>
              </div>
              <div class="saved-password-display">
                  <div class="saved-password-text">${item.password}</div>
              </div>
              <div class="saved-password-actions">
                  <button class="btn-small btn-copy-saved" onclick="copySavedPassword('${item.password}')">
                      📋 Copy
                  </button>
                  <button class="btn-small btn-delete" onclick="deleteSavedPassword(${item.id})">
                      🗑️ Delete
                  </button>
              </div>
          </div>
      `).join('');
}

async function copySavedPassword(password) {
  try {
      await navigator.clipboard.writeText(password);
      showToast('✅', 'Saved password copied!');
  } catch (err) {
      showToast('❌', 'Failed to copy password');
  }
}

function deleteSavedPassword(id) {
  const savedPasswords = getSavedPasswords();
  const filteredPasswords = savedPasswords.filter((p) => p.id !== id);
  localStorage.setItem('savedPasswords', JSON.stringify(filteredPasswords));

  updateSavedPasswordsList();
  showToast('🗑️', 'Password deleted!');
}

function clearAllPasswords() {
  if (confirm('Are you sure you want to delete all saved passwords?')) {
      localStorage.removeItem('savedPasswords');
      updateSavedPasswordsList();
      showToast('🧹', 'All passwords cleared!');
  }
}

function showToast(icon, message) {
  toastIcon.textContent = icon;
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
      toast.classList.remove('show');
  }, 3000);
}

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);
saveBtn.addEventListener('click', savePassword);
clearAllBtn.addEventListener('click', clearAllPasswords);
passwordOutput.addEventListener('click', copyToClipboard);

document.addEventListener('DOMContentLoaded', function () {
  updateSaveCounter();
  updateSavedPasswordsList();
  consoleFun();
});

function consoleFun() {
  console.log(`Hello, I guess you're an Engineer 😎`);
  console.log('Say Hi to me at: ');
  console.log('👍 adoolslimitless@gmail.com');
}