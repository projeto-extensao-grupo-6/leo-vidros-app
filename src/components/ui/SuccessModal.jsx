import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Modal de sucesso com animações profissionais
 * @param {boolean} open - Controla se o modal está aberto
 * @param {function} onClose - Função chamada ao fechar o modal
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem descritiva
 * @param {number} autoCloseDuration - Tempo em ms para fechar automaticamente (0 = não fecha)
 * @param {string} progressMessage - Mensagem customizada para a barra de progresso
 */
const SuccessModal = ({ 
  open = false, 
  onClose = () => {}, 
  title = "Sucesso!", 
  message = "Operação realizada com sucesso",
  autoCloseDuration = 0,
  progressMessage = "Redirecionando..."
}) => {
  React.useEffect(() => {
    if (open && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoCloseDuration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.3 
            }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animação do ícone de sucesso */}
            <div className="flex items-center justify-center mb-6">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1
                }}
                className="w-20 h-20 relative"
              >
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center relative">
                  {/* Anel animado ao redor */}
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 rounded-full bg-green-400"
                  />
                
                  {/* Ícone de check animado */}
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-10 h-10 text-white relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </div>
              </motion.div>
            </div>

            {/* Texto animado */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl pt-6 font-bold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-gray-600 pb-4">
                {message}
              </p>
              
              {/* Barra de progresso - só aparece se tiver autoClose */}
              {autoCloseDuration > 0 && (
                <>
                  <motion.div 
                    className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: autoCloseDuration / 1000, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    />
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-gray-500 pt-3"
                  >
                    {progressMessage}
                  </motion.p>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
