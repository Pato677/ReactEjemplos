import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Inicio = () => {
  const navigate = useNavigate();
   const handleCrear = () => {
    navigate("/crear-restaurante");
  } 
   const handleRestaurantes = () => {
    navigate("/restaurantes");
  }
  return (
    <div className="inicio">
      <h1>Bienvenido a la Aplicación de Restaurantes</h1>
      <p>Explora y disfruta de los mejores restaurantes cerca de ti.</p>
      <p>Para comenzar, dirígete a la sección de restaurantes.</p>
      <div>
        <Link to="/restaurantes">Lista de Restaurantes   </Link><br></br>
        <Link to="/crear-restaurante">Crear Restaurante</Link><br></br>
        <button onClick={handleCrear}>Crear Restaurante</button><br></br>
        <button onClick={handleRestaurantes}>Ver Restaurantes</button>
      </div>

      
     
    </div>
  );
}
export default Inicio;