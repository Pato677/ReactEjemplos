import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password }
                : { userName: formData.userName, email: formData.email, password: formData.password };

            const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
            
            const { token, userName, email } = response.data;
            
            // Guardar token en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userName', userName);
            localStorage.setItem('email', email);
            
            setMessage(isLogin ? '✅ ¡Inicio de sesión exitoso!' : '✅ ¡Registro exitoso!');
            
            // Limpiar formulario
            setFormData({ userName: '', email: '', password: '' });
            
            // Aquí puedes redirigir o actualizar el estado de la aplicación
            console.log('Usuario autenticado:', { userName, email, token });
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error en la operación';
            setMessage(`❌ ${errorMessage}`);
            console.error('Error de autenticación:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage('');
        setFormData({ userName: '', email: '', password: '' });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        setMessage('✅ Sesión cerrada correctamente');
    };

    const isLoggedIn = localStorage.getItem('token');

    if (isLoggedIn) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>👋 Bienvenido, {localStorage.getItem('userName')}!</h2>
                    <p>📧 {localStorage.getItem('email')}</p>
                    <button onClick={logout} className="btn btn-danger">
                        🚪 Cerrar Sesión
                    </button>
                    {message && <div className="message message-success">{message}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? '🔐 Iniciar Sesión' : '📝 Registro'}</h2>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">👤 Nombre de Usuario:</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                className="form-input"
                                required={!isLogin}
                                placeholder="Ingresa tu nombre de usuario"
                            />
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label className="form-label">📧 Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                            placeholder="Ingresa tu email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">🔒 Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                            placeholder="Ingresa tu contraseña"
                            minLength="6"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                    >
                        {loading ? '⏳ Procesando...' : (isLogin ? '🚀 Iniciar Sesión' : '📝 Registrarse')}
                    </button>
                </form>
                
                <div className="auth-switch">
                    <p>
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <button 
                            type="button" 
                            onClick={toggleMode}
                            className="btn-link"
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                        </button>
                    </p>
                </div>
                
                {message && (
                    <div className={`message ${message.includes('❌') ? 'message-error' : 'message-success'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
