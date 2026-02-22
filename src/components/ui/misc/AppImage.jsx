import React from 'react';

/**
 * Wrapper de imagem com fallback automático para '/assets/images/no_image.png'
 * em caso de erro de carregamento.
 *
 * @param {{ src: string, alt?: string, className?: string }} props
 */
function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = "/assets/images/no_image.png"
      }}
      {...props}
    />
  );
}

export default Image;
