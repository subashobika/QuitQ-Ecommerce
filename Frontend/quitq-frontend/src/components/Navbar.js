import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { 
  FaThLarge, 
  FaShoppingCart, 
  FaUserCircle, 
  FaHome, 
  FaList, 
  FaClipboardList, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false); 
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
       
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <img 
            src={logo} 
            alt="QuitQ Logo" 
            style={{ height: '60px', width: 'auto' }} 
          />
        </Link>

      
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <FaTimes style={{ color: 'white', fontSize: '1.5rem' }} />
          ) : (
            <FaBars style={{ color: 'white', fontSize: '1.5rem' }} />
          )}
        </button>

       
        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="navbarNav">
          {!user && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink end className="nav-link" to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink end className="nav-link" to="/register" onClick={closeMenu}>
                  Register
                </NavLink>
              </li>
            </ul>
          )}

          {user && (
            <ul className="navbar-nav ms-auto align-items-center">
              {user.role === 'USER' && (
                <>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link d-flex align-items-center" to="/" onClick={closeMenu}>
                      <FaHome className="me-1" />
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link d-flex align-items-center" to="/categories" onClick={closeMenu}>
                      <FaThLarge className="me-1" />
                      Categories
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/admin/dashboard" onClick={closeMenu}>
                      Admin Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/admin/orders" onClick={closeMenu}>
                      <FaClipboardList className="me-1" />
                      Order Management
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/admin/categories" onClick={closeMenu}>
                      <FaList className="me-1" />
                      Category Management
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === 'SELLER' && (
                <>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link d-flex align-items-center" to="/seller/profile" onClick={closeMenu}>
                      <FaUserCircle className="me-1" />
                      Profile
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/seller/business-profile" onClick={closeMenu}>
                     
                      Business Details
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/seller/dashboard" onClick={closeMenu}>
                      Seller Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/seller/products" onClick={closeMenu}>
                      Manage Products
                    </NavLink>
                  </li>
                </>
              )}

              {user.role === 'USER' && (
                <>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link d-flex align-items-center" to="/cart" onClick={closeMenu}>
                      <FaShoppingCart className="me-1" />
                      Cart
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/orders" onClick={closeMenu}>
                      Orders
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link" to="/products" onClick={closeMenu}>
                      Products
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink end className="nav-link d-flex align-items-center" to="/profile" onClick={closeMenu}>
                      <FaUserCircle className="me-1" />
                      Profile
                    </NavLink>
                  </li>
                </>
              )}

              <li className="nav-item">
                <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
