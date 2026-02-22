/**
 * Variantes de animação reutilizáveis para o Framer Motion.
 *
 * `slideVariants` aplica uma transição de deslize horizontal com fade,
 * ideal para transições entre páginas ou etapas de formulário.
 *
 * Uso:
 *   <motion.div variants={slideVariants} initial="initial" animate="animate" exit="exit" />
 */
export const slideVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};