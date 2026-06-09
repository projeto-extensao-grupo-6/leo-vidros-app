import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format, addDays, addMonths, addWeeks, endOfWeek, parseISO, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Loader2,
  AlertTriangle,
  Calendar as CalendarIcon,
  X,
  Maximize2,
  Minimize2,
  List,
  CheckCircle2,
  Package,
  FileText,
  ArrowRight,
} from "lucide-react";
import agendamentosService from "../../../api/services/agendamentosService";
import {
  useEventDetails,
  useDeleteAgendamento,
} from "../hooks/useCalendarEvents";
import { getBadgeColor, isFinalizedStatus } from "../utils/eventHelpers";
import {
  EventHeader,
  EventInfo,
  EventTeam,
  EventObservations,
  EventFooter,
  LoadingState,
  ErrorMessage,
} from "./EventModalComponents";
import EditarAgendamentoSimples from "../../pedidos/components/EditarAgendamentoSimples";
import Button from "../../../components/ui/Button/Button.component";

import MonthView from "./views/MonthView";
import WeekView from "./views/WeekView";
import DayView from "./views/DayView";
import ListView from "./views/ListView";

// --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ---
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="shrink-0 rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Cancelar Agendamento?
                </h3>
              </div>
              <p className="text-sm leading-relaxed font-bold text-gray-900">
                Esta ação é irreversível e removerá o agendamento
                permanentemente.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Voltar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  startIcon={
                    isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null
                  }
                >
                  {isDeleting ? "Cancelando..." : "Sim, cancelar"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const useEscapeToClose = (isOpen, onClose) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
};

// --- MODAL: FINALIZAR VISTORIA (ORÇAMENTO) → GERAR ORÇAMENTO ---
// Agendamento de orçamento (vistoria) não dá baixa em estoque: ao finalizar, leva o
// usuário para a tela de orçamentos do pedido.
const GerarOrcamentoModal = ({ isOpen, onClose, onConfirm, isSaving, erroExterno }) => {
  useEscapeToClose(isOpen, onClose);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10200] flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4">
            <div className="rounded-lg bg-amber-100 p-2">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Gerar Orçamento</h3>
              <p className="text-xs text-gray-500">Finalizar vistoria</p>
            </div>
          </div>

          <div className="px-6 py-5 text-sm leading-relaxed text-gray-600">
            {erroExterno ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {erroExterno}
              </div>
            ) : (
              <>
                A vistoria será concluída e você será levado para a tela de orçamentos
                do pedido para gerar o orçamento. Nenhuma baixa de estoque é realizada
                nesta etapa.
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isSaving}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Gerando...</>
              ) : (
                <>Gerar Orçamento <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

// --- MODAL: FINALIZAR SERVIÇO → VALIDAÇÃO/BAIXA DE ESTOQUE ---
// Agendamento de serviço: confirma a quantidade utilizada de cada produto reservado
// e conclui via PUT /agendamentos/{id}/concluir (dá baixa e libera o excedente).
const ConcluirServicoModal = ({ isOpen, onClose, onConfirm, servicoId, isSaving, erroExterno }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEscapeToClose(isOpen, onClose);

  useEffect(() => {
    if (!isOpen || !servicoId) return undefined;
    let cancelado = false;
    setLoading(true);
    setErro(null);

    agendamentosService.listarProdutosServico(servicoId).then((res) => {
      if (cancelado) return;
      if (res.success) {
        const lista = (res.data || [])
          .filter((p) => p.ativo !== false)
          .map((p) => {
            const planejada = Number(p.quantidadePlanejada) || 0;
            return {
              produtoId: p.produtoId,
              nome: p.produtoNome,
              unidade: p.unidadeMedida || "",
              planejada,
              utilizada: String(planejada),
            };
          });
        setProdutos(lista);
      } else {
        setErro(res.error || "Não foi possível carregar os produtos do serviço.");
      }
      setLoading(false);
    });

    return () => {
      cancelado = true;
    };
  }, [isOpen, servicoId]);

  const handleQuantidade = (idx, value) => {
    const limpo = value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setProdutos((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, utilizada: limpo } : p)),
    );
  };

  const linhaInvalida = (p) => {
    const v = Number(p.utilizada);
    return p.utilizada === "" || Number.isNaN(v) || v < 0 || v > p.planejada;
  };

  const temInvalido = produtos.some(linhaInvalida);

  const handleConfirm = () => {
    const payload = produtos.map((p) => ({
      produtoId: p.produtoId,
      quantidadeUtilizada: Number(p.utilizada) || 0,
    }));
    onConfirm(payload);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10200] flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Finalizar Serviço</h3>
              <p className="text-xs text-gray-500">
                Confirme a quantidade utilizada de cada produto
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
            {erroExterno ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {erroExterno}
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando produtos...
              </div>
            ) : erro ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {erro}
              </div>
            ) : produtos.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                Nenhum produto reservado para este serviço. O agendamento será
                concluído sem baixa de estoque.
              </div>
            ) : (
              produtos.map((p, idx) => (
                <div
                  key={p.produtoId}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {p.nome}
                    </span>
                    <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                      Reservado: {p.planejada}
                      {p.unidade ? ` ${p.unidade}` : ""}
                    </span>
                  </div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Quantidade utilizada
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={p.utilizada}
                    onChange={(e) => handleQuantidade(idx, e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      linhaInvalida(p)
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                  {linhaInvalida(p) && (
                    <p className="mt-1 text-xs text-red-600">
                      Informe um valor entre 0 e {p.planejada}.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSaving || loading || !!erro || temInvalido}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Finalizando...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Concluir Serviço</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

// --- MODAL DE DETALHES DO EVENTO ---
const EventDetailsModal = ({
  initialEvent,
  onClose,
  onGeoLocationClick,
  onEventDeleted,
  onEdit,
}) => {
  const { details, loading, error } = useEventDetails(initialEvent);

  const onDeleteSuccess = (id) => {
    onEventDeleted?.(id);
    onClose?.();
  };

  const { deleteAgendamento, deleting } = useDeleteAgendamento(onDeleteSuccess);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConcluirServicoOpen, setIsConcluirServicoOpen] = useState(false);
  const [isGerarOrcamentoOpen, setIsGerarOrcamentoOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [erroApi, setErroApi] = useState(null);

  const isFinalizado = isFinalizedStatus(details?.statusAgendamento);
  const canFinalizar = !isFinalizado;
  const tipoAgendamento =
    details?.tipoAgendamento?.value || details?.tipoAgendamento;
  const isOrcamento = tipoAgendamento === "ORCAMENTO";

  const handleDeleteClick = () => {
    if (isFinalizado) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteAgendamento(details.id);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  // Botão "Finalizar Execução": vistoria (orçamento) abre o modal de gerar orçamento;
  // serviço abre o modal de validação/baixa de estoque.
  const handleFinalizarClick = () => {
    setErroApi(null);
    if (isOrcamento) {
      setIsGerarOrcamentoOpen(true);
    } else {
      setIsConcluirServicoOpen(true);
    }
  };

  // Vistoria concluída → não dá baixa em estoque, leva para a tela de orçamentos.
  const handleGerarOrcamento = async () => {
    if (!details) return;
    setIsFinalizing(true);
    try {
      const fim = details.fimAgendamento
        || (details.endTime?.length === 5 ? `${details.endTime}:00` : details.endTime);
      const result = await agendamentosService.update(details.id, {
        tipoAgendamento: details.tipoAgendamento,
        dataAgendamento: details.dataAgendamento,
        inicioAgendamento: details.inicioAgendamento || details.startTime,
        fimAgendamento: fim,
        statusAgendamento: { tipo: "AGENDAMENTO", nome: "CONCLUIDO" },
        observacao: details.observacao || null,
      });
      if (result.success) {
        const pedidoId = details.servico?.pedidoId;
        setIsGerarOrcamentoOpen(false);
        onEventDeleted?.(details.id);
        onClose?.();
        if (pedidoId) {
          navigate(`/pedidos/${pedidoId}/orcamento`);
        }
      } else {
        setErroApi(result.error || "Não foi possível finalizar a vistoria.");
      }
    } catch (err) {
      console.error("Erro ao finalizar vistoria:", err);
      setErroApi("Erro inesperado ao finalizar a vistoria.");
    } finally {
      setIsFinalizing(false);
    }
  };

  // Serviço concluído → dá baixa do utilizado e libera o excedente reservado.
  const handleConcluirServico = async (produtos) => {
    if (!details) return;
    setIsFinalizing(true);
    try {
      const result = await agendamentosService.concluir(details.id, produtos);
      if (result.success) {
        setIsConcluirServicoOpen(false);
        onEventDeleted?.(details.id);
        onClose?.();
      } else {
        setErroApi(result.error || "Não foi possível concluir o serviço.");
      }
    } catch (err) {
      console.error("Erro ao concluir serviço:", err);
      setErroApi("Erro inesperado ao concluir o serviço.");
    } finally {
      setIsFinalizing(false);
    }
  };

  useEffect(() => {
    if (!details) return undefined;

    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key !== "Escape") return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      if (isConcluirServicoOpen) {
        setIsConcluirServicoOpen(false);
        return;
      }
      if (isGerarOrcamentoOpen) {
        setIsGerarOrcamentoOpen(false);
        return;
      }
      if (isDeleteModalOpen) {
        setIsDeleteModalOpen(false);
        return;
      }
      onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [details, isDeleteModalOpen, isConcluirServicoOpen, isGerarOrcamentoOpen, onClose]);

  if (!details) return null;

  const badges = [];
  if (details.tipoAgendamento) {
    badges.push({
      label:
        details.tipoAgendamento?.label ||
        details.tipoAgendamento ||
        "Agendamento",
      className: getBadgeColor(details.tipoAgendamento),
    });
  }
  if (details.statusAgendamento) {
    badges.push({
      label: `✓ ${details.statusAgendamento.nome || details.statusAgendamento}`,
      className: "bg-green-50 text-green-700 border-green-200",
    });
  }

  const formattedDate = details.dataAgendamento
    ? format(
        parseISO(
          details.dataAgendamento.includes("T")
            ? details.dataAgendamento
            : `${details.dataAgendamento}T00:00:00`,
        ),
        "dd 'de' MMMM 'de' yyyy",
        { locale: ptBR },
      )
    : "—";

  const modalContent = (
    <>
      <AnimatePresence>
        {details && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10100] bg-black/50"
            onClick={onClose}
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-700"
                  aria-label="Fechar detalhes da atividade"
                >
                  <X size={16} />
                </button>
                <EventHeader
                  title={details.title}
                  badges={badges}
                  onClose={onClose}
                />

                <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 overflow-y-auto">
                  <div className="space-y-6 p-3">
                    {loading ? (
                      <LoadingState />
                    ) : (
                      <>
                        <ErrorMessage message={error} />
                        <EventInfo
                          event={details}
                          date={formattedDate}
                          startTime={details.startTime}
                          endTime={details.endTime}
                          servico={details.servico}
                          endereco={details.endereco}
                          produtos={details.produtos}
                        />
                        <EventTeam funcionarios={details.funcionarios} />
                        <EventObservations observacao={details.observacao} />
                      </>
                    )}
                  </div>
                </div>

                <EventFooter
                  onDelete={handleDeleteClick}
                  onViewMap={() => onGeoLocationClick?.(details.endereco)}
                  onEdit={() => onEdit?.(details)}
                  onFinalizar={handleFinalizarClick}
                  isDeleting={deleting}
                  isLoading={loading}
                  hasAddress={!!details.endereco}
                  canDelete={!isFinalizado}
                  canEdit={!isFinalizado}
                  canFinalizar={canFinalizar}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting}
      />

      <GerarOrcamentoModal
        isOpen={isGerarOrcamentoOpen}
        onClose={() => { setIsGerarOrcamentoOpen(false); setErroApi(null); }}
        onConfirm={handleGerarOrcamento}
        isSaving={isFinalizing}
        erroExterno={erroApi}
      />

      <ConcluirServicoModal
        isOpen={isConcluirServicoOpen}
        onClose={() => { setIsConcluirServicoOpen(false); setErroApi(null); }}
        onConfirm={handleConcluirServico}
        servicoId={details.servico?.id}
        isSaving={isFinalizing}
        erroExterno={erroApi}
      />
    </>
  );

  return createPortal(modalContent, document.body);
};

const CalendarView = ({
  selectedDate,
  onDateSelect,
  viewType: externalViewType,
  onViewChange,
  selectedEvent: externalSelectedEvent,
  onEventSelect,
  onEventCreate,
  events = [],
  onEventDeleted,
  isUpcomingEventsCollapsed = false,
  onToggleUpcomingEvents,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const [internalSelectedEvent, setInternalSelectedEvent] = useState(null);
  const selectedEvent =
    externalSelectedEvent !== undefined
      ? externalSelectedEvent
      : internalSelectedEvent;

  const setSelectedEvent = (evt) => {
    if (onEventSelect) onEventSelect(evt);
    else setInternalSelectedEvent(evt);
  };

  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const viewType = isFullscreen ? "month" : externalViewType || "month";
  const timeSlots = Array.from({ length: 17 }, (_, index) =>
    `${String(index + 7).padStart(2, "0")}:00`,
  );
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsViewDropdownOpen(false);
      }
    };

    if (isViewDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isViewDropdownOpen]);

  useEffect(() => {
    if (isFullscreen) {
      setIsViewDropdownOpen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key !== "Escape") return;

      if (isViewDropdownOpen) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        setIsViewDropdownOpen(false);
        return;
      }

      if (showEditModal) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        setShowEditModal(false);
        setEditingEvent(null);
        return;
      }

      if (isFullscreen) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, isViewDropdownOpen, showEditModal]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const handlePrev = () => {
    const newDate =
      viewType === "week"
        ? addWeeks(currentDate, -1)
        : viewType === "day"
          ? addDays(currentDate, -1)
          : addMonths(currentDate, -1);
    setCurrentDate(newDate);
    onDateSelect?.(newDate);
  };

  const handleNext = () => {
    const newDate =
      viewType === "week"
        ? addWeeks(currentDate, 1)
        : viewType === "day"
          ? addDays(currentDate, 1)
          : addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onDateSelect?.(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect?.(today);
  };

  const handleViewTypeChange = (nextView) => {
    if (isFullscreen) return;
    onViewChange?.(nextView);
  };

  const renderHeaderTitle = () => {
    if (viewType === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(weekStart, "d MMM", { locale: ptBR })} - ${format(weekEnd, "d MMM yyyy", { locale: ptBR })}`;
    }

    if (viewType === "day") {
      return format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    }

    if (viewType === "list") {
      return "Lista de Agendamentos";
    }

    return format(currentDate, "MMMM yyyy", { locale: ptBR });
  };

  const handleDayClick = (day) => {
    setCurrentDate(day);
    onDateSelect?.(day);
    onEventCreate?.({
      eventDate: format(day, "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
    });
  };

  const handleTimeSlotClick = (day, time) => {
    setCurrentDate(day);
    onDateSelect?.(day);
    onEventCreate?.({
      eventDate: format(day, "yyyy-MM-dd"),
      startTime: time,
      endTime: "",
    });
  };

  const handleEventClick = (evt) => {
    setSelectedEvent(evt);
  };

  const handleCreateClick = () => {
    onEventCreate?.({
      eventDate: format(currentDate, "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
    });
  };

  // --- NOVA FUNÇÃO DE EDIÇÃO ---
  const handleEditEvent = (eventDetails) => {
    // Fecha o modal de detalhes
    setSelectedEvent(null);

    // Abre o modal simples de edição
    setEditingEvent(eventDetails);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    // Fecha o modal de edição
    setShowEditModal(false);
    setEditingEvent(null);

    // Notifica que o evento foi deletado/atualizado para recarregar
    if (onEventDeleted) {
      onEventDeleted();
    }
  };

  const calendarContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`relative flex flex-col bg-white ${isFullscreen ? "h-full w-full overflow-hidden rounded-[28px] border border-white/10 shadow-2xl" : "h-full overflow-hidden border border-gray-200"}`}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 sm:px-6 py-2">
        <div className="flex items-center gap-3 sm:gap-6">
          {viewType === "month" && onToggleUpcomingEvents && !isFullscreen && (
            <button
              type="button"
              onClick={onToggleUpcomingEvents}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
              title={isUpcomingEventsCollapsed ? "Mostrar proximos eventos" : "Ocultar proximos eventos"}
              aria-label={isUpcomingEventsCollapsed ? "Mostrar proximos eventos" : "Ocultar proximos eventos"}
            >
              {isUpcomingEventsCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              <span className="hidden sm:inline">
                {isUpcomingEventsCollapsed ? "Mostrar proximos eventos" : "Ocultar proximos eventos"}
              </span>
            </button>
          )}
          {viewType === "month" && onToggleUpcomingEvents && !isFullscreen && (
            <div className="h-6 w-px bg-gray-300" />
          )}
          <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-1">
            <button
              onClick={handlePrev}
              className="cursor-pointer rounded-md p-1.5 text-gray-600 transition hover:bg-white hover:shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="cursor-pointer rounded-md p-1.5 text-gray-600 transition hover:bg-white hover:shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-gray-900 capitalize truncate max-w-[160px] sm:max-w-none">
              {renderHeaderTitle()}
            </h2>
            <button
              onClick={handleTodayClick}
              className="cursor-pointer rounded-full border border-blue-100 bg-[#134074ff] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-100"
            >
              Hoje
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-7 bg-white p-1">
          {!isFullscreen && (
            <Button
              variant="primary"
              onClick={handleCreateClick}
              startIcon={<Plus size={18} className="shrink-0" />}
            >
              <span className="hidden md:inline">Novo Agendamento</span>
            </Button>
          )}

          {!isFullscreen && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsViewDropdownOpen((current) => !current)}
                className="flex w-36 cursor-pointer items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:border-[#134074ff] focus:ring-1 focus:ring-[#134074ff] focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  {viewType === "list" ? (
                    <List size={18} />
                  ) : (
                    <CalendarIcon size={18} />
                  )}
                  <span>
                    {{
                      list: "Agenda",
                      day: "Dia",
                      week: "Semana",
                      month: "Mês",
                    }[viewType]}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${isViewDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isViewDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 z-50 mt-1 w-40 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                  >
                    {["month", "week", "day", "list"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          handleViewTypeChange(type);
                          setIsViewDropdownOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${viewType === type ? "bg-[#134074ff]/10 font-medium text-[#134074ff]" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {type === "list" ? (
                          <List size={16} />
                        ) : (
                          <CalendarIcon size={16} />
                        )}
                        {{
                          list: "Agenda",
                          day: "Dia",
                          week: "Semana",
                          month: "Mês",
                        }[type]}
                        {viewType === type && (
                          <div className="ml-auto flex h-1.5 w-1.5 rounded-full bg-[#134074ff]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {viewType === "month" && (
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
              title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden sm:inline">{isFullscreen ? "Sair" : "Tela cheia"}</span>
            </button>
          )}

        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-gray-50/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-0 flex flex-col"
          >
            {viewType === "month" && (
              <MonthView
                currentMonth={currentDate}
                events={events}
                onDateClick={isFullscreen ? undefined : handleDayClick}
                onEventClick={handleEventClick}
                isFullscreen={isFullscreen}
              />
            )}

            {viewType === "week" && (
              <WeekView
                currentDate={currentDate}
                timeSlots={timeSlots}
                events={events}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}

            {viewType === "day" && (
              <DayView
                currentDay={currentDate}
                timeSlots={timeSlots}
                events={events}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            )}

            {viewType === "list" && (
              <ListView events={events} onEventClick={handleEventClick} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailsModal
            initialEvent={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onGeoLocationClick={(endereco) => {
              if (!endereco) return;
              const addressParts = [
                endereco.rua,
                endereco.numero,
                endereco.complemento,
                endereco.bairro,
                endereco.cidade,
                endereco.uf,
                endereco.cep,
              ].filter(Boolean);
              navigate("/geo-localizacao", {
                state: { address: addressParts.join(", ") },
              });
            }}
            onEventDeleted={onEventDeleted}
            onEdit={handleEditEvent}
          />
        )}
      </AnimatePresence>

      {/* Modal de Edição Simples */}
      <EditarAgendamentoSimples
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingEvent(null);
        }}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedEvent(editingEvent); // Restaura o modal anterior
          setEditingEvent(null);
        }}
        agendamento={editingEvent}
        onSuccess={handleEditSuccess}
      />
    </motion.div>
  );

  return (
    <>
      {isFullscreen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[10040] bg-slate-900/12"
              onClick={() => setIsFullscreen(false)}
            />
            <div className="fixed inset-0 z-[10041] p-2 sm:p-4">
              {calendarContent}
            </div>
          </>,
          document.body,
        )}
      {!isFullscreen && calendarContent}
    </>
  );
};

export default CalendarView;
