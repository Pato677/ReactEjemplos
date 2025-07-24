import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    return (
        <nav className="navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/home">🍽️ RestaurantApp</Link>
                </div>
                
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/home" className="nav-link">
                            🏠 Inicio
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/restaurantes" className="nav-link">
                            🍽️ Restaurantes
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/crear-restaurante" className="nav-link">
                            ➕ Crear Restaurante
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/tipos-comida" className="nav-link">
                            🍕 Tipos de Comida
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/usuarios" className="nav-link">
                            👥 Usuarios
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/auth" className="nav-link">
                            🔐 Autenticación
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
