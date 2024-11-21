import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');
const chatRoomId = 1; // Sala global

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const userId = localStorage.getItem('user_id'); 

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Debes iniciar sesión.');
            window.location.href = '/';
            return;
        }

        // Cargar mensajes previos desde el servidor
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:4000/messages', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    alert('Error al cargar mensajes.');
                }
            } catch (error) {
                console.error('Error al obtener mensajes:', error);
                alert('Error al cargar mensajes.');
            }
        };

        fetchMessages();

        // Unirse a la sala con Socket.IO
        socket.emit('join-room', chatRoomId);

        // Escuchar mensajes en tiempo real
        socket.on('new-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('new-message');
            socket.emit('leave-room', chatRoomId);
        };
    }, []);

    const sendMessage = async () => {
        const token = localStorage.getItem('token');

        if (!newMessage.trim()) {
            alert('No puedes enviar un mensaje vacío.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newMessage }),
            });

            if (response.ok) {
                setNewMessage('');
            } else {
                alert('Error al enviar el mensaje.');
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar el mensaje.');
        }
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                <h2>Chat Global</h2>
            </div>

            <div style={styles.messageArea}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            alignSelf: msg.user_id === userId ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.user_id === userId ? '#DCF8C6' : '#FFF',
                        }}
                    >
                        <p style={styles.messageUser}>
                            {msg.users ? msg.users.username : 'Usuario desconocido'}
                        </p>
                        <p style={styles.messageContent}>{msg.content}</p>
                    </div>
                ))}
            </div>

            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.sendButton}>
                    Enviar
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        backgroundColor: '#075E54',
        color: '#FFF',
        padding: '10px',
        textAlign: 'center',
    },
    messageArea: {
        flex: 1,
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: '#ECE5DD',
    },
    message: {
        maxWidth: '70%',
        marginBottom: '10px',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    messageUser: {
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    messageContent: {
        fontSize: '14px',
        margin: 0,
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        borderTop: '1px solid #ddd',
        backgroundColor: '#FFF',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '20px',
        border: '1px solid #ddd',
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px 20px',
        backgroundColor: '#25D366',
        color: '#FFF',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
    },
};

export default ChatRoom;
