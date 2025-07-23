import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TipoComida.css';

const TipoComida = () => {
    const [tiposComida, setTiposComida] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        paisOrigen: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = 'http://localhost:8000/api';

    // Cargar tipos de comida al montar el componente
    useEffect(() => {
        fetchTiposComida();
    }, []);

    // Obtener todos los tipos de comida
    const fetchTiposComida = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/tiposcomida`);
            setTiposComida(response.data.data);
            setError('');
        } catch (error) {
            console.error('Error al obtener tipos de comida:', error);
            setError('Error al cargar los tipos de comida');
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

    // Crear nuevo tipo de comida
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim() || !formData.paisOrigen.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/tipocomida/new`, formData);
            setSuccess('Tipo de comida creado exitosamente');
            setFormData({ nombre: '', paisOrigen: '' });
            fetchTiposComida();
            setError('');
        } catch (error) {
            console.error('Error al crear tipo de comida:', error);
            setError(error.response?.data?.message || 'Error al crear tipo de comida');
        } finally {
            setLoading(false);
        }
    };

    // Actualizar tipo de comida
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim() || !formData.paisOrigen.trim()) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`${API_URL}/tipocomida/${editingId}`, formData);
            setSuccess('Tipo de comida actualizado exitosamente');
            setFormData({ nombre: '', paisOrigen: '' });
            setEditingId(null);
            fetchTiposComida();
            setError('');
        } catch (error) {
            console.error('Error al actualizar tipo de comida:', error);
            setError(error.response?.data?.message || 'Error al actualizar tipo de comida');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar tipo de comida
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este tipo de comida?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`${API_URL}/tipocomida/${id}`);
            setSuccess('Tipo de comida eliminado exitosamente');
            fetchTiposComida();
            setError('');
        } catch (error) {
            console.error('Error al eliminar tipo de comida:', error);
            setError(error.response?.data?.message || 'Error al eliminar tipo de comida');
        } finally {
            setLoading(false);
        }
    };

    // Preparar edición
    const handleEdit = (tipoComida) => {
        setFormData({
            nombre: tipoComida.nombre,
            paisOrigen: tipoComida.paisOrigen
        });
        setEditingId(tipoComida.id);
        setError('');
        setSuccess('');
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setFormData({ nombre: '', paisOrigen: '' });
        setEditingId(null);
        setError('');
        setSuccess('');
    };

    // Limpiar mensajes después de 3 segundos
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div className="tipo-comida-container">
            <h1>Gestión de Tipos de Comida</h1>
            
            {/* Mensajes de estado */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            
            {/* Formulario */}
            <div className="form-section">
                <h2>{editingId ? 'Editar Tipo de Comida' : 'Crear Nuevo Tipo de Comida'}</h2>
                <form onSubmit={editingId ? handleUpdate : handleCreate} className="tipo-comida-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Ej: Pizza Italiana"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="paisOrigen">País de Origen:</label>
                        <input
                            type="text"
                            id="paisOrigen"
                            name="paisOrigen"
                            value={formData.paisOrigen}
                            onChange={handleInputChange}
                            placeholder="Ej: Italia"
                            required
                        />
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

            {/* Lista de tipos de comida */}
            <div className="list-section">
                <h2>Tipos de Comida Registrados ({tiposComida.length})</h2>
                
                {loading && <div className="loading">⏳ Cargando tipos de comida...</div>}
                
                {tiposComida.length === 0 && !loading ? (
                    <div className="no-data">
                        <p>📝 No hay tipos de comida registrados</p>
                        <p>¡Agrega el primer tipo de comida usando el formulario de arriba!</p>
                    </div>
                ) : (
                    <div className="tipos-grid">
                        {tiposComida.map((tipo) => (
                            <div key={tipo.id} className="tipo-card">
                                <div className="tipo-info">
                                    <h3>🍕 {tipo.nombre}</h3>
                                    <p><strong>🌍 País:</strong> {tipo.paisOrigen}</p>
                                    <p><strong>📅 Creado:</strong> {new Date(tipo.createdAt).toLocaleDateString('es-ES')}</p>
                                </div>
                                
                                <div className="tipo-actions">
                                    <button 
                                        onClick={() => handleEdit(tipo)}
                                        className="btn btn-edit"
                                        disabled={loading}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(tipo.id)}
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

export default TipoComida;
