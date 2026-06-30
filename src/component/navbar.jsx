import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import "./navbar.css";

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconLogin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

const IconBars = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const IconTimes = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CustomNavbar = ({ size, onSearchChange, UserConnect }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
  const handleNavLinkClick = () => setMenuOpen(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="container">
        <div className="logo">
          <img src="/image/kalico.webp" alt="logo" />
        </div>

        <div className={`main_list ${menuOpen ? "show_list" : ""}`}>
          <ul className="navlinks">
            <li>
              <NavLink to="/" onClick={handleNavLinkClick}>Accueil</NavLink>
            </li>
            <li>
              <NavLink to="/menu" onClick={handleNavLinkClick}>Menu du jour</NavLink>
            </li>
            <li className="mobile-search">
              <IconSearch />
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
          <IconSearch />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
            value={searchValue}
            onChange={handleInputChange}
          />
        </div>

        <div className="right-side">
          <div className="panier">
            <Link to="/panier" className="panier-link">
              <img src="/image/panier.webp" alt="panier" />
            </Link>
            <span>{size}</span>
          </div>

          <div className="profile-container" ref={profileRef}>
            <a
              className={`nav-link dropdown-toggle ${profileMenuOpen ? "toggle-change" : ""}`}
              href="#"
              id="navbarDropdown"
              role="button"
              aria-expanded={profileMenuOpen ? "true" : "false"}
              onClick={toggleProfileMenu}
            >
              <img src="/image/Profile.webp" alt="profil" className="profile-img" />
            </a>

            {profileMenuOpen && (
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {UserConnect ? (
                  <>
                    <li>
                      <a className="dropdown-item" href="#">
                        <IconUser /> Account
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <IconSettings /> Settings
                      </a>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <a className="dropdown-item" href="/" onClick={handleLogout}>
                        <IconLogout /> Log Out
                      </a>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/login"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <IconLogin /> Login
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <span className={`navTrigger ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
          {menuOpen ? <IconTimes /> : <IconBars />}
        </span>
      </div>
    </nav>
  );
};

export default CustomNavbar;
