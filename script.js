// My password generation arrays
const lettersUpper1 = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const letterslower1 = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];
const symbols1 = [
  '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '=', '+',
  '[', ']', ';', '?', '~',
];
const numbers1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const letterslower2 = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
];
const lettersUpper2 = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const symbols2 = [
  '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '=', '+',
  '[', ']', ';', '?', '~',
];
const numbers2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const symbols3 = [
  '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '=', '+',
  '[', ']', ';', '/', '?', '~',
];

// CSS for newly generated content animation
const newContentCSS = `
.newly-generated {
    animation: newContentGlow 2s ease-out;
    position: relative;
    overflow: hidden;
}

.newly-generated::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: newContentSweep 1.5s ease-out;
}

@keyframes newContentGlow {
    0% {
        background: rgba(72, 202, 178, 0.3);
        box-shadow: 0 0 20px rgba(72, 202, 178, 0.6);
        transform: scale(1.02);
    }
    100% {
        background: transparent;
        box-shadow: none;
        transform: scale(1);
    }
}

@keyframes newContentSweep {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}
`;

// Add the CSS to the head of the document
const style = document.createElement('style');
style.textContent = newContentCSS;
document.head.appendChild(style);


const passwordOutput = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const savedPasswordsList = document.getElementById('savedPasswordsList');
const clearAllBtn = document.getElementById('clearAllBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Current generated password
let currentPassword = '';

// getRandom function
function getRandom() {
  const lettersUpper1index = Math.floor(Math.random() * lettersUpper1.length);
  const lettersUpper1result = lettersUpper1[lettersUpper1index];

  const numbers1index = Math.floor(Math.random() * numbers1.length);
  const numbers1result = numbers1[numbers1index];

  const symbols1index = Math.floor(Math.random() * symbols1.length);
  const symbols1result = symbols1[symbols1index];

  const letterslower1index = Math.floor(Math.random() * letterslower1.length);
  const letterslower1result = letterslower1[letterslower1index];

  const lettersUpper2index = Math.floor(Math.random() * lettersUpper2.length);
  const lettersUpper2result = lettersUpper2[lettersUpper2index];

  const numbers2index = Math.floor(Math.random() * numbers2.length);
  const numbers2result = numbers2[numbers2index];

  const symbols2index = Math.floor(Math.random() * symbols2.length);
  const symbols2result = symbols2[symbols2index];

  const lettersLower2index = Math.floor(Math.random() * letterslower2.length);
  const letterslower2result = letterslower2[lettersLower2index];

  const symbols3index = Math.floor(Math.random() * symbols3.length);
  const symbols3result = symbols3[symbols3index];

  const finalResult = `${lettersUpper1result}${numbers1result}${symbols1result}${letterslower1result}${lettersUpper2result}${numbers2result}${symbols2result}${letterslower2result}${symbols3result}`;
  
  return finalResult;
}

// Generate password and display
function generatePassword() {
  currentPassword = getRandom();
  passwordOutput.value = currentPassword;
  
  // Add glow animation
  passwordOutput.classList.add('newly-generated');
  setTimeout(() => {
    passwordOutput.classList.remove('newly-generated');
  }, 2000);
  
  showToast('🎉 New password generated!');
}

// Copy to clipboard
async function copyToClipboard() {
  if (!currentPassword) {
    showToast('❌ No password to copy!');
    return;
  }

    await navigator.clipboard.writeText(currentPassword);
    showToast('✅ Password copied to clipboard!');

}

// Save password to local storage
function savePassword() {
  if (!currentPassword) {
    showToast('❌ No password to save!');
    return;
  }

  const savedPasswords = getSavedPasswords();
  const newPassword = {
    id: Date.now(),
    password: currentPassword,
    createdAt: new Date().toLocaleString(),
    label: `Password ${savedPasswords.length + 1}`
  };

  savedPasswords.unshift(newPassword);
  localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
  
  updateSavedPasswordsList();
  showToast('💾 Password saved successfully!');
}

// Get saved passwords from local storage
function getSavedPasswords() {
  const saved = localStorage.getItem('savedPasswords');
  return saved ? JSON.parse(saved) : [];
}

// Update saved passwords display
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
  
  savedPasswordsList.innerHTML = savedPasswords.map(item => `
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

// Copy saved password
async function copySavedPassword(password) {
  try {
    await navigator.clipboard.writeText(password);
    showToast('✅ Saved password copied!');
  } catch (err) {
    showToast('❌ Failed to copy password');
  }
}

// Delete saved password
function deleteSavedPassword(id) {
  const savedPasswords = getSavedPasswords();
  const filteredPasswords = savedPasswords.filter(p => p.id !== id);
  localStorage.setItem('savedPasswords', JSON.stringify(filteredPasswords));
  
  updateSavedPasswordsList();
  showToast('🗑️ Password deleted!');
}

// Clear all saved passwords
function clearAllPasswords() {
  if (confirm('Are you sure you want to delete all saved passwords?')) {
    localStorage.removeItem('savedPasswords');
    updateSavedPasswordsList();
    showToast('🧹 All passwords cleared!');
    console.log('Passwords cleared!')
  }
}

// Show toast notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Event listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);
saveBtn.addEventListener('click', savePassword);
clearAllBtn.addEventListener('click', clearAllPasswords);

// Allow clicking on password output to copy
passwordOutput.addEventListener('click', copyToClipboard);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateSavedPasswordsList();
  consoleFun()

});

function consoleFun(){
  console.log(`Hello, I guess you're an Engineer 😎`)
  console.log('Contact me at: ')
  console.log('👍 adoolslimitless@gmail.com')
}