import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente utilitário que rola a página para o topo sempre que a rota muda.
 * Deve ser renderizado dentro do RouterProvider, sem nenhum output visual.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;