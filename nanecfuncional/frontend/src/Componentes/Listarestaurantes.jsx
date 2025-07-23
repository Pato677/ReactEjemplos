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
    <div>
      <Link to="/home">Volver a la lista de restaurantes</Link>

      <h2>Registrar nuevo restaurante</h2>
      <h1>Likes totales: </h1>
      <h2>{likesTotales}</h2>
      <h1>{mensaje}</h1>
      {restaurantes.map((restaurante, index) => (
        <Restaurante
          key={index}
          nombre={restaurante.nombre}
          id={restaurante.id}
          direccion={restaurante.direccion}
          tipo={restaurante.tipo}
          url={restaurante.url}
          onlike={actualizarLikes}
          onDislike={actualizarDislikes}
          oneliminar={() => oneliminar(restaurante.id)}
          
          
       />
      ))}

    </div>

  );
}



export default Listarestaurantes;