import React, { useState, useRef } from "react";
import { Grid, InputAdornment, Input } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Product from "./Product/Product.js";
import useStyles from "./styles";
import logo1 from "../../assets/Bookshop.gif";
import scrollImg from "../../assets/scroll.gif";
import "../ProductView/style.css";
import { Link } from "react-router-dom";
import mangaBg from "../../assets/maxresdefault.jpg";
import bioBg from "../../assets/biography.jpg";
import fictionBg from "../../assets/fiction.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";

const Products = ({ products, onAddToCart, featureProducts }) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");
  const [customerReference , setcustomerReference] = useState("");
  const [reservationInfo , setreservationInfo]=useState(null);

  const handleSearchClick = async () => {
      try{
        const {data} = await axios.get(`http://localhost:5000/api/orders/${customerReference}`);
        console.log(data.length)
      if(data.length>0) {
        setreservationInfo(data[0]);
        console.log(reservationInfo)
      }
    } catch (error){
      console.error("error fetching data:",error);
    }
  };

  const handleDelete = async () => {
    try{
      const res =await axios.post(`http://localhost:5000/api/orders/delete`,{customerReference:customerReference})
      console.log(res);
      setreservationInfo(null);
    } catch (error){
      console.error("error fetching data:",error);
    }
  };


  const sectionRef = useRef(null);

  const handleInputClick = () => {
    // Scrolls to the section when the input is clicked
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className={classes.mainPage}>
      <div className={classes.toolbar} />
      <img src={scrollImg} className={classes.scrollImg} />
      <div className={classes.hero}>
        <img className={classes.heroImg} src={logo1} height="720px" />

        <div className={classes.heroCont}>
          <h1 className={classes.heroHeader}>
            Discover Your Next Favorite Book Here.
          </h1>
          <h3 className={classes.heroDesc} ref={sectionRef}>
            Explore our curated collection of new and popular books to find your
            next literary adventure.
          </h3>
          <div className={classes.searchs}>
            <Input
              className={classes.searchb}
              type="text"
              placeholder="Which book are you looking for?"
              onClick={handleInputClick}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </div>
          
          <div className={classes.searchContainer}>
  <Input
    className={classes.searchInput}
    type="text"
    placeholder="Enter Your Order Ref to view Details"
    onChange={(event) => {
      setcustomerReference(event.target.value);
    }}
    startAdornment={
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    }
  />
  <button className={classes.searchButton} onClick={handleSearchClick}>
    Search
  </button>
</div>

{reservationInfo && Object.keys(reservationInfo).length > 0 && (
  <div className={classes.reservationInfoContainer}>
    <h3>Reservation Info:</h3>
    <div className={classes.reservationInfoItem}>
      <strong>Cart ID:</strong> {reservationInfo.cart_id}
    </div>
    <div className={classes.reservationInfoItem}>
      <strong>Customer Name:</strong>{" "}
      {reservationInfo.customer.firstname}{" "}
      {reservationInfo.customer.lastname}
    </div>
    <div className={classes.reservationInfoItem}>
      <strong>Email:</strong> {reservationInfo.customer.email}
    </div>
    <div className={classes.reservationInfoItem}>
      <strong>Currency:</strong> {reservationInfo.currency.code}
    </div>
    {/* Add more details here */}
    <button onClick={handleDelete}>Delete</button>
  </div>
)}



        </div>
      </div>

      {searchTerm === "" && (
        <div className={classes.categorySection}>
          <h1 className={classes.categoryHeader}>Categories</h1>
          <h3 className={classes.categoryDesc}>
            Browse our featured categories
          </h3>
          <div className={classes.buttonSection}>
            <div>
              <Link to="manga">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${mangaBg})` }}
                ></button>
              </Link>
              <div className={classes.categoryName}>Manga</div>
            </div>
            <div>
              <Link to="biography">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${bioBg})` }}
                ></button>
              </Link>
              <div className={classes.categoryName}>Biography</div>
            </div>
            <div>
              <Link to="fiction">
                <button
                  className={classes.categoryButton}
                  style={{ backgroundImage: `url(${fictionBg})` }}
                ></button>
              </Link>
              <div className={classes.categoryName}>Fiction</div>
            </div>
          </div>
        </div>
      )}

      <div className={classes.carouselSection}>
        <Carousel
          showIndicators={false}
          autoPlay={true}
          infiniteLoop={true}
          showArrows={true}
          showStatus={false}
        >
          <div>
            <Link to="manga">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${mangaBg})` }}
              ></button>
            </Link>
            <div className={classes.categoryName}>Manga</div>
          </div>
          <div>
            <Link to="biography">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${bioBg})` }}
              ></button>
            </Link>
            <div className={classes.categoryName}>Biography</div>
          </div>
          <div>
            <Link to="fiction">
              <button
                className={classes.categoryButton}
                style={{ backgroundImage: `url(${fictionBg})` }}
              ></button>
            </Link>
            <div className={classes.categoryName}>Fiction</div>
          </div>
        </Carousel>
      </div>

      {searchTerm === "" && (
        <>
          <div>
            <h3 className={classes.contentHeader}>
              Best <span style={{ color: "#f1361d" }}>Sellers</span>
            </h3>
            <Grid
              className={classes.contentFeatured}
              container
              justify="center"
              spacing={1}
            >
              {featureProducts.map((product) => (
                <Grid
                  className={classes.contentFeatured}
                  item
                  xs={6}
                  sm={5}
                  md={3}
                  lg={2}
                  id="pro"
                >
                  <Product product={product} onAddToCart={onAddToCart} />
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      )}

      <div>
        {searchTerm === "" && (
          <>
            <h1 className={classes.booksHeader}>
              Discover <span style={{ color: "#f1361d" }}>Books</span>
            </h1>
            <h3 className={classes.booksDesc}>
              Explore our comprehensive collection of books.
            </h3>
          </>
        )}
        <div className={classes.mobileSearch}>
          <div className={classes.mobSearchs}>
            <Input
              className={classes.mobSearchb}
              type="text"
              placeholder="Search for books"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </div>
        </div>
        <Grid
          className={classes.content}
          container
          justify="center"
          spacing={2}
        >
          {products
            .filter((product) => {
              if (searchTerm === "") {
                return product;
              } else if (
                product.name
                  .toLowerCase()
                  .includes(searchTerm.toLocaleLowerCase())
              ) {
                return product;
              }
            })
            .map((product) => (
              <Grid
                className={classes.content}
                item
                xs={6}
                sm={6}
                md={4}
                lg={3}
                id="pro"
              >
                <Product product={product} onAddToCart={onAddToCart} />
              </Grid>
            ))}
        </Grid>
      </div>
    </main>
  );
};

export default Products;
