import React, { useState } from "react";
import './Restaurantes.css';
import { useNavigate } from "react-router-dom";


const Restaurante = (props) => {
    const { id, nombre, direccion, tipo, url, onlike, onDislike, oneliminar} = props;
    ///usando un vector de estado para manejar los likes y dislikes
    const [preferencia, setpreferencia] = useState({
        likes: 0,
        dislikes: 0
    });
    const navigate = useNavigate();
    

    const handlerLike = () => {
        setpreferencia((prevState) => ({
            ...prevState, 
            likes: prevState.likes + 1
        }));
        onlike();
    };
    const handlerDislike = () => {
        setpreferencia((prevState) => ({
            ...prevState,
            dislikes: prevState.dislikes + 1
        }));
        onDislike();
   
    };

    const actualizar = () => {
    navigate("/actualizarrestaurantes/" + id);
  }
//definiendo como se comporta el componente Restaurante

/*
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    const handlerLike = () => {

        setLikes((prevstate) => {
            return (prevstate + 1)
        });
        onlike()

    }


    const handlerDislike = () => {
        setDislikes((prevstate => {
            return (prevstate + 1)
        }));
        onDislike()
    }
*/
    return (
        <div className="restaurante">
            <h1>{nombre}</h1>
            <h2>📍 {direccion}</h2>
            <h3>🍽️ {tipo}</h3>
            <img src={url} alt={nombre} />
            
            <div className="likes-container">
                <div className="like-section">
                    <h4>👍 Likes: {preferencia.likes}</h4>
                    <button onClick={handlerLike} className="btn btn-like">
                        👍 Me Gusta
                    </button>
                </div>
                <div className="like-section">
                    <h4>👎 Dislikes: {preferencia.dislikes}</h4>
                    <button onClick={handlerDislike} className="btn btn-dislike">
                        👎 No Me Gusta
                    </button>
                </div>
            </div>
            
            <div className="action-buttons">
                <button onClick={() => oneliminar(id)} className="btn btn-delete">
                    🗑️ Eliminar
                </button>
                <button onClick={actualizar} className="btn btn-edit">
                    ✏️ Editar
                </button>
            </div>
        </div>
    );
};

export default Restaurante;
