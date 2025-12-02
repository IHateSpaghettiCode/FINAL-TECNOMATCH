import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              backgroundColor: toast.type === 'success' ? '#4CAF50' : toast.type === 'error' ? '#f44336' : toast.type === 'warning' ? '#ff9800' : '#2196F3',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              minWidth: '250px',
              animation: 'slideIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards'
            }}
            onAnimationEnd={(e) => {
              if (e.animationName === 'fadeOut') {
                removeToast(toast.id);
              }
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
