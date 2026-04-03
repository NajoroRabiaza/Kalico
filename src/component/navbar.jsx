import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
/* import "@fortawesome/fontawesome-free/css/all.min.css";   */

import "./navbar.css";


const CustomNavbar = ({ size, onSearchChange, UserConnect }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = () => {
    navigate("/"); // mideconecte
  };
  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  /*   console.log("UserConnect:", UserConnect); */

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="container">
        <div className="logo">
          <img src="src/image/kalico.png" alt="logo" />
        </div>

        <div className={`main_list ${menuOpen ? "show_list" : ""}`}>
          <ul className="navlinks">
            <li>
              <NavLink to="/" onClick={handleNavLinkClick}>
                Accueil
              </NavLink>
            </li>

            <li>
              <NavLink to="/menu" onClick={handleNavLinkClick}>
                Menu du jour
              </NavLink>
            </li>
            <li className="mobile-search">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Rechercher..."
                className="search-input"
                value={searchValue}
                onChange={handleInputChange}
              />
            </li>
          </ul>
        </div>

        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
            value={searchValue}
            onChange={handleInputChange}
          />
        </div>
        <div className="right-side">
          <Nav className="panier">
            <Nav.Link as={Link} to="/panier">
              <img src="src/image/panier.png" alt="panier" />
            </Nav.Link>
            <span>{size}</span>
          </Nav>

          <div className="profile-container" ref={profileRef}>
            <a
              className={`nav-link dropdown-toggle ${profileMenuOpen ? "toggle-change" : ""
                }`}
              href="#"
              id="navbarDropdown"
              role="button"
              aria-expanded={profileMenuOpen ? "true" : "false"}
              onClick={toggleProfileMenu}
            >
              <img
                src="src/image/Profile.png"
                alt="profil"
                className="profile-img"
              />
            </a>

            {profileMenuOpen && (
  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
    {UserConnect ? (
      <>
        <li>
          <a className="dropdown-item" href="#">
            <i className="fas fa-user fa-fw"></i> Account
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            <i className="fas fa-cogs fa-fw"></i> Settings
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item" href="/" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt fa-fw"></i> Log Out
          </a>
        </li>
      </>
    ) : (
      <li>
  <Link
    className="dropdown-item"
    to="/login"
    onClick={() => {
      setProfileMenuOpen(false);
      setTimeout(() => window.location.reload(), 50); // petit délai la redirection
    }}
  >
    <i className="fas fa-sign-in-alt fa-fw"></i> Login
  </Link>
</li>

    )}
  </ul>
)}

          </div>
        </div>

        <span
          className={`navTrigger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          {" "}
          <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
        </span>
      </div>
    </nav>
  );
};

export default CustomNavbar;
