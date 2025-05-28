import React, { useState } from "react";




const Restaurante = (props) => {
    const { nombre, direccion, tipo, url, onlike, onDislike } = props;

    /*
    const reaccion = [
        { tipo: "like", contador: 0 },
        { tipo: "dislike", contador: 0 }
    ]
    */
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
  
    return (
        <div className="restaurante">
            
            <h1>{nombre}</h1>
            <h2>{direccion}</h2>
            <h3>{tipo}</h3>
            <img src={url} alt={nombre} />
            <h4>Likes: {likes}</h4>
            <button onClick={handlerLike}>Like</button>
            <h4>Dislikes: {dislikes}</h4>
            <button onClick={handlerDislike}>Dislike</button>
            
        </div>
    );
};

export default Restaurante;
