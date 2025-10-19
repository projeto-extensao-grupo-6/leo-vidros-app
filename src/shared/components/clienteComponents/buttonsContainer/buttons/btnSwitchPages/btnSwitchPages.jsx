import React from "react";
import "./btnSwitchPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function BtnSwitchPages({ direction, onClick, disabled }) {
  return (
    <button 
      className={`btn-switch-pages ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >{direction === "prev" ? "Anterior" : "Próximo"}
    </button>
  );
}

export default BtnSwitchPages;
