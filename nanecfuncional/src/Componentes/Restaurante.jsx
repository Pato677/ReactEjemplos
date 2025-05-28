import React, { useState } from "react";

const Restaurante = (props) => {
    const { nombre, direccion, tipo, url, onlike, onDislike } = props;
    ///usando un vector de estado para manejar los likes y dislikes
    const [preferencia, setpreferencia] = useState({
        likes: 0,
        dislikes: 0
    });

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
            <h2>{direccion}</h2>
            <h3>{tipo}</h3>
            <img src={url} alt={nombre} />
            <h4>Likes: {preferencia.likes}</h4>
            <button onClick={handlerLike}>Like</button>
            <h4>Dislikes: {preferencia.dislikes}</h4>
            <button onClick={handlerDislike}>Dislike</button>

        </div>
    );
};

export default Restaurante;
