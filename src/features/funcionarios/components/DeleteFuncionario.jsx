import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from "../../../shared/components/ui/Modal/Modal";
import { Typography } from "../../../shared/components/ui/Utilities/Utilities";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/buttons/button.component";

export default function DeleteFuncionario({ open, setOpen, funcionario, deletarFuncionario }) {
  const [confirmNome, setConfirmNome] = useState("");

  useEffect(() => {
    setConfirmNome("");
  }, [open]);

  const handleDelete = () => {
    if (funcionario && confirmNome === funcionario.nome) {
      deletarFuncionario();
      setOpen(false);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} size="md">
      <ModalHeader>
        <ModalTitle>Confirmar Exclusão</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Typography className="mb-4">Deseja realmente excluir este funcionário?</Typography>
        {funcionario && <Typography className="mb-2">Nome: {funcionario.nome}</Typography>}
        <Input
          label="Digite o nome completo para confirmar"
          value={confirmNome}
          onChange={(e) => setConfirmNome(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setOpen(false)} variant="ghost">Cancelar</Button>
        <Button onClick={handleDelete} variant="danger">
          Excluir
        </Button>
      </ModalFooter>
    </Modal>
  );
}
