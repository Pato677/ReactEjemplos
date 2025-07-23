import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const ActualizarRestaurantes = (props) => {
     //const {nombre, direccion, tipo, url, reputacion} = props;
     const {actualizarRestaurante} = props;
     const {id} = useParams();
    const navigate = useNavigate();

    const [restaurantes, setRestaurantes] = useState({
        nombre: "",
        direccion: "",
        tipo: "",
        url: "",
        reputacion: "1"
    });

    const cargarRestaurante = useCallback(() => {
        console.log("Cargando restaurante con ID:", id);
        axios.get("http://localhost:8000/api/restaurantes/" + id)
            
            .then(response => {
                console.log(response.data);
                setRestaurantes({
                    nombre: response.data.nombre || "",
                    direccion: response.data.direccion || "",
                    tipo: response.data.tipo || "",
                    url: response.data.url || "",
                    reputacion: response.data.reputacion !== undefined && response.data.reputacion !== null
                        ? String(response.data.reputacion)
                        : "1"
                });
            })
            .catch(error => {
                console.error("Error al cargar el restaurante:", error);
            });
    }, [id]);

    useEffect(() => {
        cargarRestaurante();
    }, [cargarRestaurante]);

    const onChangeDatos = (e) => {
        const { name, value } = e.target;
        setRestaurantes(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const actualizar = (e) => {
        e.preventDefault();
        console.log("Actualizando restaurante:", restaurantes);
        actualizarRestaurante({ ...restaurantes, id: id });
        navigate("/home");
    }
       
    return (
        <form onSubmit={actualizar}>
            <h1>Actualizar Restaurante</h1>

            <label htmlFor="nombre">Nombre del Restaurante:</label>
            <input type="text" id="nombre" name="nombre" required value={restaurantes.nombre} onChange={onChangeDatos}/>
            <br />

            <label htmlFor="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" required value={restaurantes.direccion} onChange={onChangeDatos}/>
            <br />
 
            <label htmlFor="tipo">Tipo de Comida:</label>
            <input type="text" id="tipo" name="tipo" required value={restaurantes.tipo} onChange={onChangeDatos}/>
            <br />
        
            <label htmlFor="url">URL de la Imagen:</label>
            <input type="url" id="url" name="url" required value={restaurantes.url} onChange={onChangeDatos}/>
            <br />
            
            <label htmlFor="reputacion">Reputación:</label>
            <input type="number" id="reputacion" name="reputacion" min="1" max="5" required value={restaurantes.reputacion} onChange={onChangeDatos}/>
            <br />
            
            <button type="submit">Actualizar Restaurante</button>

            <Link to= "/home">Home</Link>
        </form>
        
    )
}

export default ActualizarRestaurantes;