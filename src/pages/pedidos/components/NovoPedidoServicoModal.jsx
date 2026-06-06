import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Briefcase,
  Plus,
  AlertCircle,
  User,
  ClipboardList,
  MapPin,
} from "lucide-react";
import Api from "../../../api/client/Api";
import { cpfMask, phoneMask, cepMask, onlyLetters } from "../../../utils/masks";
import FeedbackModal from "../../../components/feedback/FeedbackModal/FeedbackModal";
import Button from "../../../components/ui/Button/Button.component";
import UniversalInput from "../../../components/ui/Input/UniversalInput";
import {
  pedidoServicoEtapa0Schema,
  pedidoServicoEnderecoSchema,
  pedidoServicoEtapa2Schema,
  zodFirstError,
} from "../../../lib/schemas";
import { modalClasses } from "../../../components/ui/modal/modalStyles";

const usePedidoServicoAPI = () => {
  const cadastrarCliente = async (clienteData) => {
    try {
      const response = await Api.post(`/clientes`, {
        nome: clienteData.nome,
        cpf: clienteData.cpf || "",
        email: clienteData.email || "",
        telefone: clienteData.telefone ? clienteData.telefone.replace(/\D/g, "") : "",
        status: "Ativo",
        enderecos: clienteData.enderecos || [],
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao cadastrar cliente",
      );
    }
  };

  const salvarServico = async (servicoData) => {
    try {
      const response = await Api.post(`/pedidos`, servicoData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erro ao salvar servico");
    }
  };

  const buscarClientes = async () => {
    try {
      const response = await Api.get(`/clientes`);
      const data = response.data;
      return Array.isArray(data) ? data : (data?.content ?? []);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erro ao buscar clientes");
    }
  };

  return { cadastrarCliente, salvarServico, buscarClientes };
};

const DEFAULT_ENDERECO = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

const DEFAULT_FORM_DATA = {
  tipoCliente: "",
  clienteId: "",
  clienteNome: "",
  clienteCpf: "",
  clienteEmail: "",
  clienteTelefone: "",
  endereco: { ...DEFAULT_ENDERECO },
  servicos: [],
  etapa: "PENDENTE",
  prioridade: "Normal",
};

const NovoPedidoServicoModal = ({
  isOpen,
  onClose,
  onSuccess,
  clienteInicial,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState(null);
  const [clientesExistentes, setClientesExistentes] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { cadastrarCliente, salvarServico, buscarClientes } =
    usePedidoServicoAPI();

  // O step de Endereco so existe para cliente novo (cliente existente ja tem endereco).
  const isNovoCliente = formData.tipoCliente === "novo";
  const steps = isNovoCliente
    ? [
        { id: "cliente", name: "Cliente" },
        { id: "endereco", name: "Endereco" },
        { id: "servico", name: "Servico" },
        { id: "revisao", name: "Revisao" },
      ]
    : [
        { id: "cliente", name: "Cliente" },
        { id: "servico", name: "Servico" },
        { id: "revisao", name: "Revisao" },
      ];
  const currentStepId = steps[currentStep]?.id;

  useEffect(() => {
    if (!isOpen) return;

    setFormData(
      clienteInicial
        ? {
            ...DEFAULT_FORM_DATA,
            tipoCliente: "existente",
            clienteId: clienteInicial.id ?? "",
            clienteNome: clienteInicial.nome ?? "",
          }
        : DEFAULT_FORM_DATA,
    );
    setCurrentStep(0);
    setError(null);
    setShowSuccessModal(false);

    const carregarDados = async () => {
      try {
        const clientes = await buscarClientes();
        setClientesExistentes(Array.isArray(clientes) ? clientes : []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setClientesExistentes([]);
      }
    };

    carregarDados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, clienteInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;
    if (name === "clienteNome") novoValor = onlyLetters(value);
    else if (name === "clienteTelefone") novoValor = phoneMask(value);
    else if (name === "clienteCpf") novoValor = cpfMask(value);

    setFormData((prev) => ({
      ...prev,
      [name]: novoValor,
    }));
    setError(null);
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;
    if (name === "numero") novoValor = value.replace(/\D/g, "");
    else if (name === "uf") novoValor = onlyLetters(value).toUpperCase().slice(0, 2);

    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: novoValor },
    }));
    setError(null);
  };

  const handleCepChange = async (e) => {
    const maskedValue = cepMask(e.target.value);
    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, cep: maskedValue },
    }));
    setError(null);

    const cleanCep = maskedValue.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: data.logradouro || prev.endereco.rua,
            bairro: data.bairro || prev.endereco.bairro,
            cidade: data.localidade || prev.endereco.cidade,
            uf: data.uf || prev.endereco.uf,
          },
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleTipoClienteChange = (tipo) => {
    setFormData((prev) => ({
      ...prev,
      tipoCliente: tipo,
      clienteId: "",
      clienteNome: "",
      clienteCpf: "",
      clienteEmail: "",
      clienteTelefone: "",
      endereco: { ...DEFAULT_ENDERECO },
    }));
    setError(null);
  };

  const handleClienteExistenteChange = (e) => {
    const id = e.target.value;
    const selecionado = clientesExistentes.find(
      (cliente) => String(cliente.id) === String(id),
    );

    setFormData((prev) => ({
      ...prev,
      clienteId: selecionado?.id ?? "",
      clienteNome: selecionado?.nome ?? "",
    }));
    setError(null);
  };

  const handleServicoChange = (index, field, value) => {
    setFormData((prev) => {
      const proximosServicos =
        prev.servicos.length > index
          ? [...prev.servicos]
          : [...prev.servicos, { nome: "", descricao: "", precoEstimado: 0 }];

      proximosServicos[index] = {
        ...proximosServicos[index],
        [field]: field === "precoEstimado" ? parseFloat(value) || 0 : value,
      };

      return { ...prev, servicos: proximosServicos };
    });
    setError(null);
  };

  const calcularValorTotal = () =>
    formData.servicos.reduce((total, servico) => total + (servico.precoEstimado || 0), 0);

  const validateStep = () => {
    setError(null);

    if (currentStepId === "cliente" && !formData.tipoCliente) {
      setError("Selecione como o cliente sera informado");
      return false;
    }

    const schemaPorStep = {
      cliente: pedidoServicoEtapa0Schema,
      endereco: pedidoServicoEnderecoSchema,
      servico: pedidoServicoEtapa2Schema,
    };

    const schema = schemaPorStep[currentStepId];
    if (!schema) return true;

    const result = schema.safeParse(formData);
    if (!result.success) {
      setError(zodFirstError(result.error));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSave = async () => {
    if (!validateStep()) return;

    setLoading(true);

    try {
      let clienteData = null;

      if (formData.tipoCliente === "novo") {
        const { endereco } = formData;
        clienteData = await cadastrarCliente({
          nome: formData.clienteNome,
          cpf: formData.clienteCpf.replace(/\D/g, ""),
          email: formData.clienteEmail.trim(),
          telefone: formData.clienteTelefone.replace(/\D/g, ""),
          enderecos: [
            {
              rua: endereco.rua,
              numero: endereco.numero || "",
              complemento: endereco.complemento || "",
              bairro: endereco.bairro || "",
              cidade: endereco.cidade,
              cep: endereco.cep.replace(/\D/g, ""),
              uf: endereco.uf,
              pais: "Brasil",
            },
          ],
        });
      } else {
        clienteData = clientesExistentes.find(
          (cliente) => String(cliente.id) === String(formData.clienteId),
        );
      }

      const total = calcularValorTotal();
      const pedidoData = {
        pedido: {
          valorTotal: total,
          ativo: true,
          clienteId: clienteData.id,
          status: { tipo: "PEDIDO", nome: "ATIVO" },
        },
        servico: {
          nome: formData.servicos[0]?.nome || "Servico personalizado",
          descricao:
            formData.servicos.map((servico) => servico.descricao || servico.nome).join("; ") ||
            formData.servicos[0]?.nome ||
            "Servico personalizado",
          precoBase: total,
          ativo: true,
          etapaNome: formData.etapa,
        },
      };

      const salvo = await salvarServico(pedidoData);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        onSuccess?.(salvo);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message || "Erro ao salvar servico");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={modalClasses.overlay} onClick={onClose}>
        <div
          className={`${modalClasses.panel} flex max-h-[92vh] max-w-4xl flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={modalClasses.header}>
            <div className="flex items-center gap-3">
              <div className={modalClasses.headerIcon}>
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className={modalClasses.headerTitle}>Novo Pedido de Servico</h2>
              </div>
            </div>
          </div>

          <div className={modalClasses.stepperSection}>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <Fragment key={step.id}>
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                        index <= currentStep
                          ? "bg-[#007EA7] text-white shadow-md"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`mt-2 text-center text-sm ${
                        index <= currentStep
                          ? "font-semibold text-gray-900"
                          : "font-medium text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`mx-3 mb-6 h-1 flex-1 rounded-full ${
                        index < currentStep ? "bg-[#007EA7]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex w-full justify-center px-6 pt-5 sm:px-8">
            {error && (
              <div className={`${modalClasses.errorAlert} mb-4 w-full`}>
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Erro</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>

          <div className={`${modalClasses.body} flex flex-col`}>
            {currentStepId === "cliente" && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Cliente
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Escolha um cliente existente ou cadastre um novo para este pedido.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleTipoClienteChange("existente")}
                    className={`flex-1 rounded-md border px-4 py-4 shadow-sm transition-all hover:shadow-md ${
                      formData.tipoCliente === "existente"
                        ? "border-[#007EA7] bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <User className="h-5 w-5 text-[#007EA7]" />
                      <p className="text-sm font-semibold text-gray-900">
                        Cliente Existente
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipoClienteChange("novo")}
                    className={`flex-1 rounded-md border px-4 py-4 shadow-sm transition-all hover:shadow-md ${
                      formData.tipoCliente === "novo"
                        ? "border-[#007EA7] bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="h-5 w-5 text-[#007EA7]" />
                      <p className="text-sm font-semibold text-gray-900">
                        Cadastrar Novo
                      </p>
                    </div>
                  </button>
                </div>

                {!formData.tipoCliente && (
                  <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      Selecione uma opcao acima para continuar.
                    </p>
                  </div>
                )}

                {formData.tipoCliente === "existente" && (
                  <UniversalInput
                    as="select"
                    label="Selecionar Cliente"
                    placeholder="Selecione um cliente"
                    options={clientesExistentes.map((cliente) => ({
                      value: String(cliente.id),
                      label: cliente.nome,
                    }))}
                    value={formData.clienteId}
                    onChange={handleClienteExistenteChange}
                  />
                )}

                {formData.tipoCliente === "novo" && (
                  <div className="flex flex-col gap-3">
                    <UniversalInput
                      name="clienteNome"
                      label="Nome Completo"
                      placeholder="Digite o nome completo"
                      value={formData.clienteNome}
                      onChange={handleChange}
                    />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <UniversalInput
                        name="clienteCpf"
                        label="CPF"
                        placeholder="000.000.000-00"
                        value={formData.clienteCpf}
                        onChange={handleChange}
                      />
                      <UniversalInput
                        name="clienteTelefone"
                        label="Telefone"
                        placeholder="(00) 00000-0000"
                        value={formData.clienteTelefone}
                        onChange={handleChange}
                      />
                    </div>
                    <UniversalInput
                      name="clienteEmail"
                      type="email"
                      label="Email"
                      placeholder="cliente@email.com"
                      value={formData.clienteEmail}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            )}

            {currentStepId === "endereco" && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Endereco do Cliente
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Informe o endereco do novo cliente. O CEP preenche os demais campos automaticamente.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#007EA7]" />
                    <span className="text-sm font-semibold text-slate-800">
                      Endereco
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <UniversalInput
                        name="cep"
                        label="CEP"
                        placeholder="00000-000"
                        value={formData.endereco.cep}
                        onChange={handleCepChange}
                        hint={loadingCep ? "Buscando endereco..." : undefined}
                      />
                      <UniversalInput
                        name="numero"
                        label="Numero"
                        placeholder="123"
                        value={formData.endereco.numero}
                        onChange={handleEnderecoChange}
                      />
                    </div>

                    <UniversalInput
                      name="rua"
                      label="Rua"
                      placeholder="Digite a rua"
                      value={formData.endereco.rua}
                      onChange={handleEnderecoChange}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <UniversalInput
                        name="bairro"
                        label="Bairro"
                        placeholder="Digite o bairro"
                        value={formData.endereco.bairro}
                        onChange={handleEnderecoChange}
                      />
                      <UniversalInput
                        name="complemento"
                        label="Complemento"
                        placeholder="Apto, bloco, etc. (opcional)"
                        value={formData.endereco.complemento}
                        onChange={handleEnderecoChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
                      <UniversalInput
                        name="cidade"
                        label="Cidade"
                        placeholder="Digite a cidade"
                        value={formData.endereco.cidade}
                        onChange={handleEnderecoChange}
                      />
                      <UniversalInput
                        name="uf"
                        label="UF"
                        placeholder="UF"
                        value={formData.endereco.uf}
                        onChange={handleEnderecoChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStepId === "servico" && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Informacoes do Servico
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Preencha o servico principal e a estimativa de valor.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-[#007EA7]" />
                    <span className="text-sm font-semibold text-slate-800">
                      Servico
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <UniversalInput
                      label="Nome do Servico"
                      placeholder="Digite a descrição do serviço."
                      value={formData.servicos[0]?.nome ?? ""}
                      onChange={(e) =>
                        handleServicoChange(0, "nome", e.target.value)
                      }
                    />

                    <UniversalInput
                      as="textarea"
                      label="Descricao"
                      rows={4}
                      placeholder="Digite a descrição do serviço"
                      value={formData.servicos[0]?.descricao ?? ""}
                      onChange={(e) =>
                        handleServicoChange(0, "descricao", e.target.value)
                      }
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <UniversalInput
                        type="number"
                        label="Preco Estimado"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={formData.servicos[0]?.precoEstimado || 0}
                        onChange={(e) =>
                          handleServicoChange(0, "precoEstimado", e.target.value)
                        }
                      />

                      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-sm text-slate-500">Total estimado</p>
                        <p className="mt-1 text-2xl font-bold text-[#007EA7]">
                          R$ {calcularValorTotal().toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStepId === "revisao" && (
              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">
                    Revisao do Pedido
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Confira os dados antes de concluir o cadastro.
                  </p>
                </div>

                <div className="rounded-md border bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#007EA7]" />
                    <h4 className="font-semibold text-gray-900">Cliente</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Nome:</strong> {formData.clienteNome || "Nao informado"}
                    </p>
                    {isNovoCliente && (
                      <>
                        <p>
                          <strong>CPF:</strong> {formData.clienteCpf || "-"}
                        </p>
                        <p>
                          <strong>Email:</strong> {formData.clienteEmail || "-"}
                        </p>
                        <p>
                          <strong>Telefone:</strong> {formData.clienteTelefone || "-"}
                        </p>
                        <p>
                          <strong>Endereco:</strong>{" "}
                          {[
                            [formData.endereco.rua, formData.endereco.numero]
                              .filter(Boolean)
                              .join(", "),
                            formData.endereco.bairro,
                            [formData.endereco.cidade, formData.endereco.uf]
                              .filter(Boolean)
                              .join(" - "),
                            formData.endereco.cep,
                          ]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-md border bg-gray-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-[#007EA7]" />
                    <h4 className="font-semibold text-gray-900">Servico</h4>
                  </div>

                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>Nome:</strong> {formData.servicos[0]?.nome || "-"}
                    </p>
                    {formData.servicos[0]?.descricao && (
                      <p>
                        <strong>Descricao:</strong> {formData.servicos[0].descricao}
                      </p>
                    )}
                    <div className="border-t pt-3">
                      <p className="text-base font-semibold text-gray-900">
                        Total:{" "}
                        <span className="text-[#007EA7]">
                          R$ {calcularValorTotal().toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={modalClasses.footer}>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={loading}
                >
                  Voltar
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  disabled={loading}
                >
                  Próxima Etapa
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Pedido"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <FeedbackModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="success"
          title="Pedido Criado!"
          description="Seu pedido de servico foi cadastrado com sucesso!"
          duration={2500}
        />
      )}
    </>
  );
};

NovoPedidoServicoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  clienteInicial: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    nome: PropTypes.string,
    cpf: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    enderecos: PropTypes.arrayOf(
      PropTypes.shape({
        cep: PropTypes.string,
        rua: PropTypes.string,
        complemento: PropTypes.string,
        bairro: PropTypes.string,
        cidade: PropTypes.string,
        uf: PropTypes.string,
      }),
    ),
  }),
};

export default NovoPedidoServicoModal;
