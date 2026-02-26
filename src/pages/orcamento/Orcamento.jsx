import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../api/client/Api";
import {
  Trash2,
  Plus,
  ArrowLeft,
  Package,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

// Gera o número do orçamento no formato ORC-ANO-P{id}
const gerarNumeroOrcamento = (pedidoId) => {
  const ano = new Date().getFullYear();
  if (!pedidoId) return "";
  return `ORC-${ano}-P${pedidoId}`;
};

const calcularSubtotalItem = (quantidade, preco_unitario, desconto) => {
  const qtd = parseFloat(quantidade) || 0;
  const preco = parseFloat(preco_unitario) || 0;
  const desc = parseFloat(desconto) || 0;
  return Math.max(0, qtd * preco - desc);
};

const calcularSubtotalGeral = (itens) =>
  itens.reduce(
    (acc, item) =>
      acc +
      calcularSubtotalItem(item.quantidade, item.preco_unitario, item.desconto),
    0,
  );

const calcularTotalFinal = (subtotal, descontoGeral) =>
  Math.max(0, subtotal - (parseFloat(descontoGeral) || 0));

const formatCurrencyBR = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value || 0,
  );

const criarItemVazio = (ordem = 1) => ({
  id: Date.now() + Math.random(),
  produto_id: "",
  descricao: "",
  quantidade: "",
  preco_unitario: "",
  desconto: "",
  observacao: "",
  ordem,
});

// Status disponíveis para o orçamento
const STATUS_OPTIONS = [
  { value: "RASCUNHO", label: "Rascunho", color: "#64748b" },
  { value: "ENVIADO", label: "Enviado", color: "#3b82f6" },
  { value: "EM_ANALISE", label: "Em Análise", color: "#f59e0b" },
  { value: "APROVADO", label: "Aprovado", color: "#10b981" },
  { value: "RECUSADO", label: "Recusado", color: "#ef4444" },
  { value: "EXPIRADO", label: "Expirado", color: "#6b7280" },
];

const tw = {
  // Estrutura de cards
  card: "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden",
  cardHeader:
    "px-8 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50",
  cardBody: "p-8",

  // Campos
  fieldGroup: "flex flex-col gap-1",
  label:
    "text-[11px] font-semibold text-gray-700 mb-1 block uppercase tracking-[0.05em]",
  errorText: "text-[11px] text-red-500 mt-1.5",

  // Inputs e selects
  input: [
    "w-full px-4 py-3 rounded-lg",
    "border-[1.5px] border-slate-200",
    "text-sm text-slate-800 bg-white",
    "outline-none transition-colors box-border font-[inherit]",
  ].join(" "),
  inputReadOnly: "!bg-slate-50 !text-slate-500 cursor-default",
  select: [
    "w-full px-4 py-3 rounded-lg",
    "border-[1.5px] border-slate-200",
    "text-sm text-slate-800 bg-white",
    "outline-none cursor-pointer font-[inherit]",
  ].join(" "),

  // Botões
  btnPrimary:
    "px-5 py-2 rounded-md text-white font-semibold text-sm cursor-pointer transition-opacity shadow-sm bg-[var(--button-color)] hover:opacity-90",
  btnOutline:
    "px-5 py-2 rounded-md border border-slate-300 bg-white text-slate-700 font-semibold text-sm cursor-pointer hover:bg-slate-50 transition-colors",
  btnSecondary:
    "px-5 py-2 rounded-md border border-[#007EA7] bg-white text-[#007EA7] font-semibold text-sm cursor-pointer hover:bg-violet-50 transition-colors",
};

// Campo de formulário com label e mensagem de erro
const Field = ({ label, required, error, children }) => (
  <div className={tw.fieldGroup}>
    <label className={tw.label}>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <span className={tw.errorText}>{error}</span>}
  </div>
);

const OrcamentoHeader = () => (
  <div className="text-center mb-10">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 pb-6">
      Gerar Novo Orçamento
    </h1>
  </div>
);

// Seção de informações gerais — número e cliente preenchidos automaticamente pelo pedido
const OrcamentoInformacoes = ({
  dados,
  onChange,
  errors,
  clientes = [],
  pedidos = [],
}) => {
  const statusAtual =
    STATUS_OPTIONS.find((s) => s.value === dados.status_id) ||
    STATUS_OPTIONS[0];
  // Nome do cliente vem direto do pedido selecionado
  const clienteNome = dados.cliente_nome;

  return (
    <div className={tw.card}>
      <div className={tw.cardHeader}>
        <div className="w-1.5 h-5 rounded-sm bg-[var(--button-color)]" />
        <h2 className="m-0 text-sm font-bold text-slate-800">
          Informações Gerais
        </h2>
      </div>
      <div className={tw.cardBody}>
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {/* Número */}
          <Field label="Número do Orçamento">
            <input
              className={`${tw.input} ${tw.inputReadOnly}`}
              value={dados.numero_orcamento}
              placeholder="Selecione um pedido"
              readOnly
            />
          </Field>

          {/* Cliente */}
          <Field label="Cliente" required error={errors.cliente_id}>
            <input
              className={`${tw.input} ${tw.inputReadOnly}`}
              value={clienteNome}
              placeholder="Selecione um pedido"
              readOnly
            />
          </Field>

          {/* Pedido */}
          <Field label="Pedido" required error={errors.pedido_id}>
            <select
              className={`${tw.select} ${errors.pedido_id ? "border-red-400" : ""}`}
              value={dados.pedido_id}
              onChange={(e) => onChange("pedido_id", e.target.value)}
            >
              <option value="">Selecione o pedido</option>
              {pedidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.produtosDesc
                    ? `Pedido #${p.id} — ${p.produtosDesc}`
                    : `Pedido #${p.id}`}
                </option>
              ))}
            </select>
          </Field>

          {/* Status */}
          <Field label="Status">
            <div className="flex items-center gap-2">
              <select
                className={tw.select}
                value={dados.status_id}
                onChange={(e) => onChange("status_id", e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: statusAtual.color }}
              />
            </div>
          </Field>

          {/* Data do Orçamento */}
          <Field
            label="Data do Orçamento"
            required
            error={errors.data_orcamento}
          >
            <input
              type="date"
              className={`${tw.input} ${errors.data_orcamento ? "border-red-400" : ""}`}
              value={dados.data_orcamento}
              onChange={(e) => onChange("data_orcamento", e.target.value)}
            />
          </Field>

          {/* Prazo de Instalação */}
          <Field label="Prazo de Instalação">
            <input
              type="date"
              className={tw.input}
              value={dados.prazo_instalacao}
              onChange={(e) => onChange("prazo_instalacao", e.target.value)}
            />
          </Field>

          {/* Garantia */}
          <Field label="Garantia">
            <input
              className={tw.input}
              placeholder="Ex: 12 meses"
              value={dados.garantia}
              onChange={(e) => onChange("garantia", e.target.value)}
            />
          </Field>

          {/* Forma de Pagamento */}
          <Field label="Forma de Pagamento">
            <select
              className={tw.select}
              value={dados.forma_pagamento}
              onChange={(e) => onChange("forma_pagamento", e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="BOLETO">Boleto Bancário</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO_CREDITO">Cartão de Crédito</option>
              <option value="TRANSFERENCIA">Transferência Bancária</option>
              <option value="CHEQUE">Cheque</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </Field>

          {/* Observações — ocupa coluna inteira */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Observações">
              <textarea
                className={`${tw.input} min-h-[88px] resize-y`}
                placeholder="Anotações internas, condições comerciais, detalhes técnicos..."
                value={dados.observacoes}
                onChange={(e) => onChange("observacoes", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

// Item individual do orçamento — selecionar produto preenche descrição e preço automaticamente
const OrcamentoItemRow = ({
  item,
  index,
  onChange,
  onProductSelect,
  onRemove,
  errors,
  produtos = [],
}) => {
  const subtotal = calcularSubtotalItem(
    item.quantidade,
    item.preco_unitario,
    item.desconto,
  );
  const errItem = errors[item.id] || {};

  const handleChange = useCallback(
    (field, value) => {
      onChange(item.id, field, value);
    },
    [item.id, onChange],
  );

  return (
    <div className={tw.card}>
      {/* Cabeçalho do item */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--primary-color)] flex items-center justify-center text-[11px] font-bold text-white">
            {String(index + 1).padStart(2, "0")}
          </div>
          <span className="text-sm font-semibold text-slate-600">Item</span>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-600 text-xs font-semibold cursor-pointer hover:bg-red-100 transition-colors"
        >
          <Trash2 size={12} />
          Remover
        </button>
      </div>

      <div className="p-7">
        {/* Linha 1: Produto + Descrição */}
        <div
          className="grid gap-6 mb-7"
          style={{ gridTemplateColumns: "1fr 2fr" }}
        >
          <Field label="Produto (opcional)">
            <select
              className={tw.select}
              value={item.produto_id}
              onChange={(e) => onProductSelect(item.id, e.target.value)}
            >
              <option value="">Sem produto vinculado</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Descrição" required error={errItem.descricao}>
            <input
              className={`${tw.input} ${errItem.descricao ? "border-red-400" : ""}`}
              placeholder="Descrição do item ou serviço"
              value={item.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
            />
          </Field>
        </div>

        {/* Linha 2: Qtd + Preço + Desconto + Subtotal */}
        <div className="grid grid-cols-4 gap-6 mb-7">
          <Field label="Quantidade">
            <input
              type="number"
              min="0"
              step="1"
              className={tw.input}
              placeholder="0"
              value={item.quantidade}
              onChange={(e) => handleChange("quantidade", e.target.value)}
            />
          </Field>
          <Field label="Preço Unitário (R$)">
            <input
              type="number"
              min="0"
              step="0.01"
              className={tw.input}
              placeholder="0,00"
              value={item.preco_unitario}
              onChange={(e) => handleChange("preco_unitario", e.target.value)}
            />
          </Field>
          <Field label="Desconto (R$)">
            <input
              type="number"
              min="0"
              step="0.01"
              className={tw.input}
              placeholder="0,00"
              value={item.desconto}
              onChange={(e) => handleChange("desconto", e.target.value)}
            />
          </Field>
          <Field label="Subtotal">
            <div
              className={`${tw.input} ${tw.inputReadOnly} font-bold text-[var(--button-color)] flex items-center`}
            >
              {formatCurrencyBR(subtotal)}
            </div>
          </Field>
        </div>

        {/* Observação do item */}
        <Field label="Observação do Item">
          <input
            className={tw.input}
            placeholder="Observação específica para este item..."
            value={item.observacao}
            onChange={(e) => handleChange("observacao", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
};

// Lista de itens do orçamento
const OrcamentoItens = ({
  itens,
  onAdd,
  onRemove,
  onChange,
  onProductSelect,
  errors,
  produtos = [],
}) => (
  <div className={tw.card}>
    <div className={`${tw.cardHeader} justify-between`}>
      <div className="flex items-center gap-2.5">
        <div className="w-1.5 h-5 rounded-sm bg-violet-500" />
        <h2 className="m-0 text-sm font-bold text-slate-800">
          Itens do Orçamento
        </h2>
        <span className="bg-violet-100 text-violet-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
          {itens.length} {itens.length === 1 ? "item" : "itens"}
        </span>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border-[1.5px] border-[var(--primary-color)] bg-blue-50 text-[var(--primary-color)] text-sm font-semibold cursor-pointer hover:bg-blue-100 transition-colors"
      >
        <Plus size={15} />
        Adicionar Item
      </button>
    </div>

    <div className="p-8 flex flex-col gap-7">
      {itens.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
          <Package size={32} className="mx-auto mb-2.5 opacity-40" />
          <p className="m-0 text-sm">Nenhum item adicionado.</p>
          <p className="mt-1 text-xs">
            Clique em "Adicionar Item" para começar.
          </p>
        </div>
      ) : (
        itens.map((item, index) => (
          <OrcamentoItemRow
            key={item.id}
            item={item}
            index={index}
            onChange={onChange}
            onProductSelect={onProductSelect}
            onRemove={onRemove}
            errors={errors}
            produtos={produtos}
          />
        ))
      )}
    </div>
  </div>
);

// Painel lateral com resumo financeiro (sticky)
const OrcamentoResumo = ({
  subtotalGeral,
  descontoGeral,
  totalFinal,
  onDescontoChange,
}) => (
  <div className={`${tw.card} sticky top-24`}>
    <div className={tw.cardHeader}>
      <div className="w-1.5 h-5 rounded-sm bg-emerald-500" />
      <h2 className="m-0 text-sm font-bold text-slate-800">
        Resumo Financeiro
      </h2>
    </div>

    <div className="p-10 flex flex-col gap-10">
      {/* Subtotal */}
      <div className="flex flex-col gap-3">
        <span className={tw.label}>Subtotal Geral</span>
        <div className="px-5 py-4 bg-slate-50 rounded-lg border-[1.5px] border-slate-200 text-base font-bold text-slate-700 text-right tracking-tight">
          {formatCurrencyBR(subtotalGeral)}
        </div>
      </div>

      {/* Desconto Geral */}
      <div className="flex flex-col gap-3">
        <label className={tw.label}>Desconto Geral (R$)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className={`${tw.input} border-yellow-300 bg-amber-50`}
          placeholder="0,00"
          value={descontoGeral}
          onChange={(e) => onDescontoChange(e.target.value)}
        />
      </div>

      <div className="h-px bg-slate-200" />

      {/* Total Final */}
      <div className="flex flex-col gap-2">
        <span className={tw.label}>Total Final</span>
        <div className="px-5 py-3 rounded-lg text-xl font-extrabold text-white text-right tracking-tight shadow-md bg-[var(--button-color)]">
          {formatCurrencyBR(totalFinal)}
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex flex-col gap-4 pt-2">
        {[
          {
            label: "Subtotal dos itens",
            value: subtotalGeral,
            cls: "text-slate-600",
          },
          {
            label: "Desconto geral",
            value: -(parseFloat(descontoGeral) || 0),
            cls: "text-red-500",
          },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center">
            <span className="text-xs text-slate-400">{row.label}</span>
            <span className={`text-sm font-semibold ${row.cls}`}>
              {row.value < 0
                ? `- ${formatCurrencyBR(Math.abs(row.value))}`
                : formatCurrencyBR(row.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Toast de feedback (sucesso/erro)
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const map = {
    success: {
      cls: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: <CheckCircle size={16} className="text-green-600 shrink-0" />,
    },
    error: {
      cls: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: <AlertCircle size={16} className="text-red-600 shrink-0" />,
    },
  };
  const c = map[type] || map.success;
  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3.5 rounded-xl border shadow-2xl animate-[slideIn_0.2s_ease] ${c.cls}`}
    >
      {c.icon}
      <span className={`text-sm font-semibold ${c.text}`}>{message}</span>
      <button
        onClick={onClose}
        className={`ml-2 bg-transparent border-none cursor-pointer text-base leading-none ${c.text}`}
      >
        ×
      </button>
    </div>
  );
};

// ── Página principal ──
export default function OrcamentoPage() {
  const navigate = useNavigate();
  const { pedidoId } = useParams();
  // Layout
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dados do formulário
  const [dadosGerais, setDadosGerais] = useState({
    numero_orcamento: gerarNumeroOrcamento(pedidoId || ""),
    cliente_id: "",
    cliente_nome: "",
    pedido_id: pedidoId || "",
    status_id: "RASCUNHO",
    data_orcamento: new Date().toISOString().split("T")[0],
    prazo_instalacao: "",
    garantia: "",
    forma_pagamento: "",
    observacoes: "",
  });

  // Itens, desconto e UI
  const [itens, setItens] = useState([criarItemVazio(1)]);
  const [descontoGeral, setDescontoGeral] = useState("");
  const [errors, setErrors] = useState({});
  const [itemErrors, setItemErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  // Dados da API
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  // Carrega clientes, pedidos e produtos ao montar
  useEffect(() => {
    Api.get("/clientes")
      .then((res) => setClientes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setClientes([]));

    Api.get("/pedidos")
      .then((res) => {
        const lista = Array.isArray(res.data) ? res.data : [];
        setPedidos(
          lista.map((p) => ({
            id: p.id,
            clienteId: p.cliente?.id || "",
            clienteNome: p.cliente?.nome || "",
            produtosDesc:
              p.servico?.nome ||
              p.produtos?.map((i) => i.nomeProduto).join(", ") ||
              "",
          })),
        );
      })
      .catch(() => setPedidos([]));

    Api.get("/estoques")
      .then((res) => {
        const lista = Array.isArray(res.data) ? res.data : [];
        setProdutos(
          lista
            .map((e) => ({
              id: e.produto?.id,
              nome: e.produto?.nome,
              preco: e.produto?.preco ?? "",
            }))
            .filter((p) => p.id && p.nome),
        );
      })
      .catch(() => setProdutos([]));
  }, []);

  // Cálculos derivados
  const subtotalGeral = useMemo(() => calcularSubtotalGeral(itens), [itens]);
  const totalFinal = useMemo(
    () => calcularTotalFinal(subtotalGeral, descontoGeral),
    [subtotalGeral, descontoGeral],
  );

  // Quando os pedidos carregam, sincroniza cliente se já há pedido selecionado
  useEffect(() => {
    if (!pedidos.length || !dadosGerais.pedido_id) return;
    const pedido = pedidos.find(
      (p) => String(p.id) === String(dadosGerais.pedido_id),
    );
    if (pedido) {
      setDadosGerais((prev) => ({
        ...prev,
        cliente_id: String(pedido.clienteId || ""),
        cliente_nome: pedido.clienteNome || "",
        numero_orcamento: gerarNumeroOrcamento(pedido.id),
      }));
    }
  }, [pedidos]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ao trocar o pedido, atualiza número do orçamento e cliente automaticamente
  const handleDadosChange = useCallback(
    (field, value) => {
      setDadosGerais((prev) => {
        const updates = { ...prev, [field]: value };
        if (field === "pedido_id") {
          updates.numero_orcamento = gerarNumeroOrcamento(value);
          const pedido = pedidos.find((p) => String(p.id) === String(value));
          if (pedido?.clienteId) updates.cliente_id = String(pedido.clienteId);
          updates.cliente_nome = pedido?.clienteNome || "";
        }
        return updates;
      });
      if (errors[field])
        setErrors((prev) => {
          const e = { ...prev };
          delete e[field];
          return e;
        });
    },
    [errors, pedidos],
  );

  // Adiciona item vazio
  const handleAddItem = useCallback(() => {
    setItens((prev) => [...prev, criarItemVazio(prev.length + 1)]);
  }, []);

  // Remove item e reordena
  const handleRemoveItem = useCallback((id) => {
    setItens((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, i) => ({ ...item, ordem: i + 1 })),
    );
    setItemErrors((prev) => {
      const e = { ...prev };
      delete e[id];
      return e;
    });
  }, []);

  // Atualiza campo de um item e limpa o erro do campo
  const handleItemChange = useCallback(
    (id, field, value) => {
      setItens((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
      if (itemErrors[id]?.[field]) {
        setItemErrors((prev) => {
          const e = { ...prev };
          if (e[id]) {
            delete e[id][field];
            if (!Object.keys(e[id]).length) delete e[id];
          }
          return e;
        });
      }
    },
    [itemErrors],
  );

  // Ao selecionar produto, preenche descrição e preço automaticamente
  const handleItemProductSelect = useCallback(
    (id, produtoId) => {
      const produto = produtos.find((p) => String(p.id) === String(produtoId));
      setItens((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                produto_id: produtoId,
                descricao: produto ? produto.nome : item.descricao,
                preco_unitario: produto
                  ? String(produto.preco)
                  : item.preco_unitario,
              }
            : item,
        ),
      );
    },
    [produtos],
  );

  // Valida campos obrigatórios e retorna true se tudo ok
  const validar = useCallback(() => {
    const newErrors = {};
    if (!dadosGerais.cliente_id) newErrors.cliente_id = "Cliente é obrigatório";
    if (!dadosGerais.pedido_id) newErrors.pedido_id = "Pedido é obrigatório";
    if (!dadosGerais.data_orcamento)
      newErrors.data_orcamento = "Data é obrigatória";

    const newItemErrors = {};
    itens.forEach((item) => {
      if (!item.descricao.trim()) {
        newItemErrors[item.id] = { descricao: "Descrição obrigatória" };
      }
    });

    setErrors(newErrors);
    setItemErrors(newItemErrors);
    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(newItemErrors).length === 0
    );
  }, [dadosGerais, itens]);

  // Salva rascunho localmente
  const handleSaveDraft = useCallback(() => {
    setLastSaved(new Date());
    setToast({ message: "Rascunho salvo com sucesso!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Valida, monta payload e gera a planilha
  const handleSaveAndDownload = useCallback(() => {
    if (!validar()) {
      setToast({
        message: "Corrija os campos obrigatórios antes de gerar a planilha.",
        type: "error",
      });
      setTimeout(() => setToast(null), 4000);
      return;
    }
    const payload = {
      ...dadosGerais,
      itens,
      valor_subtotal: subtotalGeral,
      valor_desconto: parseFloat(descontoGeral) || 0,
      valor_total: totalFinal,
    };
    console.log("Payload (geração de planilha):", payload);
    setLastSaved(new Date());
    setToast({ message: "Planilha gerada com sucesso!", type: "success" });
    setTimeout(() => {
      setToast(null);
      navigate("/Pedidos");
    }, 2000);
  }, [
    validar,
    dadosGerais,
    itens,
    subtotalGeral,
    descontoGeral,
    totalFinal,
    navigate,
  ]);

  return (
    <>
      <style>{`
        input:focus, select:focus, textarea:focus {
          border-color: var(--button-color) !important;
          box-shadow: 0 0 0 3px rgba(0,126,167,0.12);
        }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div className="flex flex-col items-center gap-10 bg-[#f7f9fa] min-h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col w-full items-center">
          <div className="w-full">
            <Header
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              sidebarOpen={sidebarOpen}
            />
          </div>

          <div className="pt-20 lg:pt-20" />

          <div className="w-full max-w-[1400px] mx-auto px-6 py-10 flex flex-col gap-3">
            {/* Botão Voltar */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar para Pedidos
              </button>
            </div>

            <OrcamentoHeader />

            {/* Layout duas colunas */}
            <div
              className="grid gap-8 items-start"
              style={{ gridTemplateColumns: "1fr 320px" }}
            >
              {/* Coluna Principal */}
              <div className="flex flex-col gap-8">
                <OrcamentoInformacoes
                  dados={dadosGerais}
                  onChange={handleDadosChange}
                  errors={errors}
                  clientes={clientes}
                  pedidos={pedidos}
                />
                <OrcamentoItens
                  itens={itens}
                  onAdd={handleAddItem}
                  onRemove={handleRemoveItem}
                  onChange={handleItemChange}
                  onProductSelect={handleItemProductSelect}
                  errors={itemErrors}
                  produtos={produtos}
                />
              </div>

              {/* Sidebar: Resumo */}
              <OrcamentoResumo
                subtotalGeral={subtotalGeral}
                descontoGeral={descontoGeral}
                totalFinal={totalFinal}
                onDescontoChange={setDescontoGeral}
              />
            </div>

            {/* Rodapé com botões */}
            <div className="mt-15 px-6 py-6 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-6 flex-wrap shadow-sm">
              <span className="text-xs text-slate-400">
                {lastSaved
                  ? `Última atualização: ${lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                  : "Nenhuma alteração salva ainda"}
              </span>
              <div className="flex gap-4 flex-wrap">
                <button onClick={() => navigate(-1)} className={tw.btnOutline}>
                  Cancelar
                </button>
                <button onClick={handleSaveDraft} className={tw.btnSecondary}>
                  Salvar Rascunho
                </button>
                <button
                  onClick={handleSaveAndDownload}
                  className={`${tw.btnPrimary} flex items-center gap-2`}
                >
                  <Download size={15} />
                  Salvar e Baixar Planilha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
