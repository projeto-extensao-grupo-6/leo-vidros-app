import React from "react";
import "./paginationContainer.css";

function PaginationContainer({ currentPage, itemsPerPage, totalItems, children }) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container">
      <span className="pagination-info">
        Mostrando {startItem}-{endItem} de {totalItems} resultados
      </span>
      <div className="pagination-buttons">
        {children}
      </div>
    </div>
  );
}

export default PaginationContainer;