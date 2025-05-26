import React from "react";

class Restaurante extends React.Component {

     constructor(props){
            super(props);
            this.state = {likes: 0}
            this.handlerlike = this.handlerlike.bind(this);
        }

    handlerlike(){
            this.setState({
                likes: this.state.likes + 1
            });
    }
    render (){
        const { nombre, direccion, tipo,url } = this.props;
        return (
            <div className="restaurante">
                <h2>{nombre}</h2>
                <p>{direccion}</p>
                <p>{tipo}</p>
                <img src={url}/>
                <p>Likes: {this.state.likes}</p>
               
                <button onClick={this.handlerlike}>Like</button>
            </div>
        );

    }
}
export default Restaurante;
