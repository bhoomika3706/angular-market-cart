.toast-message {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #0f172a;
  color: white;
  padding: 14px 20px;
  border-radius: 999px;
  font-size: 15px;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.25);
  z-index: 2000;
  animation: slideIn 0.25s ease;
}

.dark-mode .toast-message {
  background: #e5e7eb;
  color: #020617;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}