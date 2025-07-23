import React, { useState } from "react";
import Restaurante from './Restaurante';
import './Restaurantes.css';
import { Link} from "react-router-dom";


const Listarestaurantes = (props) => {
  const {restaurantes, oneliminar} = props;
  
  const [likesTotales, setLikesTotales] = useState(0);
  const [mensaje, setMensaje] = useState("");

  const actualizarLikes = () => {
    setLikesTotales((prevState) => prevState + 1);
    actualizarMensaje("");
  }
  const actualizarDislikes = () => {
    setLikesTotales((prevState) => {
      if (prevState > 0) {
        return prevState - 1;
      } else {
        actualizarMensaje("No se puede disminuir los likes, no hay suficientes");
        return prevState;
      }
    })
  }
  const actualizarMensaje = (mensaje) => {
    setMensaje(mensaje);
  }

 



  return (
    <div className="container">
      <div className="restaurantes-header">
        <h1>🍽️ Lista de Restaurantes</h1>
        <div className="stats-container">
          <div className="stats-card">
            <h2>❤️ Likes Totales: {likesTotales}</h2>
          </div>
          {mensaje && (
            <div className="message message-error">
              ⚠️ {mensaje}
            </div>
          )}
        </div>
        <div className="action-buttons">
          <Link to="/home" className="btn btn-secondary">
            🏠 Volver al Inicio
          </Link>
          <Link to="/crear-restaurante" className="btn btn-primary">
            ➕ Crear Nuevo Restaurante
          </Link>
        </div>
      </div>

      <div id="restaurantes">
        {restaurantes.length === 0 ? (
          <div className="card text-center">
            <h3>😔 No hay restaurantes registrados</h3>
            <p>¡Empieza creando tu primer restaurante!</p>
          </div>
        ) : (
          restaurantes.map((restaurante, index) => (
            <Restaurante
              key={restaurante.id || index}
              nombre={restaurante.nombre}
              id={restaurante.id}
              direccion={restaurante.direccion}
              tipo={restaurante.tipo}
              url={restaurante.url}
              onlike={actualizarLikes}
              onDislike={actualizarDislikes}
              oneliminar={() => oneliminar(restaurante.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}



export default Listarestaurantes;