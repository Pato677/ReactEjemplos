import logo from './logo.svg';
import './App.css';
import Restaurante from './Componentes/Restaurante';




function App() {
  return (
    <div className="App">
      <Restaurante nombre="Restaurante 1" direccion="Calle 1" tipo="Comida rápida" url="https://th.bing.com/th/id/OIP.GF-tPZlefw89l346HxTf6wHaFl?rs=1&pid=ImgDetMain"/>
      <Restaurante nombre="Restaurante 2" direccion="Calle 2" tipo="Comida italiana" url="https://www.jet2holidays.com/HotelImages/Web/BCN_69819_H10_Itaca_0318_05.jpg?w=700"/>
      <Restaurante nombre="Restaurante 3" direccion="Calle 3" tipo="Comida mexicana" url="https://res.cloudinary.com/tf-lab/image/upload/w_520,h_520,c_fill,q_auto,f_auto/restaurant/2fb1fcf8-6f0f-4c6b-9bef-ec71022d8c23/62bc27c4-5945-4441-b4ff-0e8ecbe7d84e.jpg"/>
    </div>
  );
}

export default App;
