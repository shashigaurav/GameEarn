// js/admin/toast.js
export function showToast(message, type = "success", duration = 4000) {
  const stack = document.getElementById("toastStack");
  if (!stack) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s ease";
    setTimeout(() => el.remove(), 300);
  }, duration);
}
