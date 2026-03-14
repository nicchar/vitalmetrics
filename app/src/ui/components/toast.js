export function showToast(message, duration = 2500) {
  let toast = document.getElementById('vm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vm-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast visible';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
  }, duration);
}
