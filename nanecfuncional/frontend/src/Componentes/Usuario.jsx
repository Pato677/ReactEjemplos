import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Usuario.css';

const Usuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:8000/api';

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Obtener todos los usuarios
    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/usuarios`);
            setUsuarios(response.data.data);
            setError('');
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Verificar disponibilidad de username
    const checkUsernameAvailability = async (username) => {
        if (!username || username.length < 3) return null;
        try {
            const response = await axios.get(`${API_URL}/usuario/check/username/${username}`);
            return response.data.available;
        } catch (error) {
            return null;
        }
    };

    // Verificar disponibilidad de email
    const checkEmailAvailability = async (email) => {
        if (!email || !email.includes('@')) return null;
        try {
            const response = await axios.get(`${API_URL}/usuario/check/email/${email}`);
            return response.data.available;
        } catch (error) {
            return null;
        }
    };

    // Crear nuevo usuario
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/usuario/new`, formData);
            setSuccess('Usuario creado exitosamente');
            setFormData({ username: '', email: '', password: '' });
            fetchUsuarios();
            setError('');
        } catch (error) {
            console.error('Error al crear usuario:', error);
            setError(error.response?.data?.message || 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    // Actualizar usuario
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.email.trim()) {
            setError('Username y email son obligatorios');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres (opcional)');
            return;
        }

        try {
            setLoading(true);
            // Solo enviar contraseña si fue proporcionada
            const updateData = { username: formData.username, email: formData.email };
            if (formData.password.trim()) {
                updateData.password = formData.password;
            }
            
            await axios.put(`${API_URL}/usuario/${editingId}`, updateData);
            setSuccess('Usuario actualizado exitosamente');
            setFormData({ username: '', email: '', password: '' });
            setEditingId(null);
            fetchUsuarios();
            setError('');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setError(error.response?.data?.message || 'Error al actualizar usuario');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar usuario
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${API_URL}/usuario/${id}`);
            setSuccess('Usuario eliminado exitosamente');
            fetchUsuarios();
            setError('');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setError(error.response?.data?.message || 'Error al eliminar usuario');
        } finally {
            setLoading(false);
        }
    };

    // Preparar edición
    const handleEdit = (usuario) => {
        setFormData({
            username: usuario.username,
            email: usuario.email,
            password: '' // No mostrar la contraseña actual por seguridad
        });
        setEditingId(usuario.id);
        setError('');
        setSuccess('');
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setFormData({ username: '', email: '', password: '' });
        setEditingId(null);
        setError('');
        setSuccess('');
    };

    // Buscar usuarios
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchUsuarios();
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/usuarios/search?search=${searchTerm}`);
            setUsuarios(response.data.data);
            setError('');
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            setError('Error al buscar usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Limpiar mensajes después de 3 segundos
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div className="usuario-container">
            <h1>Gestión de Usuarios</h1>
            
            {/* Mensajes de estado */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {/* Formulario */}
            <div className="form-section">
                <h2>{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                <form onSubmit={editingId ? handleUpdate : handleCreate} className="usuario-form">
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Ej: juanperez"
                            required
                            pattern="[a-zA-Z0-9]+"
                            title="Solo letras y números"
                            minLength="3"
                            maxLength="50"
                        />
                        <small>Solo letras y números, entre 3 y 50 caracteres</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Ej: juan.perez@email.com"
                            required
                            maxLength="100"
                        />
                        <small>Formato de email válido, máximo 100 caracteres</small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">
                            Contraseña {editingId ? '(opcional - dejar vacío para no cambiar)' : ''}:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={editingId ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                            required={!editingId}  // Obligatorio solo al crear
                            minLength="6"
                            maxLength="100"
                        />
                        <small>
                            {editingId 
                                ? 'Dejar vacío si no deseas cambiar la contraseña' 
                                : 'Mínimo 6 caracteres, máximo 100'
                            }
                        </small>
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Procesando...' : (editingId ? 'Actualizar' : 'Crear')}
                        </button>
                        
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={handleCancelEdit}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Búsqueda */}
            <div className="search-section">
                <h2>Buscar Usuarios</h2>
                <div className="search-form">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre de usuario..."
                        className="search-input"
                    />
                    <button 
                        onClick={handleSearch}
                        className="btn btn-search"
                        disabled={loading}
                    >
                        🔍 Buscar
                    </button>
                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            fetchUsuarios();
                        }}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        🧹 Limpiar
                    </button>
                </div>
            </div>

            {/* Lista de usuarios */}
            <div className="list-section">
                <h2>Usuarios Registrados ({usuarios.length})</h2>
                
                {loading && <div className="loading">⏳ Cargando usuarios...</div>}
                
                {usuarios.length === 0 && !loading ? (
                    <div className="no-data">
                        <p>👥 {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}</p>
                        {!searchTerm && <p>¡Agrega el primer usuario usando el formulario de arriba!</p>}
                    </div>
                ) : (
                    <div className="usuarios-grid">
                        {usuarios.map((usuario) => (
                            <div key={usuario.id} className="usuario-card">
                                <div className="usuario-info">
                                    <h3>👤 @{usuario.username}</h3>
                                    <p><strong>📧 Email:</strong> {usuario.email}</p>
                                    <p><strong>🆔 ID:</strong> {usuario.id}</p>
                                    <p><strong>📅 Creado:</strong> {new Date(usuario.createdAt).toLocaleDateString('es-ES')}</p>
                                    <p><strong>🔄 Actualizado:</strong> {new Date(usuario.updatedAt).toLocaleDateString('es-ES')}</p>
                                </div>
                                
                                <div className="usuario-actions">
                                    <button 
                                        onClick={() => handleEdit(usuario)}
                                        className="btn btn-edit"
                                        disabled={loading}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(usuario.id)}
                                        className="btn btn-delete"
                                        disabled={loading}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Usuario;
