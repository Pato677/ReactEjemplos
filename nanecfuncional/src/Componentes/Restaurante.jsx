import React, { useState } from "react";

const Restaurante = (props) => {
    const { nombre, direccion, tipo, url } = props;
    const [likes, setLikes] = useState(0);

    const handlerLike = () => {
        setLikes(likes + 1);
    };

    return (
        <div className="restaurante">
            <h1>{nombre}</h1>
            <h2>{direccion}</h2>
            <h3>{tipo}</h3>
            <img src={url} alt={nombre} />
            <h4>Likes: {likes}</h4>
            <button onClick={handlerLike}>Like</button>
        </div>
    );
};

export default Restaurante;
