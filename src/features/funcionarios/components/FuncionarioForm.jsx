import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  ModalTitle,
  Switch,
  FormControlLabel,
  Avatar,
  MenuItem,
  Input,
  MaskedInput,
  Button
} from "../../../components/ui";
import { User } from "lucide-react";
import { CONTRATO_TIPOS, CONTRATO_TIPOS_OPTIONS } from "../../../core/constants";

// Schema de validação simplificado para Funcionário
const funcionarioSchema = z.object({
  nome: z.string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  telefone: z.string()
    .min(1, "Telefone é obrigatório")
    .refine(val => val.replace(/\D/g, "").length >= 10, "Telefone inválido"),
  funcao: z.string().min(1, "Função é obrigatória"),
  escala: z.string().min(1, "Escala é obrigatória"),
  contrato: z.enum([CONTRATO_TIPOS.REGISTRADO, CONTRATO_TIPOS.FIXO, CONTRATO_TIPOS.TEMPORARIO]),
  status: z.boolean(),
});

export default function FuncionarioForm({ open, setOpen, modoEdicao, funcionario, salvarFuncionario }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      funcao: "",
      escala: "",
      contrato: CONTRATO_TIPOS.REGISTRADO,
      status: true,
    },
  });

  useEffect(() => {
    if (modoEdicao && funcionario) {
      reset({
        nome: funcionario.nome || "",
        telefone: funcionario.telefone || "",
        funcao: funcionario.funcao || "",
        escala: funcionario.escala || "",
        contrato: funcionario.contrato || CONTRATO_TIPOS.REGISTRADO,
        status: funcionario.status === "Ativo" || funcionario.status === true,
      });
    } else if (open && !modoEdicao) {
      reset({
        nome: "",
        telefone: "",
        funcao: "",
        escala: "",
        contrato: CONTRATO_TIPOS.REGISTRADO,
        status: true,
      });
    }
  }, [modoEdicao, funcionario, open, reset]);

  const onSubmit = (data) => {
    salvarFuncionario(data);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="sm">
      <ModalHeader>
        <div className="flex items-center gap-1">
          <Avatar className="bg-[#007EA7]">
            <User size={20} />
          </Avatar>
          <ModalTitle>{modoEdicao ? "Editar Funcionário" : "Novo Funcionário"}</ModalTitle>
        </div>
      </ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                label="Status do Contrato"
              />
            )}
          />

          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nome"
                placeholder="Ex: João Silva"
                error={errors.nome?.message}
              />
            )}
          />

          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <MaskedInput
                {...field}
                mask="(00) 00000-0000"
                label="Telefone"
                placeholder="(11) 12345-6789"
                error={errors.telefone?.message}
              />
            )}
          />

          <div className="flex gap-2">
            <Controller
              name="contrato"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  select
                  label="Tipo de contrato"
                  error={errors.contrato?.message}
                >
                  {CONTRATO_TIPOS_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Input>
              )}
            />

            <Controller
              name="funcao"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Função"
                  placeholder="Ex: Cozinheiro"
                  error={errors.funcao?.message}
                />
              )}
            />
          </div>

          <Controller
            name="escala"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Escala"
                placeholder="Ex: 6x1 - 08h00 às 17h00"
                error={errors.escala?.message}
              />
            )}
          />
        </form>
      </ModalBody>

      <ModalFooter>
        <Button onClick={handleSubmit(onSubmit)} variant="primary">
          {modoEdicao ? "Salvar Alterações" : "Salvar Funcionário"}
        </Button>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
}
