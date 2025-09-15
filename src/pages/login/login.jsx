import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputText from "../../shared/components/inputs/inputText/inputText.component";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "../../shared/components/buttons/button.component";
import "./login.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) throw new Error("Erro no login");

      const data = await response.json();
      console.log("Login OK:", data);

      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        // exemplo: window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const variants = {
    initial: { opacity: 0.3, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0.3, x: -50 },
  };

  return (
    <div className="main-container m-32">
      <div className="form-container m-4">
        <div className="header-title">
          <h1>Entre na sua conta</h1>
          <h3>Entre em sua conta para gerenciar seu negócio</h3>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form">
            <AnimatePresence mode="wait">
              <motion.div
                key="login"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
              >
                <InputText
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<AccountCircle />}
                />
                <InputText
                  id="senha"
                  label="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  icon={<LockIcon />}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {error && <p style={{ color: "red", margin: "4px" }}>{error}</p>}
          <a className="forgot-password" onClick={() => setForgotPassword(true)}>Esqueci minha senha</a>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="mt-l2"
          >
            Entrar
          </Button>
        </form>
        <div className="account-back">
          <div className="separator"></div>
          <span
            className="back-icon"
            onClick={() => window.location.href = "/Cadastro"} 
          > 
            <span>Voltar para Cadastro</span>
          </span>
        </div>
      </div>
      <div className="image"></div>

      {/* MODAL DE SUCESSO */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2">
            Login realizado com sucesso!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Bem-vindo de volta 🚀
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Login;
