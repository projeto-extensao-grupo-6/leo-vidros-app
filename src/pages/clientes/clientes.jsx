import { useEffect, useState } from "react";
import MainBox from "../../shared/components/clienteComponents/mainBox/mainBox";
import ButtonsContainer from "../../shared/components/clienteComponents/buttonsContainer/buttonsContainer";
import BtnNovoCliente from "../../shared/components/clienteComponents/buttonsContainer/buttons/btnNovoCliente/btnNovoCliente";
import BtnExport from "../../shared/components/clienteComponents/buttonsContainer/buttons/btnExport/btnExport";
import SearchBar from "../../shared/components/clienteComponents/buttonsContainer/searchBar/searchBar";
import FilterDropdown from "../../shared/components/clienteComponents/buttonsContainer/filterDropdown/filterDropdown";
import TableContainer from "../../shared/components/clienteComponents/tableContainer/tableContainer";
import PaginationContainer from "../../shared/components/clienteComponents/paginationContainer/paginationContainer";
import BtnSwitchPages from "../../shared/components/clienteComponents/buttonsContainer/buttons/btnSwitchPages/btnSwitchPages";
import ClienteModal from "../../shared/components/clienteComponents/modal/clienteModal";
import ExportModal from "../../shared/components/clienteComponents/modal/exportModal/exportModal";
import Sidebar from "../../shared/components/sidebar/sidebar";
import Header from "../../shared/components/header/header";
import SuccessModal from "../../shared/components/clienteComponents/modal/successModal/successModal";
import "./clientes.css";

function Clientes() {
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const itemsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:3000/clientes")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data) => setHistorico(data))
      .catch((err) => setErro(err.message));
  }, []);

  const totalItems = historico.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historico.slice(indexOfFirstItem, indexOfLastItem);

  const handleNovoCliente = () => {
    setModalMode("create");
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCliente(null);
  };

  const handleSubmitCliente = (clienteData) => {
    if (modalMode === "edit") {
      const clienteParaAtualizar = {
        ...clienteData,
        historicoServicos:
          clienteData.historicoServicos ||
          selectedCliente.historicoServicos ||
          [],
      };

      fetch(`http://localhost:3000/clientes/${clienteData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteParaAtualizar),
      })
        .then((res) => res.json())
        .then((updatedCliente) => {
          setHistorico((prev) =>
            prev.map((c) => (c.id === updatedCliente.id ? updatedCliente : c))
          );
          setIsModalOpen(false);
        })
        .catch((err) => setErro("Erro ao atualizar cliente: " + err.message));
    } else {
      const novoCliente = { ...clienteData, historicoServicos: [] };
      fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCliente),
      })
        .then((res) => res.json())
        .then((newCliente) => {
          setHistorico((prev) => [...prev, newCliente]);
          setIsModalOpen(false);
          setIsSuccessModalOpen(true);
        })
        .catch((err) => setErro("Erro ao adicionar cliente: " + err.message));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/clientes/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao deletar cliente");
        setHistorico((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => setErro("Erro ao excluir cliente: " + err.message));
  };

  const handleFiltrar = (option) => console.log("Filtrar por:", option);
  const handleEdit = (id) => {
    const cliente = historico.find((c) => c.id === id);
    if (cliente) {
      setSelectedCliente(cliente);
      setModalMode("edit");
      setIsModalOpen(true);
    }
  };
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleExportar = () => setIsExportModalOpen(true);
  const handleExportSubmit = (file) => console.log("Exportar arquivo:", file);
  const handleOrdenar = (option) => {
    if (option === "Data") setIsCalendarModalOpen(true);
  };
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    window.location.href = "./agendamentos";
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 max-w-[1800px] mx-auto">
        {/* Título */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Clientes
          </h1>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg mt-2 sm:mt-3">
            Visualize todos os clientes de sua empresa
          </p>
        </div>

        <MainBox>
          {/* Botões e filtros */}
          <div className="flex flex-col gap-4 sm:gap-5 mb-8">
            <ButtonsContainer>
              <div className="flex flex-col lg:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6 items-stretch lg:items-center justify-between">
                <BtnNovoCliente onClick={handleNovoCliente} />

                <div className="flex-1 min-w-[250px]">
                  <SearchBar
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <FilterDropdown
                    label="Ordenar"
                    options={["Mais Recente", "Mais Antigo"]}
                    onSelect={handleOrdenar}
                    hasRadioOptions={true}
                  />
                  <FilterDropdown
                    label="Situação"
                    options={["Serviços Ativos", "Serviços Finalizados"]}
                    onSelect={handleFiltrar}
                    hasRadioOptions={true}
                  />
                  <BtnExport onClick={handleExportar} />
                </div>
              </div>
            </ButtonsContainer>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto w-full mb-10">
            <div className="min-w-[700px]">
              <TableContainer
                data={currentItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Paginação */}
          <div className="flex justify-center mb-8">
            <PaginationContainer
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
            >
              <div className="flex gap-3 items-center">
                <BtnSwitchPages
                  direction="prev"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                />
                <span className="text-sm px-2">
                  {currentPage} de {totalPages}
                </span>
                <BtnSwitchPages
                  direction="next"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                />
              </div>
            </PaginationContainer>
          </div>
        </MainBox>

        {erro && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-500 text-center text-sm sm:text-base">{erro}</p>
          </div>
        )}
      </div>

      <ClienteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitCliente}
        cliente={selectedCliente}
        mode={modalMode}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportSubmit}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={handleSuccessConfirm}
        message="O cliente foi adicionado ao histórico do sistema, deseja vincular ou criar um novo agendamento para ele?"
      />
    </>
  );
}

export default Clientes;