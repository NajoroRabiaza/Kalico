import React, { createContext, useState, useEffect, useContext } from "react";
import CustomNavbar from "../component/navbar.jsx";
import "./home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import SystemeCrousel from "../component/Carousel.jsx";
import Footer from "../component/footer.jsx";
import Cards from "../component/Card";
import { CartContext } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext";
import API_URL from "../api";

export const produitContext = createContext();

function Home() {
  const navigate = useNavigate();
  const { cart, handleClick } = useContext(CartContext);
  const { showToast } = useToast();
  const [produits, setProduits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.length > 0;

  const fetchProduits = () => {
    fetch(`${API_URL}/produits`)
      .then((res) => res.json())
      .then((data) => {
        const produitsAvecImageUrl = data
          .map((p) => ({
            ...p,
            img: `${API_URL}/${p.img}`,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProduits(produitsAvecImageUrl);
      })
      .catch((err) =>
        console.error("Erreur de chargement des produits :", err)
      );
  };

  useEffect(() => {
    fetchProduits();
    const intervalId = setInterval(fetchProduits, 8000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClic = (path) => {
    navigate(path);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query.trim().toLowerCase());
  };

  const produitsFiltres = produits.filter(
    (p) =>
      p.nom.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <div className="HomePage">
        <div class="multi-image">
          <img src="/image/boribory.png" alt="rond" className="im1" />
        </div>

        <CustomNavbar size={cart.length} onSearchChange={handleSearchSubmit} />

        <header>
          <section className={`animated-section ${isSearching ? "slide-up" : "slide-down"}`}>
            <div className="carousel">
              <SystemeCrousel />
            </div>
          </section>
        </header>

        <section className="mt-4">
          <section className={`animated-section ${isSearching ? "slide-up" : "slide-down"}`}>
            <div className="BarreDemenu">
              <Container>
                <Row>
                  <div className="texte">
                    <p className="text">Explorer notre menu</p>
                    <p className="texts">
                      Choisissez parmi notre menu varié, composé d'une sélection
                      de plats savoureux.
                    </p>
                  </div>

                  <div className="contenairMenu">
                    <div className="menu">
                      <Image className="imagemenu" src="/image/pates.png"
                        onMouseOver={(e) => (e.currentTarget.src = "/image/pates1.png")}
                        onMouseOut={(e) => (e.currentTarget.src = "/image/pates.png")}
                        onClick={() => handleClic("/Soupe")} roundedCircle />
                      <span className="SousTitre">Pâtes</span>
                    </div>
                    <div className="menu">
                      <Image className="imagemenu" src="/image/snack.png"
                        onMouseOver={(e) => (e.currentTarget.src = "/image/snack1.png")}
                        onMouseOut={(e) => (e.currentTarget.src = "/image/snack.png")}
                        onClick={() => handleClic("/Burger")} roundedCircle />
                      <span className="SousTitre">Snack</span>
                    </div>
                    <div className="menu">
                      <Image className="imagemenu" src="/image/riz.png"
                        onMouseOver={(e) => (e.currentTarget.src = "/image/riz1.png")}
                        onMouseOut={(e) => (e.currentTarget.src = "/image/riz.png")}
                        onClick={() => handleClic("/Riz")} roundedCircle />
                      <span className="SousTitre">Riz</span>
                    </div>
                    <div className="menu">
                      <Image className="imagemenu" src="/image/dessert.png"
                        onMouseOver={(e) => (e.currentTarget.src = "/image/dessert1.png")}
                        onMouseOut={(e) => (e.currentTarget.src = "/image/dessert.png")}
                        onClick={() => handleClic("/Dessert")} roundedCircle />
                      <span className="SousTitre">Dessert</span>
                    </div>
                    <div className="menu">
                      <Image className="imagemenu" src="/image/boisson.png"
                        onMouseOver={(e) => (e.currentTarget.src = "/image/boisson1.png")}
                        onMouseOut={(e) => (e.currentTarget.src = "/image/boisson.png")}
                        onClick={() => handleClic("/Jus")} roundedCircle />
                      <span className="SousTitre">Boisson</span>
                    </div>
                  </div>
                </Row>
                <hr />
              </Container>
            </div>
          </section>
        </section>

        <div className={`All_Cards ${isSearching ? "active-search" : ""}`}>
          {produitsFiltres.length > 0 ? (
            produitsFiltres.map((item) => (
              <Cards handleClick={(item) => handleClick(item, showToast)} item={item} key={item._id} />
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem" }}>
              Aucun produit trouvé pour l'instant « {searchQuery} ».
            </p>
          )}
        </div>

        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Home;
