import logo from './logo.svg';
import './App.css'
import Restaurante from './Componentes/Restaurante';


const restaurantes = [
  {
    nombre: "Restaurante 1",
    direccion: "Calle 1",
    tipo: "Comida rápida",
    url: "https://via.placeholder.com/150"
  },
  {
    nombre: "Restaurante 2",
    direccion: "Calle 2",
    tipo: "Comida italiana",
    url: "https://via.placeholder.com/150"
  },
  {
    nombre: "Restaurante 3",
    direccion: "Calle 3",
    tipo: "Comida mexicana",
    url: "https://via.placeholder.com/150"
  }
];

function App() {
  return (
    <div className="App">
     {restaurantes.map(
      (restaurante, index) => (
        <Restaurante
          key={index}
          nombre={restaurante.nombre}
          direccion={restaurante.direccion}
          tipo={restaurante.tipo}
          url={restaurante.url}
        />
      )
     )  }   
    
    </div>
  );
}

export default App;
