import api, { BASE_URL } from "../api/config";
import React from "react";

const AxiosObtenerRestaurantes = () => {
    const [restaurantes, setRestaurantes] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [showForm, setShowForm] = React.useState(false);
    const [editingRestaurante, setEditingRestaurante] = React.useState(null);
    const [formData, setFormData] = React.useState({
        nombre: '',
        direccion: '',
        tipo: '',
        url: ''
    });

    // Obtener todos los restaurantes
    const obtenerRestaurantes = () => {
        setLoading(true);
        setError(null);
        console.log('🔄 Iniciando obtención de restaurantes...');
        
        // Primero probamos si el servidor está funcionando
        api.get("/api/test")
        .then(() => {
            console.log('✅ Test de conexión exitoso, obteniendo restaurantes...');
            // Si la prueba funciona, obtenemos los restaurantes
            return api.get("/api/restaurantes");
        })
        .then(response => {
            console.log('📡 Respuesta completa del servidor:', response);
            console.log('📊 Datos de la respuesta:', response.data);
            console.log('🍽️ Array de restaurantes:', response.data.data);
            
            const restaurantesData = response.data.data || response.data;
            console.log('🎯 Datos que se van a setear:', restaurantesData);
            console.log('📈 Cantidad de restaurantes:', restaurantesData.length);
            
            setRestaurantes(restaurantesData);
            setLoading(false);
            console.log('✅ Estado actualizado correctamente');
        })
        .catch(error => {
            console.error('❌ Error completo:', error);
            setError(error.message);
            setLoading(false);
        });
    };

    // Crear nuevo restaurante
    const crearRestaurante = (e) => {
        e.preventDefault();
        setLoading(true);
        
        api.post("/api/restaurante/new", formData)
        .then(response => {
            console.log('Restaurante creado:', response.data);
            setFormData({ nombre: '', direccion: '', tipo: '', url: '' });
            setShowForm(false);
            obtenerRestaurantes(); // Recargar la lista
        })
        .catch(error => {
            console.error('Error al crear restaurante:', error);
            setError('Error al crear el restaurante');
            setLoading(false);
        });
    };

    // Actualizar restaurante
    const actualizarRestaurante = (e) => {
        e.preventDefault();
        setLoading(true);
        
        api.put(`/api/restaurante/${editingRestaurante.id}`, formData)
        .then(response => {
            console.log('Restaurante actualizado:', response.data);
            setFormData({ nombre: '', direccion: '', tipo: '', url: '' });
            setEditingRestaurante(null);
            setShowForm(false);
            obtenerRestaurantes(); // Recargar la lista
        })
        .catch(error => {
            console.error('Error al actualizar restaurante:', error);
            setError('Error al actualizar el restaurante');
            setLoading(false);
        });
    };

    // Eliminar restaurante
    const eliminarRestaurante = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este restaurante?')) {
            api.delete(`/api/restaurante/${id}`)
            .then(response => {
                console.log('Restaurante eliminado:', response.data);
                obtenerRestaurantes(); // Recargar la lista
            })
            .catch(error => {
                console.error('Error al eliminar restaurante:', error);
                setError('Error al eliminar el restaurante');
            });
        }
    };

    // Dar like a un restaurante
    const darLike = (id) => {
        api.put(`/api/restaurante/${id}/like`)
        .then(response => {
            console.log('Like agregado:', response.data);
            obtenerRestaurantes(); // Recargar la lista para mostrar el nuevo conteo
        })
        .catch(error => {
            console.error('Error al dar like:', error);
            setError('Error al dar like');
        });
    };

    // Dar dislike a un restaurante
    const darDislike = (id) => {
        api.put(`/api/restaurante/${id}/dislike`)
        .then(response => {
            console.log('Dislike agregado:', response.data);
            obtenerRestaurantes(); // Recargar la lista para mostrar el nuevo conteo
        })
        .catch(error => {
            console.error('Error al dar dislike:', error);
            setError('Error al dar dislike');
        });
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Abrir formulario para crear
    const abrirFormularioCrear = () => {
        setFormData({ nombre: '', direccion: '', tipo: '', url: '' });
        setEditingRestaurante(null);
        setShowForm(true);
    };

    // Abrir formulario para editar
    const abrirFormularioEditar = (restaurante) => {
        setFormData({
            nombre: restaurante.nombre,
            direccion: restaurante.direccion,
            tipo: restaurante.tipo,
            url: restaurante.url || ''
        });
        setEditingRestaurante(restaurante);
        setShowForm(true);
    };

    // Cancelar formulario
    const cancelarFormulario = () => {
        setFormData({ nombre: '', direccion: '', tipo: '', url: '' });
        setEditingRestaurante(null);
        setShowForm(false);
    };

    // Prueba simple de conexión sin async/await
    const pruebaSimple = () => {
        console.log('🧪 Iniciando prueba simple...');
        setLoading(true);
        setError(null);
        
        fetch(`${BASE_URL}/api/test`)
            .then(response => {
                console.log('📡 Response status:', response.status);
                console.log('📡 Response headers:', response.headers);
                return response.json();
            })
            .then(data => {
                console.log('✅ Datos recibidos con fetch:', data);
                alert('✅ Conexión exitosa con fetch!');
                setLoading(false);
            })
            .catch(error => {
                console.error('❌ Error con fetch:', error);
                setError(`Error con fetch: ${error.message}`);
                setLoading(false);
            });
    };

    // Prueba con axios simplificada
    const pruebaAxios = () => {
        console.log('🔧 Iniciando prueba con axios...');
        setLoading(true);
        setError(null);
        
        api.get('/api/test', {
            timeout: 10000, // 10 segundos de timeout
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log('✅ Respuesta axios exitosa:', response);
            alert('✅ Conexión exitosa con axios!');
            setLoading(false);
        })
        .catch(error => {
            console.error('❌ Error axios completo:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error config:', error.config);
            setError(`Error axios: ${error.message} (${error.code || 'unknown'})`);
            setLoading(false);
        });
    };

  // Log para debugging cada vez que cambia el estado
  React.useEffect(() => {
    console.log('🔄 Estado actualizado - Restaurantes:', restaurantes);
    console.log('📊 Cantidad actual:', restaurantes.length);
    console.log('⏳ Loading:', loading);
    console.log('❌ Error:', error);
  }, [restaurantes, loading, error]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestión de Restaurantes</h2>
      
      {/* Debug info */}
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        marginBottom: '20px', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <strong>🔍 Debug Info:</strong><br/>
        Restaurantes en estado: {restaurantes.length}<br/>
        Loading: {loading ? 'Sí' : 'No'}<br/>
        Error: {error || 'Ninguno'}<br/>
        Primer restaurante: {restaurantes[0] ? restaurantes[0].nombre : 'N/A'}
      </div>
      
      {/* Botones principales */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={pruebaSimple} 
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          🧪 Prueba con Fetch
        </button>
        
        <button 
          onClick={pruebaAxios} 
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          � Prueba con Axios
        </button>
        
        <button 
          onClick={obtenerRestaurantes} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {loading ? 'Cargando...' : 'Obtener Restaurantes'}
        </button>
        
        <button 
          onClick={abrirFormularioCrear}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Crear Nuevo Restaurante
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div style={{color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid #ff0000', borderRadius: '4px'}}>
          {error}
        </div>
      )}

      {/* Formulario para crear/editar */}
      {showForm && (
        <div style={{ 
          margin: '20px 0', 
          padding: '20px', 
          border: '2px solid #007bff', 
          borderRadius: '8px', 
          backgroundColor: '#f8f9fa' 
        }}>
          <h3>{editingRestaurante ? 'Editar Restaurante' : 'Crear Nuevo Restaurante'}</h3>
          <form onSubmit={editingRestaurante ? actualizarRestaurante : crearRestaurante}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nombre del Restaurante:
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="Ej: La Parrilla Dorada"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Dirección:
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="Ej: Av. Amazonas N24-03, Quito"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Tipo de Cocina:
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">Selecciona un tipo</option>
                <option value="Italiano">Italiano</option>
                <option value="Mexicano">Mexicano</option>
                <option value="Parrillada">Parrillada</option>
                <option value="Mariscos">Mariscos</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Comida Rápida">Comida Rápida</option>
                <option value="Oriental">Oriental</option>
                <option value="Ecuatoriano">Ecuatoriano</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                URL de la Imagen (opcional):
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  marginRight: '10px' 
                }}
              >
                {loading ? 'Guardando...' : (editingRestaurante ? 'Actualizar' : 'Crear')}
              </button>
              
              <button 
                type="button" 
                onClick={cancelarFormulario}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px' 
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contador de restaurantes */}
      {restaurantes.length > 0 && (
        <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
          Total de restaurantes: {restaurantes.length}
        </p>
      )}

      {/* Lista de restaurantes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
        {restaurantes.map((restaurante) => (
          <div 
            key={restaurante.id} 
            style={{
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px', 
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{restaurante.nombre}</h3>
            <p><strong>Dirección:</strong> {restaurante.direccion}</p>
            <p><strong>Tipo:</strong> {restaurante.tipo}</p>
            
            {restaurante.url && (
              <img 
                src={restaurante.url} 
                alt={restaurante.nombre}
                style={{
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '4px', 
                  margin: '10px 0'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}

            {/* Likes y Dislikes */}
            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button 
                  onClick={() => darLike(restaurante.id)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  👍 {restaurante.likes || 0}
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button 
                  onClick={() => darDislike(restaurante.id)}
                  style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  👎 {restaurante.dislikes || 0}
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button 
                onClick={() => abrirFormularioEditar(restaurante)}
                style={{ 
                  padding: '8px 15px', 
                  backgroundColor: '#ffc107', 
                  color: 'black', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Editar
              </button>
              
              <button 
                onClick={() => eliminarRestaurante(restaurante.id)}
                style={{ 
                  padding: '8px 15px', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>

            {/* Información adicional */}
            <small style={{ color: '#666', marginTop: '10px', display: 'block' }}>
              <strong>Creado:</strong> {new Date(restaurante.createdAt).toLocaleDateString('es-ES')}
              {restaurante.updatedAt && (
                <> | <strong>Actualizado:</strong> {new Date(restaurante.updatedAt).toLocaleDateString('es-ES')}</>
              )}
            </small>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay restaurantes */}
      {restaurantes.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>No hay restaurantes disponibles</p>
          <p>Haz clic en "Obtener Restaurantes" para cargar los datos o "Crear Nuevo Restaurante" para agregar uno.</p>
        </div>
      )}
    </div>
  );
}

export default AxiosObtenerRestaurantes;