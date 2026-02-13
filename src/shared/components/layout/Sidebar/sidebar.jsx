import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Package,
  Calendar,
  Users,
  Lock,
  Briefcase,
  LogOut,
  ChevronLeft,
  ClipboardList,
  PencilLine,
} from "lucide-react";
import { Avatar } from "../../ui";
import UserImg from "../../../../assets/User.png";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../../../assets/logo/logo-sidebar.png";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Carregando...");

  useEffect(() => {
    const storedName = sessionStorage.getItem("loggedUserName");

    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("Usuário Léo Vidros");
    }
  }, []);

  const menuItems = [
    {
      text: "Painel de Controle",
      icon: <Home size={20} />,
      path: "/paginaInicial",
    },
    {
      text: "Controle de Estoque",
      icon: <Package size={20} />,
      path: "/estoque",
    },
    {
      text: "Pedidos e Serviços",
      icon: <ClipboardList size={20} />,
      path: "/pedidos",
    },
    {
      text: "Agendamentos",
      icon: <Calendar size={20} />,
      path: "/agendamentos",
    },
    { text: "Clientes", icon: <Users size={20} />, path: "/clientes" },
    {
      text: "Controle de Funcionários",
      icon: <Briefcase size={20} />,
      path: "/funcionarios",
    },
    { text: "Controle de Acesso", icon: <Lock size={20} />, path: "/acesso" },
  ];

  return (
    <>
      {/* Overlay escurecido (funcional e cobrindo toda a tela) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1399 cursor-pointer"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed top-0 left-0 h-full w-[270px] bg-white text-gray-700 shadow-2xl z-1400 flex flex-col border-r border-gray-200"
      >
        {/* Logo e botão fechar */}
        <div className="relative flex flex-col items-center px-4 pt-6 pb-8">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
            <ChevronLeft size={34} />
          </button>

          <img
            src={Logo}
            alt="Logo"
            className="w-[55%] h-auto object-contain my-5 drop-shadow-sm"
          />
        </div>
        {/* Menu principal */}
        <nav className="grow overflow-y-auto w-full">
          <ul className="flex flex-col gap-2 px-6">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={i}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-[#003d6b] text-white shadow-sm"
                        : "hover:bg-[#003d6b]/10 hover:text-[#003d6b] text-gray-700"
                    }`}
                  >
                    <span
                      className={`${isActive ? "text-white" : "text-gray-600"}`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-base font-medium">{item.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Botão Sair */}
        <div className="flex flex-col px-6">
          <div
            onClick={() => navigate("/perfil")}
            className="flex justify-between flex items-center gap-3 w-full text-left px-1.5 py-3 rounded-lg transition-all duration-150 cursor-pointer hover:bg-[#003d6b]/10 hover:text-[#003d6b] text-gray-700"
          >
            <div className="flex">
              <Avatar
                src={UserImg}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border-2 border-white group-hover:border-gray-300 transition-colors"
              />
              <div className="flex flex-col justify-center">
                <p className="text-base font-bold">{userName}</p>
                <p className="text-[11px] sm:text-xs text-gray-800">Admin</p>
              </div>
            </div>
            <PencilLine size={20} />
          </div>

          <div className="mt-auto pb-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition-all duration-150 cursor-pointer hover:bg-[#003d6b]/10 hover:text-[#003d6b] text-gray-700"
            >
              <LogOut size={26} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
