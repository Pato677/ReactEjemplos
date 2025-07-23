import React, {useState} from "react"
import { Link } from "react-router-dom";


const CrearRestaurante = ({agregarrestaurante})=> {
    //const {nombre, direccion, tipo, url, reputacion} = props;
    const[restaurantes, setRestaurantes] = useState({
        nombre: "",
        direccion: "",
        tipo: "",
        url: "",
        reputacion: 0
    });
        const onChangeDatos =(e) => {
            const {name, value} = e.target;
            setRestaurantes(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    const Agregar = (e) => {
        e.preventDefault();
        agregarrestaurante(restaurantes);
        setRestaurantes({
            nombre: "",
            direccion: "",
            tipo: "",
            url: "",
            reputacion: 0
        });
    }


    return (
        <form onSubmit={Agregar}>
            <h1>Agregar Restaurante</h1>

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
            
            <button type="submit">Agregar Restaurante</button>

            <Link to= "/home">Home</Link>
        </form>
        
    )
}
export default CrearRestaurante;