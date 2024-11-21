import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
    const handleLogin = async (formData) => {
        const { email, password } = formData;
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const { token, user_id } = await response.json(); 
                localStorage.setItem('token', token);
                localStorage.setItem('user_id', user_id); // Guarda el ID del usuario
                window.location.href = '/chat';
            } else {
                alert('Error al iniciar sesión. Verifica tus credenciales.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al intentar iniciar sesión.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Bienvenido</h1>
                    <p style={styles.subtitle}>Inicia sesión para comenzar a chatear</p>
                </div>
                <LoginForm onLogin={handleLogin} />
                <p style={styles.footerText}>
                    ¿No tienes una cuenta?{' '}
                    <a href="/register" style={styles.link}>
                        Regístrate aquí
                    </a>.
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #075E54, #128C7E)', 
        fontFamily: "'Arial', sans-serif",
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    header: {
        marginBottom: '20px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#075E54', 
    },
    subtitle: {
        fontSize: '16px',
        color: '#4CAF50', 
        marginBottom: '20px',
    },
    footerText: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#666',
    },
    link: {
        color: '#25D366', 
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    linkHover: {
        textDecoration: 'underline',
    },
};

export default Login;
