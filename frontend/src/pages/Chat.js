import React, { useEffect } from 'react';
import ChatRoom from '../components/ChatRoom'; 

const Chat = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Validar que el usuario esté autenticado
    if (!token) {
      alert('Debes iniciar sesión.');
      window.location.href = '/';
      return;
    }
  }, []);

  return <ChatRoom />; 
};

export default Chat;
