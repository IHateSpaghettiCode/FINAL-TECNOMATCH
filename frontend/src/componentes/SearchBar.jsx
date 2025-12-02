import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SearchBar.module.css";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      // Redirige a /careers con query string
      navigate(`/careers?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchBar}
        placeholder="Buscar carrera..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className={styles.searchBtn} onClick={handleSearch}>
        <FaSearch className={styles.searchIcon} />
      </button>
    </div>
  );
}
