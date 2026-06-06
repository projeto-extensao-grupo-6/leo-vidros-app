import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import PropTypes from "prop-types";
import { ExternalLink, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/client/Api";
import { formatCurrency } from "../../../utils/formatters";
import Button from "../../../components/ui/Button/Button.component";
import UniversalInput from "../../../components/ui/Input/UniversalInput";
import PedidosService from "../../../api/services/pedidosService";

export default function ClienteDetailsModal({
  open,
  onClose,
  cliente,
  servicos: servicosProp,
}) {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const PEDIDOS_URL = "/Pedidos";

  const abrirPedido = (pedido) => {
    if (!pedido?.id) return;

    const tipoPedido = String(pedido?.tipoPedido ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    onClose?.();

    if (tipoPedido.includes("servico") || pedido?.servico) {
      navigate(`/Servicos/${pedido.id}`);
      return;
    }

    navigate("/pedidos", {
      state: {
        initialTab: "pedidos",
        abrirPedidoProdutoId: pedido.id,
      },
    });
  };

  const endereco =
    cliente?.enderecos?.[0] ||
    servicosProp?.find((p) => p.cliente)?.cliente?.enderecos?.[0] ||
    undefined;

  useEffect(() => {
    let isMounted = true;

    if (Array.isArray(servicosProp) && servicosProp.length > 0 && cliente?.id) {
      const filtered = servicosProp.filter((p) => p.cliente?.id === cliente.id);
      setServicos(filtered);
    } else if (open && cliente?.id) {
      const fetchServicosPorCliente = async () => {
        setLoading(true);
        try {
          const response = await api.get(`${PEDIDOS_URL}?clienteId=${cliente.id}`);
          const data = Array.isArray(response.data) ? response.data : [];
          if (isMounted) setServicos(data);
        } catch {
          if (isMounted) setServicos([]);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchServicosPorCliente();
    }

    return () => {
      isMounted = false;
    };
  }, [open, cliente, servicosProp]);

  if (!cliente) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 w-full sm:w-11/12 max-h-[100dvh] sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2 space-y-4 sm:space-y-8 overflow-hidden sm:rounded-xl rounded-none bg-white p-4 sm:p-8 shadow-sm flex flex-col">
        <div className="mb-2 sm:mb-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="rounded bg-gray-100 p-2">
              <User className="h-5 w-5 text-gray-700" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Detalhes do Cliente</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="animate-pulse font-medium text-gray-500">Carregando histórico...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:gap-8 pt-2 sm:pt-4 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <UniversalInput label="Nome" value={cliente.nome || "N/A"} readOnly />
              </div>

              <div className="flex flex-col gap-1">
                <UniversalInput label="Telefone" value={cliente.telefone || "N/A"} readOnly />
              </div>

              <div className="flex flex-col gap-1">
                <UniversalInput label="Email" value={cliente.email || "N/A"} readOnly />
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-3 sm:pb-6 pt-2 sm:pt-4">
              <UniversalInput
                label="Endereço"
                value={
                  endereco && (endereco.rua || endereco.bairro || endereco.cep)
                    ? `${endereco.rua || ""}${endereco.numero ? ", " + endereco.numero : ""}${endereco.bairro ? " - " + endereco.bairro : ""}${endereco.cidade ? " / " + endereco.cidade : ""}${endereco.uf ? " - " + endereco.uf : ""}`
                    : "N/A"
                }
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="mb-2 sm:mb-4 text-base sm:text-lg font-bold text-gray-800">Histórico de Serviços</h3>
              <div className="max-h-[35vh] sm:max-h-[42vh] w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-sm">
                {servicos && servicos.length > 0 ? (
                  <>
                    {/* Desktop table */}
                    <table className="hidden sm:table w-full border-collapse">
                      <thead className="sticky top-0 bg-[#007EA7] text-white">
                        <tr>
                          <th className="p-3 text-left font-semibold">Serviço</th>
                          <th className="p-3 text-left font-semibold">Valor Total</th>
                          <th className="p-3 text-left font-semibold">Status</th>
                          <th className="p-3 text-left font-semibold">Pagamento</th>
                          <th className="p-3 text-left font-semibold">Etapa</th>
                          <th className="p-3 text-left font-semibold">Descrição</th>
                          <th className="p-3 text-left font-semibold">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {servicos.map((pedido, index) => {
                          const serv = pedido.servico || {};
                          const tipoPedido = String(pedido?.tipoPedido ?? "")
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();
                          const ehPedidoServico = tipoPedido.includes("servico") || Boolean(pedido?.servico);
                          const nomeServico = ehPedidoServico
                            ? serv.nome || "Serviço"
                            : "Compra de produto avulso";
                          const statusNome = ehPedidoServico
                            ? pedido.status?.nome || pedido.status || "N/A"
                            : "";
                          const etapaNome = ehPedidoServico
                            ? PedidosService.calcularEtapaServicoPorAgendamentos(
                                serv,
                                serv.etapa?.nome || "PENDENTE",
                              )
                            : "";

                          return (
                            <tr key={pedido.id ?? index} className="hover:bg-gray-50 transition-colors">
                              <td className="p-3 text-gray-900">{nomeServico}</td>
                              <td className="p-3 text-gray-900">
                                {formatCurrency(pedido.valorTotal ?? serv.precoBase)}
                              </td>
                              <td className="p-3 text-gray-900">{statusNome}</td>
                              <td className="p-3 text-gray-900">{pedido.formaPagamento || "N/A"}</td>
                              <td className="p-3 text-gray-900">{etapaNome}</td>
                              <td className="p-3 text-sm text-gray-900">{serv.descricao || "N/A"}</td>
                              <td className="p-3">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => abrirPedido(pedido)}
                                  startIcon={<ExternalLink className="h-4 w-4" />}
                                >
                                  Visualizar pedido
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Mobile card layout */}
                    <div className="sm:hidden divide-y divide-gray-200">
                      {servicos.map((pedido, index) => {
                        const serv = pedido.servico || {};
                        const tipoPedido = String(pedido?.tipoPedido ?? "")
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase();
                        const ehPedidoServico = tipoPedido.includes("servico") || Boolean(pedido?.servico);
                        const nomeServico = ehPedidoServico
                          ? serv.nome || "Serviço"
                          : "Compra de produto avulso";
                        const statusNome = ehPedidoServico
                          ? pedido.status?.nome || pedido.status || "N/A"
                          : "";
                        const etapaNome = ehPedidoServico
                          ? PedidosService.calcularEtapaServicoPorAgendamentos(
                              serv,
                              serv.etapa?.nome || "PENDENTE",
                            )
                          : "";

                        return (
                          <div key={pedido.id ?? index} className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-gray-900">{nomeServico}</span>
                              <span className="text-sm font-bold text-gray-900">
                                {formatCurrency(pedido.valorTotal ?? serv.precoBase)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                              {statusNome && <span>Status: {statusNome}</span>}
                              <span>Pgto: {pedido.formaPagamento || "N/A"}</span>
                              {etapaNome && <span>Etapa: {etapaNome}</span>}
                            </div>
                            {serv.descricao && (
                              <p className="text-xs text-gray-500 line-clamp-2">{serv.descricao}</p>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full justify-center"
                              onClick={() => abrirPedido(pedido)}
                              startIcon={<ExternalLink className="h-4 w-4" />}
                            >
                              Visualizar pedido
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="p-6 italic text-gray-500">
                    Nenhum histórico encontrado para este cliente.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

ClienteDetailsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  cliente: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nome: PropTypes.string,
    telefone: PropTypes.string,
    email: PropTypes.string,
    enderecos: PropTypes.arrayOf(
      PropTypes.shape({
        rua: PropTypes.string,
        bairro: PropTypes.string,
        cidade: PropTypes.string,
        uf: PropTypes.string,
        cep: PropTypes.string,
      }),
    ),
  }),
  servicos: PropTypes.arrayOf(PropTypes.object),
};
