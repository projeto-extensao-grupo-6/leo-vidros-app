import * as React from 'react';
import { Modal } from './Modal';
import { Typography, Box } from '../Utilities/Utilities';
import Button from '../buttons/button.component';

export default function ApprovalPendingModal({ open, onClose }) {

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="approval-modal-title"
      aria-describedby="approval-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={(theme) => ({
          position: 'relative',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: theme.shadows[5],
          p: 4,
          textAlign: 'center',
        })}
      >
        <Typography id="approval-modal-title" variant="h6" component="h2" fontWeight="bold">
          Cadastro enviado!
        </Typography>

        <Typography id="approval-modal-description" sx={{ mt: 2 }}>
          Seu cadastro foi realizado com sucesso.  
          Agora aguarde a aprovação do administrador para acessar o sistema.
        </Typography>

        <Button 
          onClick={onClose} 
          variant="primary"
          size="md"
          className="mt-3"
        >
          Fechar
        </Button>
      </Box>
    </Modal>
  );
}
