  import React from "react";
  import Header from "../componentes/Header.jsx";
  import Welcome from "../componentes/Welcome.jsx";
  import Carousel from "../componentes/Carousel.jsx";
  import MainContent from "../componentes/MainContent.jsx";
  import Footer from "../componentes/Footer.jsx";

  function IndexPage() {
    return (
      <div className="pageWrapper">
        <Header />
        <main>
          <Welcome />
          <Carousel />
          <MainContent />
        </main>
        <Footer />
      </div>
    );
  }

  export default IndexPage;

