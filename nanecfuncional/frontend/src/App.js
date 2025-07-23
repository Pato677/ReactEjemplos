import { BrowserRouter, Routes , Route} from 'react-router-dom';
import './App.css';
import Listarestaurantes from './Componentes/Listarestaurantes';
import Inicio from './Componentes/Inicio';
import CrearRestaurante from './Componentes/CrearRestaurante';
import ObtenerRestaurantes from './Componentes/AxiosObtenerRestaurantes';
import ActualizarRestaurantes from './Componentes/ActualizarRestaurantes';
import TipoComida from './Componentes/TipoComida';
import Usuario from './Componentes/Usuario';
import Navigation from './Componentes/Navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

/*
const restaurantes = [
      {
        nombre: "Restaurante 1",
        direccion: "Calle 1",
        tipo: "Comida rápida",
        url: "https://th.bing.com/th/id/OIP.GF-tPZlefw89l346HxTf6wHaFl?rs=1&pid=ImgDetMain"
      },
      {
        nombre: "Restaurante 2",
        direccion: "Calle 2",
        tipo: "Comida italiana",
        url: "https://www.jet2holidays.com/HotelImages/Web/BCN_69819_H10_Itaca_0318_05.jpg?w=700"
      },
      {
        nombre: "Restaurante 3",
        direccion: "Calle 3",
        tipo: "Comida mexicana",
        url: "https://res.cloudinary.com/tf-lab/image/upload/w_520,h_520,c_fill,q_auto,f_auto/restaurant/2fb1fcf8-6f0f-4c6b-9bef-ec71022d8c23/62bc27c4-5945-4441-b4ff-0e8ecbe7d84e.jpg"
      }
    ];
  */
const restaurantes = [];

function App() {


  const [lrestaurantes, setlrestaurantes] = useState(restaurantes);
  useEffect(() => {
    // Cargar los restaurantes al iniciar la aplicación
    obtenerRestaurantes();
 }, []);


 ///para mostrar la lista de restaurantes 
 const obtenerRestaurantes = () => {
   axios.get("http://localhost:8000/api/restaurantes")
        .then(response => {
            console.log("Respuesta del servidor:", response.data);
            setlrestaurantes(response.data.data); // Acceder al array dentro de data
        })
        .catch(error => {
            console.error("Error al obtener restaurantes:", error);
        });
 }

 /////para agregar un restaurante

 const agregarRestaurante = (nuevoRestaurante) => {
  axios.post("http://localhost:8000/api/restaurante/new", nuevoRestaurante)
        .then(response => {
            console.log("Restaurante creado:", response.data);
            setlrestaurantes((prevRestaurantes) => [...prevRestaurantes, response.data.data]);
        })
        .catch(error => {
            console.error("Error al agregar el restaurante:", error);
        });
  }

  //para eliminar un restaurante

  const eliminarrestaurante = (id) => {
    axios.delete('http://localhost:8000/api/restaurante/' + id)
        .then(() => {
            console.log("Restaurante eliminado con ID:", id);
            setlrestaurantes((prevRestaurantes) => prevRestaurantes.filter(restaurante => restaurante.id !== id));
        })
        .catch(error => {
            console.error("Error al eliminar el restaurante:", error);
        });
      }

  //para actualizar un restaurante
  
  const actualizarRestaurante = (restauranteActualizado) => {
  console.log("Actualizando restaurante:", restauranteActualizado + "id" + restauranteActualizado.id);
    axios.put("http://localhost:8000/api/restaurante/" + restauranteActualizado.id, restauranteActualizado)
      .then(response => {
      console.log("Restaurante actualizado:", response.data);
      setlrestaurantes(prevRestaurantes => prevRestaurantes.map(restaurante => 
        restaurante.id === restauranteActualizado.id ? response.data.data : restaurante
      ));
      })
      .catch(error => console.error('Error al actualizar el restaurante:', error));
  }

 return (
    <div className="App">

      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path={"/home"} element={<Inicio/>} />
          <Route path={"/restaurantes"} element={<Listarestaurantes restaurantes = {lrestaurantes} oneliminar = {eliminarrestaurante} />}  />
          <Route path={"/crear-restaurante"} element={<CrearRestaurante agregarrestaurante = {agregarRestaurante}/>} />
          <Route path={"/obtenerestaurantes"} element={<ObtenerRestaurantes/>} />
          <Route path="/actualizarrestaurantes/:id" element={<ActualizarRestaurantes lrestaurantes = {lrestaurantes} setlrestaurantes= {setlrestaurantes} actualizarRestaurante = {actualizarRestaurante} />} />
          <Route path={"/tipos-comida"} element={<TipoComida/>} />
          <Route path={"/usuarios"} element={<Usuario/>} />
        </Routes>
      </BrowserRouter>
      

    </div>
  );

}

export default App;
