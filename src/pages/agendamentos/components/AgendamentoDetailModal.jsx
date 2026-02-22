import React from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  ExternalLink,
  Edit3,
  X,
  Package,
  FileText,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import { normalizeStatus, statusConfig, tipoConfig } from "../../../utils/agendamentoStatus";

export default function AgendamentoDetailModal({ agendamento, isOpen, onClose, onEdit, onLocation }) {
  if (!isOpen || !agendamento) return null;

  const statusNome = agendamento.statusAgendamento?.nome || "PENDENTE";
  const stCfg = statusConfig[normalizeStatus(statusNome)] || statusConfig.PENDENTE;
  const tipoCfg = tipoConfig[agendamento.tipoAgendamento] || tipoConfig.SERVICO;

  const servicoNome =
    agendamento.servico?.nome ||
    agendamento.servico?.codigo ||
    (agendamento.tipoAgendamento === "ORCAMENTO" ? "Orçamento" : "Serviço");

  const enderecoCompleto = (() => {
    if (!agendamento.endereco) return null;
    const e = agendamento.endereco;
    return [e.rua, e.numero, e.bairro, e.cidade, e.estado, e.cep].filter(Boolean).join(", ");
  })();

  const hasEndereco = !!enderecoCompleto;

  const funcionarios =
    agendamento.funcionarios?.length > 0
      ? agendamento.funcionarios.map((f) => f.nome).join(", ")
      : "Sem funcionário atribuído";

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
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: tipoCfg.dotColor }}
              >
                {agendamento.tipoAgendamento === "ORCAMENTO" ? "OR" : "SV"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{servicoNome}</h3>
                <p className="text-xs text-gray-500">
                  #{String(agendamento.id).padStart(3, "0")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                  stCfg.color
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", stCfg.dot)} />
                {stCfg.label}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                  tipoCfg.color
                )}
              >
                {tipoCfg.label}
              </span>
            </div>

            {/* Data */}
            <div className="flex items-center gap-3 text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">
                {agendamento.dataAgendamento
                  ? format(parseISO(agendamento.dataAgendamento), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                  : "—"}
              </span>
            </div>

            {/* Horário */}
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-gray-700">
                {agendamento.inicioAgendamento?.substring(0, 5)} —{" "}
                {agendamento.fimAgendamento?.substring(0, 5)}
              </span>
            </div>

            {/* Funcionários */}
            <div className="flex items-start gap-3 text-sm">
              <User className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-gray-700">{funcionarios}</span>
            </div>

            {/* Endereço */}
            {enderecoCompleto && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-700">{enderecoCompleto}</span>
                  {hasEndereco && (
                    <button
                      onClick={() => { onLocation?.(agendamento); onClose(); }}
                      className="ml-2 inline-flex items-center gap-1 text-[#007EA7] hover:underline text-xs cursor-pointer"
                    >
                      <ExternalLink className="h-3 w-3" /> Ver no mapa
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Observação */}
            {agendamento.observacao && (
              <div className="bg-gray-50 rounded-lg p-3.5 text-sm text-gray-600 border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-400 uppercase">Observação</p>
                </div>
                <p className="whitespace-pre-wrap">{agendamento.observacao}</p>
              </div>
            )}

            {/* Produtos */}
            {agendamento.produtos?.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Package className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-400 uppercase">Produtos</p>
                </div>
                <div className="space-y-1.5">
                  {agendamento.produtos.map((p, i) => (
                    <div key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                      <span>{p.produto?.nome || p.nome || `Produto #${i + 1}`}</span>
                      {p.quantidade && (
                        <span className="text-gray-400 text-xs">x{p.quantidade}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
            {hasEndereco && (
              <button
                onClick={() => { onLocation?.(agendamento); onClose(); }}
                className="px-4 py-2 text-sm font-medium text-[#007EA7] border border-[#007EA7]/30 rounded-lg hover:bg-[#007EA7]/5 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="h-4 w-4" /> Ver localização
              </button>
            )}
            <button
              onClick={() => {
                onEdit?.(agendamento);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-[#007EA7] rounded-lg hover:bg-[#006b8f] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="h-4 w-4" /> Editar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
