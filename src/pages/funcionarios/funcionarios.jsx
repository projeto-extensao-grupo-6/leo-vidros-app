import React, { useState, useEffect } from "react";
import Header from "../../shared/css/layout/Header/header";
import Sidebar from "../../shared/css/layout/Sidebar/sidebar";
import Button from "../../shared/components/ui/buttons/button.component";
import Input from "../../shared/components/ui/Input";
import { Table, TableBody, TableCell, TableContainer, TableHeader as TableHead, TableRow } from "../../shared/components/ui/Table/Table";
import { Paper } from "../../shared/components/ui/Utilities/Utilities";
import { Checkbox } from "../../shared/components/ui/Checkbox/Checkbox";
import { IconButton } from "../../shared/components/ui/IconButton/IconButton";
import { Chip } from "../../shared/components/ui/Chip/Chip";
import { Pencil, Trash2 } from "lucide-react";

import FuncionarioForm from "../../features/funcionarios/components/FuncionarioForm";
import DeleteFuncionario from "../../features/funcionarios/components/DeleteFuncionario";
import apiClient from "../../core/api/axios.config";

export default function Funcionarios() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [funcionarios, setFuncionarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const limitePorPagina = 6;

  const [openForm, setOpenForm] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [funcionarioParaDeletar, setFuncionarioParaDeletar] = useState(null);

  const fetchFuncionarios = async () => {
    try {
      const response = await apiClient.get("/funcionarios");
      // Garantindo que sempre seja um array
      const data = Array.isArray(response.data) ? response.data : [];
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      setFuncionarios([]);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []); 

  const funcionariosFiltrados = Array.isArray(funcionarios) ? funcionarios.filter((f) =>
    f.nome && f.nome.toLowerCase().includes(busca.toLowerCase())
  ) : [];

  const indexUltimo = pagina * limitePorPagina;
  const indexPrimeiro = indexUltimo - limitePorPagina;
  const funcionariosPagina = funcionariosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(funcionariosFiltrados.length / limitePorPagina);

  const abrirModalCriar = () => {
    setModoEdicao(false);
    setFuncionarioSelecionado(null);
    setOpenForm(true);
  };

  const abrirModalEditar = (funcionario) => {
    setModoEdicao(true);
    setFuncionarioSelecionado(funcionario);
    setOpenForm(true);
  };

  const abrirModalDeletar = (funcionario) => {
    setFuncionarioParaDeletar(funcionario);
    setOpenDelete(true);
  };

  const atualizarFuncionarios = async (novoFunc) => {
    try {
      if (modoEdicao && funcionarioSelecionado) {
        const funcAtualizado = { ...funcionarioSelecionado, ...novoFunc };
        await apiClient.put(`/funcionarios/${funcionarioSelecionado.id}`, funcAtualizado);
      } else {
        await apiClient.post("/funcionarios", novoFunc);
      }
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  const deletarFuncionario = async (id) => {
    try {
      await apiClient.delete(`/funcionarios/${id}`);
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="h-80px" />

        <main className="flex-1 p-25">
          <div className="mx-auto">
            <div className="mb-10 text-center pb-7">
              <h1 className="text-3xl font-bold text-gray-800">Controle de funcionário</h1>
              <p className="text-gray-500 text-lg">
                Visualize todos os funcionários de sua empresa
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <Button
                  variant="primary"
                  onClick={abrirModalCriar}
                >
                  Novo Funcionário
                </Button>
                <Input
                  type="search"
                  size="sm"
                  placeholder="Busque por nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  containerClassName="w-full sm:w-80"
                />
              </div>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Telefone</TableCell>
                      <TableCell>Função</TableCell>
                      <TableCell>Escala</TableCell>
                      <TableCell>Contrato</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {funcionariosPagina.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell>{f.nome}</TableCell>
                        <TableCell>{f.telefone}</TableCell>
                        <TableCell>{f.funcao}</TableCell>
                        <TableCell>{f.escala || "N/A"}</TableCell>
                        <TableCell>{f.contrato}</TableCell>
                        <TableCell>
                          <Chip
                            label={f.status ? "Ativo" : "Inativo"}
                            color={f.status ? "success" : "error"}
                            variant="outlined"
                            className="font-medium!"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconButton size="small" onClick={() => abrirModalEditar(f)}>
                              <Pencil size={16} />
                            </IconButton>
                            <IconButton size="small" onClick={() => abrirModalDeletar(f)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-3">
                <span>
                  Mostrando {indexPrimeiro + 1} a{" "}
                  {Math.min(indexUltimo, funcionariosFiltrados.length)} de{" "}
                  {funcionariosFiltrados.length} resultados
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                    disabled={pagina === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
                    disabled={pagina === totalPaginas}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <FuncionarioForm
        open={openForm}
        setOpen={setOpenForm}
        modoEdicao={modoEdicao}
        funcionario={funcionarioSelecionado}
        salvarFuncionario={atualizarFuncionarios}
      />

      <DeleteFuncionario
        open={openDelete}
        setOpen={setOpenDelete}
        funcionario={funcionarioParaDeletar}
        deletarFuncionario={deletarFuncionario}
      />
    </div>
  );
}