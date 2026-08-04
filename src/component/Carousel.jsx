import React from "react";
import frite from "../image/frite.webp";
import image2 from "../image/image2.webp";
import SoupeSpecial from "../image/SoupeSpecial.webp";
import Carousel from "react-bootstrap/Carousel";
import Bolonaise from "../image/Bolonaise.webp";
import C1 from "../image/C1.webp";
import C2 from "../image/C2.webp";
import C3 from "../image/C3.webp";
import plats from "../image/plats.webp";
import street from "../image/street.webp";
import viande from "../image/viande.webp";

function SystemeCrousel() {
  return (
    <div className="carouselContainer">
      <Carousel className="Carousel">
        <Carousel.Item className="Les_Carousel">
          <img className="Carousel_background" src={C1} alt="snack" />
          <Carousel.Caption className="caroussel_text_1">
            <img src={street} alt="snack" className="img_car1" />
            <h3 className="titre">Street Food</h3>
            <p className="titre_bas">Princi Burger , Christo Tacos</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item className="Les_Carousel">
          <img className="Carousel_background" src={C2} alt="image2" />
          <Carousel.Caption className="caroussel_text_1">
            <img src={viande} alt="viandes" className="img_car1" />
            <h3 className="titre">Specialites Viandes</h3>
            <p className="titre_bas">Brochette Lito , Kebab Bunny</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item className="Les_Carousel">
          <img className="Carousel_background" src={C3} alt="soupe" />
          <Carousel.Caption className="caroussel_text_1">
            <img src={plats} alt="plats" className="img_car1" />
            <h3 className="titre">Plats Gourmands</h3>
            <p className="titre_bas">Bolog-Naj , Chicken Vic</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
export default SystemeCrousel;