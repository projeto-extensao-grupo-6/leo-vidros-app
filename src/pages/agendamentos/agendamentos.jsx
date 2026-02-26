import { useState, useMemo, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  User,
  Check,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Trash2,
  Edit3,
  AlertTriangle,
  Eye,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import TaskCreateModal from "../../components/ui/misc/TaskCreateModal";
import WeeklyCalendar from "./components/WeeklyCalendar";
import MiniCalendarAgendamentos from "./components/MiniCalendarAgendamentos";
import AgendamentoNotification from "../../components/ui/misc/AgendamentoNotification";
import AgendamentoDetailModal from "./components/AgendamentoDetailModal";

import { cn } from "../../utils/cn";
import { useAgendamentos } from "../../hooks/queries/useAgendamentos";
import { useAgendamentoNotifications } from "../calendar-dashboard/hooks/useAgendamentoNotifications";
import agendamentosService from "../../api/services/agendamentosService";

import {
  normalizeStatus,
  statusConfig,
  getStatusConfig,
  tipoConfig,
} from "../../utils/agendamentoStatus";

function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.color,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

function TipoBadge({ tipo }) {
  const config = tipoConfig[tipo] || tipoConfig.SERVICO;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}

function StatCard({ icon: IconComp, iconColor, value, label }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconColor,
        )}
      >
        <IconComp className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function ActionsDropdown({
  agendamento,
  onStatusChange,
  onDelete,
  onEdit,
  onView,
  onLocation,
}) {
  const [open, setOpen] = useState(false);

  const hasEndereco = (() => {
    if (!agendamento?.endereco) return false;
    const e = agendamento.endereco;
    return [e.rua, e.numero, e.bairro, e.cidade].some(Boolean);
  })();

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <MoreHorizontal className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 w-48 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2">
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(agendamento);
                setOpen(false);
              }}
            >
              <Eye className="h-4 w-4 text-gray-400" /> Ver informações
            </button>
            {hasEndereco && (
              <button
                className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onLocation?.(agendamento);
                  setOpen(false);
                }}
              >
                <MapPin className="h-4 w-4 text-gray-400" /> Ver localização
              </button>
            )}
            <div className="border-t border-gray-100 my-1" />
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(agendamento);
                setOpen(false);
              }}
            >
              <Edit3 className="h-4 w-4 text-gray-400" /> Editar
            </button>
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-green-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(agendamento, "CONFIRMADO");
                setOpen(false);
              }}
            >
              <Check className="h-4 w-4" /> Confirmar
            </button>
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-blue-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(agendamento, "CONCLUIDO");
                setOpen(false);
              }}
            >
              <Check className="h-4 w-4" /> Concluir
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(agendamento);
                setOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" /> Excluir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Excluir Agendamento?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Esta ação é irreversível e removerá o agendamento permanentemente.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-70 transition-colors cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Excluindo...
                  </>
                ) : (
                  "Sim, excluir"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Agendamentos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);

  const { data: agendamentos = [], isLoading, refetch } = useAgendamentos();

  const transformedForNotifications = useMemo(
    () =>
      agendamentos.map((a) => ({
        ...a,
        date: a.dataAgendamento,
        startTime: a.inicioAgendamento?.substring(0, 5),
        endTime: a.fimAgendamento?.substring(0, 5),
      })),
    [agendamentos],
  );
  const { currentNotification, dismissNotification } =
    useAgendamentoNotifications(transformedForNotifications);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const agendamentosByDate = useMemo(() => {
    const map = new Map();
    agendamentos.forEach((apt) => {
      const key = apt.dataAgendamento;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(apt);
    });
    return map;
  }, [agendamentos]);

  const selectedDayAgendamentos = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return (agendamentosByDate.get(key) || []).sort((a, b) =>
      (a.inicioAgendamento || "").localeCompare(b.inicioAgendamento || ""),
    );
  }, [selectedDate, agendamentosByDate]);

  const agendamentoDates = useMemo(
    () => [...new Set(agendamentos.map((a) => a.dataAgendamento))],
    [agendamentos],
  );

  const stats = useMemo(() => {
    const todayKey = format(new Date(), "yyyy-MM-dd");
    return {
      today: agendamentos.filter((a) => a.dataAgendamento === todayKey).length,
      confirmed: agendamentos.filter(
        (a) => a.statusAgendamento?.nome === "CONFIRMADO",
      ).length,
      pending: agendamentos.filter(
        (a) => a.statusAgendamento?.nome === "PENDENTE",
      ).length,
    };
  }, [agendamentos]);

  const navigate = useNavigate();

  const handleLocation = useCallback(
    (apt) => {
      if (!apt?.endereco) return;
      const e = apt.endereco;
      const address = [
        e.rua,
        e.numero,
        e.bairro,
        e.cidade,
        e.uf || e.estado,
        e.cep,
      ]
        .filter(Boolean)
        .join(", ");
      navigate("/geo-localizacao", { state: { address } });
    },
    [navigate],
  );

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handlePrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handleToday = () => {
    setCurrentMonth(new Date());
    setCurrentWeek(new Date());
    setSelectedDate(new Date());
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    if (!isSameMonth(day, currentMonth)) {
      setCurrentMonth(day);
    }
  };

  const handleNewAgendamento = useCallback(
    (overrides = {}) => {
      setModalInitialData({
        eventDate: overrides.date || format(selectedDate, "yyyy-MM-dd"),
        startTime: overrides.startTime || "",
        endTime: overrides.endTime || "",
        tipoAgendamento: "",
        pedido: null,
        funcionarios: [],
      });
      setShowTaskModal(true);
    },
    [selectedDate],
  );

  const handleTaskSave = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleStatusChange = useCallback(
    async (apt, newStatusNome) => {
      try {
        const result = await agendamentosService.update(apt.id, {
          tipoAgendamento: apt.tipoAgendamento,
          dataAgendamento: apt.dataAgendamento,
          inicioAgendamento: apt.inicioAgendamento,
          fimAgendamento: apt.fimAgendamento,
          statusAgendamento: { tipo: "AGENDAMENTO", nome: newStatusNome },
          observacao: apt.observacao || null,
        });
        if (result.success) {
          refetch();
        } else {
          console.error(
            "Erro ao atualizar status:",
            result.error,
            result.status,
          );
          Swal.fire({
            icon: "error",
            title: "Erro ao atualizar status",
            text:
              result.error ||
              "Não foi possível alterar o status do agendamento.",
            timer: 4000,
            showConfirmButton: true,
          });
        }
      } catch (err) {
        console.error("Erro ao atualizar status:", err);
      }
    },
    [refetch],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await agendamentosService.delete(deleteTarget.id);
      if (result.success) {
        refetch();
        setDeleteTarget(null);
      } else {
        console.error("Erro ao excluir:", result.error);
        Swal.fire({
          icon: "error",
          title: "Erro ao excluir",
          text: result.error || "Não foi possível excluir o agendamento.",
          timer: 4000,
          showConfirmButton: true,
        });
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, refetch]);

  const handleEdit = useCallback((apt) => {
    setModalInitialData({
      eventDate: apt.dataAgendamento,
      startTime: apt.inicioAgendamento?.substring(0, 5) || "",
      endTime: apt.fimAgendamento?.substring(0, 5) || "",
      tipoAgendamento: apt.tipoAgendamento || "",
      pedido: null,
      funcionarios: apt.funcionarios?.map((f) => f.id) || [],
      agendamentoId: apt.id,
    });
    setShowTaskModal(true);
  }, []);

  const handleNotificationCancelar = useCallback(
    async (agendamento) => {
      if (
        window.confirm(
          `Cancelar agendamento #${String(agendamento.id).padStart(3, "0")}?`,
        )
      ) {
        try {
          await agendamentosService.delete(agendamento.id);
          dismissNotification();
          refetch();
        } catch (err) {
          console.error("Erro ao cancelar:", err);
        }
      }
    },
    [dismissNotification, refetch],
  );

  const handleNotificationIniciar = useCallback(
    async (agendamento) => {
      try {
        await agendamentosService.update(agendamento.id, {
          tipoAgendamento: agendamento.tipoAgendamento,
          dataAgendamento: agendamento.dataAgendamento,
          inicioAgendamento: agendamento.inicioAgendamento,
          fimAgendamento: agendamento.fimAgendamento,
          statusAgendamento: { tipo: "AGENDAMENTO", nome: "EM ANDAMENTO" },
          observacao: agendamento.observacao || "",
        });
        dismissNotification();
        refetch();
      } catch (err) {
        console.error("Erro ao iniciar:", err);
      }
    },
    [dismissNotification, refetch],
  );

  const getServicoNome = (apt) => {
    if (apt.servico?.nome) return apt.servico.nome;
    if (apt.servico?.codigo) return apt.servico.codigo;
    return apt.tipoAgendamento === "ORCAMENTO" ? "Orçamento" : "Serviço";
  };

  const getEnderecoResumo = (apt) => {
    if (!apt.endereco) return null;
    const e = apt.endereco;
    const parts = [e.rua, e.numero, e.bairro, e.cidade].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const getFuncionarioNomes = (apt) => {
    if (!apt.funcionarios?.length) return "Sem funcionário";
    return apt.funcionarios.map((f) => f.nome).join(", ");
  };

  const getStatusNome = (apt) => apt.statusAgendamento?.nome || "PENDENTE";

  if (isLoading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <div className="h-[80px]" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#007EA7]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="h-[80px]" />

        <main className="flex-1 flex flex-col items-center px-4 md:px-8 pt-6 pb-10 gap-6">
          <div className="w-full max-w-[1680px] space-y-6">
            {/* ====== Header ====== */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="hidden sm:block flex-1" />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  Agendamentos
                </h1>
                <p className="text-gray-500 mt-1">
                  Gerencie os agendamentos da Leo Vidros
                </p>
              </div>
              <div className="flex-1 flex sm:justify-end">
                <button
                  onClick={() => handleNewAgendamento()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#007EA7] text-white font-semibold rounded-xl hover:bg-[#006b8f] transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
                >
                  <Plus className="h-5 w-5" /> Novo Agendamento
                </button>
              </div>
            </div>

            {/* ====== Stats ====== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={CalendarIcon}
                iconColor="bg-[#007EA7]/10 text-[#007EA7]"
                value={stats.today}
                label="Hoje"
              />
              <StatCard
                icon={Check}
                iconColor="bg-green-500/10 text-green-600"
                value={stats.confirmed}
                label="Confirmados"
              />
              <StatCard
                icon={Clock}
                iconColor="bg-yellow-500/10 text-yellow-600"
                value={stats.pending}
                label="Pendentes"
              />
            </div>

            {/* ====== Abas de Visualização ====== */}
            <div
              className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-fit shadow-sm"
              style={{ marginTop: "15px" }}
            >
              {[
                { key: "calendar", label: "Mensal", icon: CalendarIcon },
                { key: "week", label: "Semanal", icon: LayoutGrid },
                { key: "list", label: "Lista", icon: List },
              ].map(({ key, label, icon: TabIcon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                    viewMode === key
                      ? "bg-[#007EA7] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <TabIcon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            {/* ====== Visualização Mensal ====== */}
            {viewMode === "calendar" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendário mensal */}
                <div className="lg:col-span-2 bg-gray-50 rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                  {/* Nav do mês */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                      {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToday}
                        className="px-3 py-1.5 text-sm font-medium text-[#007EA7] border border-[#007EA7]/30 rounded-lg hover:bg-[#007EA7]/5 transition-colors cursor-pointer"
                      >
                        Hoje
                      </button>
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Dias da semana */}
                  <div className="grid grid-cols-7 border-b border-gray-100">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-3"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Grid de dias */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, i) => {
                      const dayKey = format(day, "yyyy-MM-dd");
                      const dayAgendamentos =
                        agendamentosByDate.get(dayKey) || [];
                      const isSelected = isSameDay(day, selectedDate);
                      const isToday = isSameDay(day, new Date());
                      const isCurrentMonth = isSameMonth(day, currentMonth);

                      return (
                        <button
                          key={i}
                          onClick={() => handleDayClick(day)}
                          className={cn(
                            "relative p-2 min-h-[90px] text-left border-b border-r border-gray-100 transition-all cursor-pointer",
                            isSelected
                              ? "bg-[#007EA7]/5 ring-2 ring-inset ring-[#007EA7]/30"
                              : "hover:bg-gray-50",
                            !isCurrentMonth && "opacity-40",
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-semibold inline-flex items-center justify-center",
                              isToday &&
                                "bg-[#007EA7] text-white rounded-full w-7 h-7",
                              !isToday && isSelected && "text-[#007EA7]",
                              !isToday && !isSelected && "text-gray-700",
                            )}
                          >
                            {format(day, "d")}
                          </span>

                          {dayAgendamentos.length > 0 && (
                            <div className="mt-1.5 space-y-1">
                              {dayAgendamentos.slice(0, 2).map((apt) => {
                                const tipoCfg =
                                  tipoConfig[apt.tipoAgendamento] ||
                                  tipoConfig.SERVICO;
                                return (
                                  <div
                                    key={apt.id}
                                    className={cn(
                                      "text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium",
                                      tipoCfg.color,
                                    )}
                                  >
                                    {apt.inicioAgendamento?.substring(0, 5)}{" "}
                                    {getServicoNome(apt)?.split(" ")[0]}
                                  </div>
                                );
                              })}
                              {dayAgendamentos.length > 2 && (
                                <div className="text-[10px] text-gray-400 font-medium pl-1">
                                  +{dayAgendamentos.length - 2} mais
                                </div>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Painel lateral - Detalhe do dia */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-md overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 capitalize">
                      {format(selectedDate, "EEEE", { locale: ptBR })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    {selectedDayAgendamentos.length === 0 ? (
                      <div className="text-center py-12">
                        <CalendarIcon className="h-14 w-14 mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 font-medium">
                          Nenhum agendamento
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          Clique abaixo para agendar
                        </p>
                        <button
                          onClick={() =>
                            handleNewAgendamento({
                              date: format(selectedDate, "yyyy-MM-dd"),
                            })
                          }
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#007EA7] border border-[#007EA7]/30 rounded-lg hover:bg-[#007EA7]/5 transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4" /> Agendar
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDayAgendamentos.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => setDetailTarget(apt)}
                            className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all hover:border-gray-300 group cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#007EA7]/10 rounded-xl flex items-center justify-center">
                                  <User className="h-5 w-5 text-[#007EA7]" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-gray-800">
                                    {getServicoNome(apt)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {getFuncionarioNomes(apt)}
                                  </p>
                                </div>
                              </div>
                              <ActionsDropdown
                                agendamento={apt}
                                onStatusChange={handleStatusChange}
                                onDelete={(a) => setDeleteTarget(a)}
                                onEdit={handleEdit}
                                onView={(a) => setDetailTarget(a)}
                                onLocation={handleLocation}
                              />
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {apt.inicioAgendamento?.substring(0, 5)} -{" "}
                                {apt.fimAgendamento?.substring(0, 5)}
                              </span>
                              {getEnderecoResumo(apt) && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate max-w-[120px]">
                                    {getEnderecoResumo(apt)}
                                  </span>
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <StatusBadge status={getStatusNome(apt)} />
                              <TipoBadge tipo={apt.tipoAgendamento} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ====== Visualização Semanal ====== */}
            {viewMode === "week" && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Mini Calendar + Resumo */}
                <div className="lg:col-span-1 space-y-4">
                  <MiniCalendarAgendamentos
                    currentDate={currentWeek}
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      setCurrentWeek(date);
                      setSelectedDate(date);
                    }}
                    agendamentoDates={agendamentoDates}
                  />

                  {/* Resumo do dia */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {selectedDayAgendamentos.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">agendamentos</p>
                  </div>

                  {/* Legenda */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Legenda
                    </p>
                    <div className="space-y-2">
                      {Object.entries(tipoConfig).map(([key, cfg]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cfg.dotColor }}
                          />
                          <span className="text-xs text-gray-600">
                            {cfg.label}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 mt-1.5"
                          >
                            <span
                              className={cn("w-3 h-3 rounded-full", cfg.dot)}
                            />
                            <span className="text-xs text-gray-600">
                              {cfg.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendário Semanal */}
                <div className="lg:col-span-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">
                      Semana de{" "}
                      {format(
                        startOfWeek(currentWeek, { weekStartsOn: 0 }),
                        "dd/MM",
                      )}{" "}
                      a{" "}
                      {format(
                        endOfWeek(currentWeek, { weekStartsOn: 0 }),
                        "dd/MM/yyyy",
                      )}
                    </h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleToday}
                        className="px-3 py-1.5 text-sm font-medium text-[#007EA7] border border-[#007EA7]/30 rounded-lg hover:bg-[#007EA7]/5 transition-colors cursor-pointer"
                      >
                        Hoje
                      </button>
                      <button
                        onClick={handlePrevWeek}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNextWeek}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="h-[600px]">
                    <WeeklyCalendar
                      agendamentos={agendamentos}
                      currentDate={currentWeek}
                      onAgendamentoClick={(apt) => {
                        setSelectedDate(parseISO(apt.dataAgendamento));
                        setDetailTarget(apt);
                      }}
                      onSlotClick={(date, time) => {
                        handleNewAgendamento({
                          date: format(date, "yyyy-MM-dd"),
                          startTime: time,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ====== Visualização em Lista ====== */}
            {viewMode === "list" && (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-md">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">
                    Todos os Agendamentos
                  </h2>
                  <p className="text-sm text-gray-500">
                    {agendamentos.length} registros
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {agendamentos.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-3 text-gray-200" />
                      <p className="font-medium text-lg">
                        Nenhum agendamento encontrado
                      </p>
                      <p className="text-sm mt-1">
                        Crie o primeiro agendamento clicando no botão acima
                      </p>
                    </div>
                  ) : (
                    [...agendamentos]
                      .sort((a, b) =>
                        `${a.dataAgendamento}${a.inicioAgendamento}`.localeCompare(
                          `${b.dataAgendamento}${b.inicioAgendamento}`,
                        ),
                      )
                      .map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => setDetailTarget(apt)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-3 cursor-pointer"
                        >
                          {/* Info principal */}
                          <div className="flex items-center gap-4">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                              style={{
                                backgroundColor:
                                  tipoConfig[apt.tipoAgendamento]?.dotColor ||
                                  "#007EA7",
                              }}
                            >
                              {apt.tipoAgendamento === "ORCAMENTO"
                                ? "OR"
                                : "SV"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {getServicoNome(apt)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {getFuncionarioNomes(apt)}
                              </p>
                            </div>
                          </div>

                          {/* Data/hora */}
                          <div className="text-sm sm:text-right">
                            <p className="font-semibold text-gray-700">
                              {apt.dataAgendamento
                                ? format(
                                    parseISO(apt.dataAgendamento),
                                    "dd/MM/yyyy",
                                  )
                                : "—"}
                            </p>
                            <p className="text-gray-500">
                              {apt.inicioAgendamento?.substring(0, 5)} -{" "}
                              {apt.fimAgendamento?.substring(0, 5)}
                            </p>
                          </div>

                          {/* Endereço */}
                          <div className="hidden md:block text-sm text-gray-500 max-w-[200px] truncate">
                            {getEnderecoResumo(apt) ? (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                {getEnderecoResumo(apt)}
                              </span>
                            ) : (
                              <span className="text-gray-300">
                                Sem endereço
                              </span>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2">
                            <StatusBadge status={getStatusNome(apt)} />
                            <TipoBadge tipo={apt.tipoAgendamento} />
                          </div>

                          {/* Ações */}
                          <ActionsDropdown
                            agendamento={apt}
                            onStatusChange={handleStatusChange}
                            onDelete={(a) => setDeleteTarget(a)}
                            onEdit={handleEdit}
                            onView={(a) => setDetailTarget(a)}
                            onLocation={handleLocation}
                          />
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ====== Modais ====== */}
      <TaskCreateModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          refetch();
        }}
        onSave={handleTaskSave}
        initialData={modalInitialData}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <AgendamentoDetailModal
        agendamento={detailTarget}
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        onEdit={handleEdit}
        onLocation={handleLocation}
      />

      {/* Notificação de agendamento próximo */}
      {currentNotification && (
        <AgendamentoNotification
          agendamento={currentNotification}
          onReagendar={() => dismissNotification()}
          onCancelar={handleNotificationCancelar}
          onIniciar={handleNotificationIniciar}
          onClose={dismissNotification}
        />
      )}
    </div>
  );
}
