import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
    const handleRegister = async (formData) => {
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/';
        } else {
            alert(data.message || 'Error al registrar usuario.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Crear Cuenta</h1>
                    <p style={styles.subtitle}>
                        ¡Únete ahora! Es rápido y fácil.
                    </p>
                </div>
                <RegisterForm onRegister={handleRegister} />
                <p style={styles.footerText}>
                    ¿Ya tienes una cuenta? <a href="/" style={styles.link}>Inicia sesión aquí</a>.
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

export default Register;
