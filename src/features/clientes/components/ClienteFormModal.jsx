import React, { useState, useEffect } from "react";
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ModalTitle,
  IconButton,
  Typography,
  Divider,
  Box,
  Switch,
  FormControlLabel,
  Stack,
  Grid,
  MenuItem,
  Input,
  MaskedInput,
  Button
} from "../../../shared/components/ui";

import {
  User,
  Phone,
  Mail,
  Home,
  Trash2,
  Settings,
  Plus,
  Building2,
  Map,
  DollarSign,
  Calendar,
  CreditCard,
  Percent,
  BadgeCheck,
} from "lucide-react";

import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";
import apiClient from "../../../core/api/axios.config";
import { cpfMask, removeMask } from "../../../utils/masks";
import { FORMAS_PAGAMENTO, FORMAS_PAGAMENTO_OPTIONS } from "../../../core/constants";

const getClienteInicial = () => ({
  nome: "",
  contato: "",
  email: "",
  endereco: "",
  status: "Inativo",
  historicoServicos: [],
  cidade: "",
  uf: "",
});

const getNovoServico = () => ({
  id: `temp-${Date.now()}`,
  servico: "",
  valor: 0,
  dataOrcamento: new Date().toISOString().split("T")[0],
  dataServico: "",
  formaPagamento: FORMAS_PAGAMENTO.NA,
  desconto: 0,
  funcionario: "N/A",
});

export default function ClienteFormModal({
  open,
  onClose,
  onSubmit,
  modoEdicao,
  clienteInicial,
}) {
  const [clienteData, setClienteData] = useState(getClienteInicial());
  const [historico, setHistorico] = useState([]);
  
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchFuncionarios = async () => {
        try {
          const response = await apiClient.get("/funcionarios");
          setFuncionarios(response.data);
        } catch (error) {
          console.error("Erro ao buscar funcionários:", error);
        }
      };
      
      fetchFuncionarios();
    } else {
      setFuncionarios([]); 
    }
  }, [open]); 

useEffect(() => {
  if (modoEdicao && clienteInicial) {

    const endereco = clienteInicial.enderecos?.[0] || {};

    setClienteData({
      ...getClienteInicial(),

      nome: clienteInicial.nome,
      contato: clienteInicial.telefone,
      email: clienteInicial.email,
      cpf: clienteInicial.cpf,
      status: clienteInicial.status,
      rua: endereco.rua,
      complemento: endereco.complemento,
      cep: endereco.cep,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      uf: endereco.uf,
      endereco: endereco.rua,
    });

    setHistorico(clienteInicial.historicoServicos || []);

  } else {
    setClienteData(getClienteInicial());
    setHistorico([]);
  }
}, [open, modoEdicao, clienteInicial]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e) => {
    setClienteData((prev) => ({
      ...prev,
      status: e.target.checked ? "Ativo" : "Inativo",
    }));
  };

  const handleHistoricoChange = (index, fieldName, value) => {
    const novoHistorico = [...historico];
    if (!novoHistorico[index]) novoHistorico[index] = {};

    let finalValue = value;
    if (fieldName === "valor" || fieldName === "desconto") {
      finalValue = parseFloat(value) || 0;
    }

    novoHistorico[index] = { ...novoHistorico[index], [fieldName]: finalValue };
    setHistorico(novoHistorico);
  };

  const handleAddServico = () => {
    setHistorico([...historico, getNovoServico()]);
  };

  const handleRemoveServico = (index) => {
    const novoHistorico = historico.filter((_, i) => i !== index);
    setHistorico(novoHistorico);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosCompletos = {
      nome: clienteData.nome,
      cpf: clienteData.cpf,
      email: clienteData.email,
      telefone: clienteData.contato.replace(/\D/g, ""),
      status: clienteData.status,

      enderecos: [
        {
          rua: clienteData.rua,
          complemento: clienteData.complemento || "",
          cep: clienteData.cep,
          cidade: clienteData.cidade,
          bairro: clienteData.bairro,
          uf: clienteData.uf,
          pais: "Brasil",
        },
      ],

    };
    onSubmit(dadosCompletos);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setClienteData(getClienteInicial());
      setHistorico([]);
    }, 300);
  };

  const opcoesPagamento = FORMAS_PAGAMENTO_OPTIONS;

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader>
        <div className="flex items-center gap-1.5">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex items-center justify-center">
            <User size={24} />
          </div>
          <ModalTitle>
            {modoEdicao ? "Editar Cliente" : "Adicionar novo cliente"}
          </ModalTitle>
        </div>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="p-3 bg-gray-50">
          <Stack spacing={3}>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <Stack spacing={3}>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    required
                    label="Nome do cliente"
                    name="nome"
                    placeholder="Ex: Tiago Mendes" 
                    value={clienteData.nome}
                    onChange={handleChange}
                    icon={<User size={18} />}
                  />
                  
                  <Input
                    required
                    label="CPF"
                    name="cpf"
                    placeholder="Ex: 123.456.789-00"
                    value={clienteData.cpf || ""}
                    onChange={(e) => {
                      const masked = cpfMask(e.target.value);
                      handleChange({ target: { name: 'cpf', value: masked } });
                    }}
                  />

                  <MaskedInput
                    required
                    label="Telefone"
                    name="contato"
                    mask="(00) 00000-0000"
                    placeholder="(11) 91234-5678"
                    value={clienteData.contato}
                    onChange={handleChange}
                    icon={<Phone size={18} />}
                  />

                  <Input
                  required
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Ex: tiago.mendes@email.com" 
                  value={clienteData.email}
                  onChange={handleChange}
                  icon={<Mail size={18} />}
                />

                </div>

                <Input
                  label="Endereço"
                  name="endereco"
                  placeholder="Ex: Rua das Flores, 123" 
                  value={clienteData.endereco}
                  onChange={handleChange}
                  icon={<Home size={18} />}
                />

                <div className="grid grid-cols-[2fr_1fr] gap-2">
                  <Input
                    label="Cidade"
                    name="cidade"
                    placeholder="Ex: São Paulo"
                    value={clienteData.cidade}
                    onChange={handleChange}
                    icon={<Building2 size={18} />}
                  />
                  
                  <Input
                    required
                    label="CEP"
                    name="cep"
                    placeholder="Ex: 80035010"
                    value={clienteData.cep || ""}
                    onChange={handleChange}
                  />

                  <Input
                    label="UF"
                    name="uf"
                    placeholder="Ex: SP" 
                    value={clienteData.uf}
                    onChange={handleChange}
                    icon={<Map size={18} />}
                  />

                  <Input
                    required
                    label="Rua"
                    name="rua"
                    placeholder="Ex: Rua das Flores"
                    value={clienteData.rua || ""}
                    onChange={handleChange}
                  />

                  <Input
                    label="Complemento"
                    name="complemento"
                    placeholder="Ex: Bloco B, apto 13"
                    value={clienteData.complemento || ""}
                    onChange={handleChange}
                  />

                  <Input
                    required
                    label="Bairro"
                    name="bairro"
                    placeholder="Ex: Centro"
                    value={clienteData.bairro || ""}
                    onChange={handleChange}
                  />  

                </div>

                <FormControlLabel
                  control={<Switch checked={clienteData.status === "Ativo"} onChange={handleSwitchChange} color="primary" />}
                  label="Possui serviço em andamento (Status: Ativo)"
                />
              </Stack>
            </div>

            {clienteData.status !== "Ativo" && (
              <div>
                <Typography variant="h6" className="mb-2">
                  Histórico de serviços prestados
                </Typography>

                <Stack spacing={3}>
                  {historico.map((hist, index) => (
                    <div
                      key={hist.id || index}
                      className="bg-white p-3 rounded-lg border border-gray-200 relative"
                    >
                      <IconButton
                        aria-label="Deletar serviço"
                        onClick={() => handleRemoveServico(index)}
                        color="error"
                        className="absolute top-2 right-2"
                      >
                        <Trash2 size={20} />
                      </IconButton>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Input
                            label={`Serviço ${index + 1}`}
                            value={hist.servico || ""}
                            onChange={(e) =>
                              handleHistoricoChange(index, "servico", e.target.value)
                            }
                            icon={<Settings size={18} />}
                          />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Input
                            label="Valor"
                            type="number"
                            value={hist.valor || ""}
                            onChange={(e) =>
                              handleHistoricoChange(index, "valor", e.target.value)
                            }
                            icon={<DollarSign size={18} />}
                          />
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Input
                            label="Desconto (%)"
                            type="number"
                            value={hist.desconto || ""}
                            onChange={(e) =>
                              handleHistoricoChange(index, "desconto", e.target.value)
                            }
                            icon={<Percent size={18} />}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Input
                            select 
                            label="Forma de Pagamento"
                            value={hist.formaPagamento || "N/A"}
                            onChange={(e) =>
                              handleHistoricoChange(
                                index,
                                "formaPagamento",
                                e.target.value
                              )
                            }
                            icon={<CreditCard size={18} />}
                          >
                            {opcoesPagamento.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Input>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Input
                            label="Data Orçamento"
                            type="date"
                            value={hist.dataOrcamento || ""}
                            onChange={(e) =>
                              handleHistoricoChange(
                                index,
                                "dataOrcamento",
                                e.target.value
                              )
                            }
                            icon={<Calendar size={18} />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Input
                            label="Data Serviço"
                            type="date"
                            value={hist.dataServico || ""}
                            onChange={(e) =>
                              handleHistoricoChange(
                                index,
                                "dataServico",
                                e.target.value
                              )
                            }
                            icon={<Calendar size={18} />}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Input
                            select 
                            label="Funcionário"
                            value={hist.funcionario || "N/A"}
                            onChange={(e) =>
                              handleHistoricoChange(
                                index,
                                "funcionario",
                                e.target.value
                              )
                            }
                            icon={<BadgeCheck size={18} />}
                          >
                            <MenuItem value="N/A">N/A</MenuItem>
                            {funcionarios.map((func) => (
                              <MenuItem key={func.id} value={func.nome}>
                                {func.nome}
                              </MenuItem>
                            ))}
                          </Input>
                        </Grid>
                      </Grid>
                    </div>
                  ))}

                  <div>
                    <Button
                      startIcon={<Plus size={18} />}
                      onClick={handleAddServico}
                      variant="outline"
                      size="md"
                    >
                      Adicionar Serviço
                    </Button>
                  </div>
                </Stack>
              </div>
            )}
            
          </Stack>
        </ModalBody>

        <ModalFooter className="p-2 justify-between bg-white">
          <Button onClick={handleClose} variant="outline">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="bg-[#007EA7]">
            {modoEdicao ? "Salvar Alterações" : "Criar Cliente"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}