import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IconButton,
  Divider,
  Box,
  Typography,
  Avatar
} from "../../ui";
import {
  Menu as MenuIcon,
  ChevronDown as ExpandMore,
  UserCircle,
  LogOut
} from "lucide-react";
import Logo from "../../../../assets/logo/logo.png";
import UserImg from "../../../../assets/User.png";

// Componentes simples para substituir MUI
const AppBar = ({ children, ...props }) => <header className="fixed top-0 left-0 right-0 z-header" {...props}>{children}</header>;
const Toolbar = ({ children, ...props }) => <div className="flex items-center justify-between" {...props}>{children}</div>;
const Menu = ({ anchorEl, open, onClose, children, ...props }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div className="absolute right-4 top-16 bg-[#003d6b] text-white rounded-2xl shadow-2xl border border-white/10 min-w-[260px] mt-3 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200" onClick={e => e.stopPropagation()} {...props}>
        {children}
      </div>
    </div>
  );
};
const MenuDropdownItem = ({ children, onClick, className, ...props }) => (
  <button className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-white text-sm ${className || ""}`} onClick={onClick} {...props}>
    {children}
  </button>
);
const ListItemIcon = ({ children }) => <span className="flex items-center justify-center w-5">{children}</span>;
const ListItemText = ({ children }) => <span className="flex-1">{children}</span>;

export default function Header({ toggleSidebar, sidebarOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // Adicione esta linha

  const [userName, setUserName] = useState("Carregando...");
  const [userEmail, setUserEmail] = useState("carregando@leovidros.com");
  
  useEffect(() => {
    const storedName = sessionStorage.getItem('loggedUserName');
    const storedEmail = sessionStorage.getItem('loggedUserEmail');

    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("Usuário Léo Vidros"); 
    }

    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []); 

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  return (
    <AppBar className="shadow-lg z-[1100] bg-[#002A4B]">
      <Toolbar
        className="
          flex justify-between items-center
          min-h-65px sm:min-h-75px md:min-h-80px
          p-3 sm:px-6 md:px-10 
          transition-all duration-300
        "
      >
        {/* Menu + Logo */}
        <div className="flex items-center gap-3">
          <IconButton
            color="inherit"
            onClick={toggleSidebar}
            className={`transition-transform duration-300 mr-2 text-white ${sidebarOpen ? "rotate-90" : "rotate-0"
              }`}
          >
            <MenuIcon size={24} />
          </IconButton>
          <img
            src={Logo}
            alt="Logo Léo Vidros"
            className="h-8 sm:h-10 md:h-12 transition-all duration-300"
          />
        </div>

        {/* Usuário */}
        <div
          className="flex items-center gap-1 sm:gap-2 cursor-pointer group"
          onClick={handleProfileClick}
        >
          <div className="hidden sm:block text-right mr-1">
            <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-gray-200 transition-colors">{userName}</p>
            <p className="text-[11px] sm:text-xs text-gray-300">Admin</p>
          </div>
          <Avatar
            src={UserImg}
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 border-2 border-white group-hover:border-gray-300 transition-colors"
          />
          <ExpandMore
            size={20}
            className={`text-white transition-transform duration-300 group-hover:text-gray-300 ${open ? "rotate-180" : "rotate-0"
              } hidden sm:block`}
          />
        </div>

        {/* Menu suspenso */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleProfileClose}
        >
          {/* Seção de Perfil Destacada */}
          <Box className="flex items-center px-4 py-5 gap-3 bg-[#003d6b] text-white">
             <Avatar
               src={UserImg}
               className="w-12 h-12 border-2 border-white"
             />
             <div>
                 <Typography variant="subtitle1" className="font-semibold text-gray-100 leading-tight">
                   {userName}
                 </Typography>
                 <Typography variant="body2" className="text-gray-300 leading-tight">
                   {userEmail}
                 </Typography>
             </div>
          </Box>

          <Divider className="border-white/10 mx-2" />

          {/* Itens de Menu */}
          <div className="bg-[#003d6b] z-1">
            <MenuDropdownItem
              onClick={() => {
                handleProfileClose();
                navigate("/perfil");
              }}
              className="w-full py-2.5 px-4 mx-2 transition-colors hover:bg-white/10 flex items-center gap-3 text-white text-sm"
            >
              <UserCircle size={20} className="text-white/80 flex-shrink-0" />
              <span className="text-sm font-medium">Meu Perfil</span>
            </MenuDropdownItem>

            <Divider className="border-white/10 my-2 mx-2" />

              <MenuDropdownItem 
                onClick={() => {
                  handleProfileClose();
                  navigate("/");
                }} 
                className="w-full py-2.5 px-4 mx-2 rounded-lg transition-colors hover:bg-white/10 flex items-center gap-3 text-white text-sm"
              >
                <LogOut size={20} className="text-white/80 flex-shrink-0" />
                <span className="text-sm font-medium">Sair</span>
              </MenuDropdownItem>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}