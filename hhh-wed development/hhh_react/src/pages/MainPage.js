import React, { useState, useEffect } from "react";
import axios from "axios";
import Cloud from "../components/Cloud";
import { Link } from "react-router-dom";
import "./MainPagecss.css";
function MainPage() {
  const [tours, setTours] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/tours").then((res) => {
      const tour = res.data;
      const tourData = tour.map((item) => {
        return (
          <div className="column" key={item.tour_id}>
            <div className="card">
              <h3>
                {item.tour_name}, {item.location}
              </h3>
              <h4>{item.time.slice(0, 10)}</h4>
              {/* {console.log(item.merch_limit)} */}
              {item.tours_limit === 0 ? <p>sold out</p> : null}
              {(item.tours_limit > 0) & (item.tours_limit <= 20) ? (
                <p>Selling out fast</p>
              ) : null}
              {item.tours_limit > 20 ? <p>Available</p> : null}
            </div>
          </div>
        );
      });
      setTours(tourData);
    });
  }, []);

  return (
    <div className="mainPageContainer">
      <div className="mainPageContainer-first">
        <div className="app-text">
          <Cloud />
          <h1>
            Hey!! Welcome to HHH's official website, A one stop destination for
            everything. Find out if he's coming to your hometown anytime soon!!
          </h1>
          <p>SCROLL DOWN</p>
        </div>
        <div className="scroll-downs">
          <div className="mousey">
            <div className="scroller"></div>
          </div>
        </div>
      </div>

      <div className="Albums">
        <h1>
          <a id="albums">Latest Release</a>
        </h1>
        <div className="gallery">
          <figure className="gallery__item gallery__item--1">
            <img
              src="https://images.genius.com/109e5e1425790e8f1b776fea8a074a4d.1000x1000x1.jpg"
              className="gallery__img"
              alt="1"
            />
          </figure>
          <figure className="gallery__item gallery__item--2">
            <img
              src="https://images.genius.com/1e570bd88b1224a42c23f6e2847972e3.1000x1000x1.png"
              className="gallery__img"
              alt="2"
            />
          </figure>
          <figure className="gallery__item gallery__item--3">
            <img
              src="https://images.genius.com/cad09dd397954c2fd0534e5ea0c5a2e4.1000x1000x1.png"
              className="gallery__img"
              alt="3"
            />
          </figure>
          <figure className="gallery__item gallery__item--4">
            <img
              src="https://images.genius.com/7cbd390528fb885a072f16226a7c0982.1000x1000x1.png"
              className="gallery__img"
              alt="4"
            />
          </figure>
          <figure className="gallery__item gallery__item--5">
            <img
              src="https://images.genius.com/4e05a854d0bfdced65042c1efa8c504e.999x999x1.jpg"
              className="gallery__img"
              alt="5"
            />
          </figure>
          <figure className="gallery__item gallery__item--6">
            <img
              src="https://images.genius.com/2c1f31ee6278b9ccf7be5b6a3ab190ab.1000x1000x1.jpg"
              className="gallery__img"
              alt=" 6"
            />
          </figure>
        </div>
        <Link to="/webPlayer" style={{ textDecoration: "none" }}>
          <button className="Albumbutton mainPageButton">LISTEN NOW</button>
        </Link>
      </div>
      <div className="MainTours">
        <h1>TICKETS</h1>

        <div className="row">{tours.slice(0, 4)}</div>
        <div className="row">{tours.slice(4, 8)}</div>
        <div className="row">{tours.slice(8, 12)}</div>
        <div className="row">{tours.slice(12, 16)}</div>
        <Link to="/passes" style={{ textDecoration: "none" }}>
          <button className="Ticketsbutton mainPageButton">BUY NOW</button>
        </Link>
      </div>
      <div className="Merch">
        <h1>MERCH</h1>
        <p>Why not we have you redirected there directly?</p>
        <Link to="/merch" style={{ textDecoration: "none" }}>
          <button className="Merchbutton mainPageButton">MERCH</button>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
