import React, { useState, useEffect } from "react";
import { Wrench, X, Edit, Save, Calendar, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Api from "../../../axios/Api";
import PedidosService from "../../../services/pedidosService";
import AgendamentoModal from "./AgendamentoModal";

// Definição das etapas do serviço conforme banco de dados
const ETAPAS_SERVICO = [
    { valor: "PENDENTE", label: "Pendente", progresso: 1 },
    { valor: "AGUARDANDO ORÇAMENTO", label: "Aguardando Orçamento", progresso: 2 },
    { valor: "ANÁLISE DO ORÇAMENTO", label: "Análise do Orçamento", progresso: 3 },
    { valor: "ORÇAMENTO APROVADO", label: "Orçamento Aprovado", progresso: 4 },
    { valor: "SERVIÇO AGENDADO", label: "Serviço Agendado", progresso: 5 },
    { valor: "SERVIÇO EM EXECUÇÃO", label: "Serviço em Execução", progresso: 6 },
    { valor: "CONCLUÍDO", label: "Concluído", progresso: 7 },
];

const EditarServicoModal = ({ isOpen, onClose, servico, onSuccess }) => {
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState({
        clienteNome: "",
        data: "",
        descricao: "",
        status: "",
        etapa: "",
        progressoValor: 1,
        progressoTotal: 7,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mostrarAgendamento, setMostrarAgendamento] = useState(false);
    const [tipoAgendamento, setTipoAgendamento] = useState(""); // "orcamento" ou "servico"
    const [etapaAnterior, setEtapaAnterior] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && servico) {
            // Usar etapaOriginal se disponível, senão normalizar a etapa
            const etapaNormalizada = servico.etapaOriginal || servico.etapa?.toUpperCase().replace(/\s+/g, "_") || "PENDENTE";
            
            setFormData({
                clienteNome: servico.clienteNome || "",
                data: servico.data || "",
                descricao: servico.descricao || "",
                status: servico.status || "Ativo",
                etapa: etapaNormalizada,
                progressoValor: servico.progresso?.[0] || 1,
                progressoTotal: 7,
            });
            setEtapaAnterior(etapaNormalizada);
            setModoEdicao(false);
            setError(null);
        }
    }, [isOpen, servico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Se mudou a etapa, atualizar o progresso automaticamente
        if (name === "etapa") {
            const etapaInfo = ETAPAS_SERVICO.find(e => e.valor === value);
            
            // Detectar se mudou de PENDENTE para AGUARDANDO_ORCAMENTO
            if (etapaAnterior === "PENDENTE" && value === "AGUARDANDO_ORÇAMENTO") {
                setMostrarAgendamento(true);
            }
            
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                progressoValor: etapaInfo ? etapaInfo.progresso : prev.progressoValor,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            // Montar dados no formato correto para a API
            const pedidoData = {
                pedido: {
                    valorTotal: servico.valorTotal || 0.00,
                    ativo: formData.status === "Ativo",
                    formaPagamento: servico.formaPagamento || "A negociar",
                    observacao: formData.descricao || "",
                    cliente: {
                        id: servico.clienteId || servico.clienteInfo?.id,
                        nome: servico.clienteNome || servico.clienteInfo?.nome || "",
                        cpf: servico.clienteInfo?.cpf || "",
                        email: servico.clienteInfo?.email || "",
                        telefone: servico.clienteInfo?.telefone || "",
                        status: "Ativo",
                        enderecos: servico.clienteInfo?.endereco ? [{
                            id: servico.clienteInfo.endereco.id || 0,
                            rua: servico.clienteInfo.endereco.rua || "",
                            complemento: servico.clienteInfo.endereco.complemento || "",
                            cep: servico.clienteInfo.endereco.cep || "",
                            cidade: servico.clienteInfo.endereco.cidade || "",
                            bairro: servico.clienteInfo.endereco.bairro || "",
                            uf: servico.clienteInfo.endereco.uf || "",
                            pais: servico.clienteInfo.endereco.pais || "Brasil",
                            numero: servico.clienteInfo.endereco.numero || 0
                        }] : []
                    },
                    status: {
                        tipo: "PEDIDO",
                        nome: formData.status.toUpperCase()
                    }
                },
                servico: {
                    nome: servico.servicoNome || servico.servico?.nome || "Serviço",
                    descricao: formData.descricao || "",
                    precoBase: servico.servico?.precoBase || 0.00,
                    ativo: true,
                    etapa: {
                        tipo: "PEDIDO",
                        nome: formData.etapa
                    }
                }
            };

            console.log("Dados sendo enviados para API:", JSON.stringify(pedidoData, null, 2));

            // Chamar API diretamente para atualizar
            const response = await Api.put(`/pedidos/${servico.id}`, pedidoData);
            
            if (response.status === 200 || response.status === 204) {
                if (onSuccess) {
                    onSuccess({
                        ...servico,
                        descricao: formData.descricao,
                        status: formData.status,
                        etapa: formData.etapa,
                        etapaOriginal: formData.etapa,
                        progresso: [parseInt(formData.progressoValor), 7],
                    });
                }
                setEtapaAnterior(formData.etapa);
                onClose();
            } else {
                setError("Erro ao atualizar serviço");
            }
        } catch (err) {
            console.error("Erro ao atualizar serviço:", err);
            const errorMessage = err.response?.data?.message || err.message || "Erro ao atualizar serviço";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAgendarOrcamento = () => {
        // Redirecionar para página de agendamentos com contexto de orçamento
        navigate('/agendamentos', { 
            state: { 
                tipo: 'orcamento',
                servicoId: servico.id,
                clienteNome: servico.clienteNome,
                servicoNome: servico.servicoNome
            }
        });
        onClose(); // Fechar o modal atual
    };

    const handleAgendarServico = () => {
        // Redirecionar para página de agendamentos com contexto de serviço
        navigate('/agendamentos', { 
            state: { 
                tipo: 'servico',
                servicoId: servico.id,
                clienteNome: servico.clienteNome,
                servicoNome: servico.servicoNome
            }
        });
        onClose(); // Fechar o modal atual
    };

    // Função para determinar se deve mostrar o botão de agendar orçamento
    const mostrarBotaoAgendarOrcamento = () => {
        const etapaAtual = formData.etapa?.toUpperCase();
        console.log("Debug - Etapa atual:", etapaAtual, "| Modo edição:", modoEdicao);
        console.log("Debug - Servico completo:", servico);
        console.log("Debug - Mostrar botão orçamento:", etapaAtual === "PENDENTE" && !modoEdicao);
        return etapaAtual === "PENDENTE" && !modoEdicao;
    };

    // Função para determinar se deve mostrar o botão de agendar serviço
    const mostrarBotaoAgendarServico = () => {
        const etapaAtual = formData.etapa?.toUpperCase();
        console.log("Debug - Mostrar botão serviço:", etapaAtual === "ORÇAMENTO APROVADO" && !modoEdicao);
        return etapaAtual === "ORÇAMENTO APROVADO" && !modoEdicao;
    };

    if (!isOpen || !servico) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-start px-10 py-20 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[130vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#eeeeee] p-2.5 rounded-lg">
                            <Wrench className="w-6 h-6 text-[#828282]" />
                        </div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Pedido #{servico.id?.toString().padStart(3, "0")}
                            </h2>
                            <p className="text-md text-gray-500">
                                ({modoEdicao ? "Editando informações" : "Visualizando informações"})
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Informações Pedido */}
                <div className="px-6 py-4 space-y-4 flex flex-col gap-6">
                    {/* Cliente */}
                    <div className="flex flex-row gap-10 items-start">
                        <div className="flex flex-col gap-1 items-start rounded-md">
                            <label className="block text-md font-semibold text-gray-700 mb-2">
                                Cliente
                            </label>
                            <input
                                type="text"
                                className="w-lg px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                                value={formData.clienteNome}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-1 items-start rounded-md">
                            <label className="block text-md font-semibold text-gray-700 mb-2">
                                Data do Pedido
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                                value={formData.data}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Nome do Serviço */}
                    <div className="flex flex-col gap-1 items-start rounded-md">
                        <label className="block text-md font-semibold text-gray-700 mb-2">
                            Nome do Serviço
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                            value={servico?.servicoNome || servico?.servico?.nome || servico?.produtosDesc || 'Serviço não especificado'}
                            readOnly
                        />
                    </div>

                    {/* Descrição */}
                    <div className="flex flex-col gap-1 items-start rounded-md">
                        <label className="block text-md font-semibold text-gray-700 mb-2">
                            Descrição do Serviço
                        </label>
                        <textarea
                            name="descricao"
                            rows={4}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg resize-none ${
                                modoEdicao ? "bg-white" : "bg-gray-100"
                            }`}
                            value={formData.descricao}
                            onChange={handleChange}
                            readOnly={!modoEdicao}
                        />
                    </div>

                    {/* Status e Etapa */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 items-start">
                            <label className="block text-md font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                name="status"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                                    modoEdicao ? "bg-white" : "bg-gray-100"
                                }`}
                                value={formData.status}
                                onChange={handleChange}
                                disabled={!modoEdicao}
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1 items-start">
                            <label className="block text-md font-semibold text-gray-700 mb-2">
                                Etapa Atual
                            </label>
                            <select
                                name="etapa"
                                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                                    modoEdicao ? "bg-white" : "bg-gray-100"
                                }`}
                                value={formData.etapa}
                                onChange={handleChange}
                                disabled={!modoEdicao}
                            >
                                {ETAPAS_SERVICO.map((etapa) => (
                                    <option key={etapa.valor} value={etapa.valor}>
                                        {etapa.label}
                                    </option>
                                ))}
                            </select>
                            {modoEdicao && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Progresso: {formData.progressoValor}/7 etapas
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Progresso */}
                    <div className="flex flex-col gap-2 items-start w-full">
                        <label className="block text-md font-semibold text-gray-700 mb-2">
                            Progresso
                        </label>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">
                                    Etapa {formData.progressoValor} de 7
                                </span>
                                <span className="text-sm font-semibold text-[#007EA7]">
                                    {Math.round((formData.progressoValor / 7) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#007EA7] transition-all duration-300"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            (formData.progressoValor / 7) * 100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            Fechar
                        </button>

                        {/* Botão Agendar Orçamento - apenas quando etapa é PENDENTE */}
                        {mostrarBotaoAgendarOrcamento() && (
                            <button
                                type="button"
                                onClick={handleAgendarOrcamento}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                            >
                                <ClipboardList className="w-4 h-4" />
                                Agendar Orçamento
                            </button>
                        )}

                        {/* Botão Agendar Serviço - apenas quando etapa é ORÇAMENTO APROVADO */}
                        {mostrarBotaoAgendarServico() && (
                            <button
                                type="button"
                                onClick={handleAgendarServico}
                                className="px-5 py-2.5 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
                            >
                                <Calendar className="w-4 h-4" />
                                Agendar Serviço
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {modoEdicao ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModoEdicao(false);
                                        setFormData({
                                            clienteNome: servico.clienteNome || "",
                                            data: servico.data || "",
                                            descricao: servico.descricao || "",
                                            status: servico.status || "Ativo",
                                            etapa: etapaAnterior,
                                            progressoValor: servico.progresso?.[0] || 1,
                                            progressoTotal: 7,
                                        });
                                    }}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-[#007EA7] text-white rounded-lg  cursor-pointer hover:bg-[#006891] transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Salvar Alterações
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setModoEdicao(true)}
                                className="px-6 py-2.5 bg-[#007EA7] text-white rounded-lg cursor-pointer hover:bg-[#006891] transition-colors flex items-center gap-2 font-semibold"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarServicoModal;
