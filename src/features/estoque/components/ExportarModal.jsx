import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import estoqueService from "../../../core/services/estoqueService";

const ExportarModal = ({ isOpen, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportar = async () => {
    try {
      setIsExporting(true);

      const result = await estoqueService.exportToExcel();

      if (!result.success) {
        throw new Error(result.error || "Erro ao exportar planilha");
      }

      const blob = new Blob([result.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const dataAtual = new Date().toISOString().split("T")[0];
      link.download = `estoque_${dataAtual}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      await Swal.fire({
        icon: "success",
        title: "Exportação concluída!",
        text: "A planilha foi baixada com sucesso.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao exportar planilha:", error);
      
      await Swal.fire({
        icon: "error",
        title: "Erro na exportação",
        text: error.message || "Não foi possível exportar a planilha. Tente novamente.",
        confirmButtonColor: "#007EA7",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto"
        onClick={handleModalContentClick}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded">
              <Download className="w-5 h-5 text-gray-700" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Exportar planilha
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-700">
            Você está prestes a exportar a visualização atual do estoque.
            Confirme para iniciar o download.
          </p>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleExportar}
            disabled={isExporting}
            className="px-4 py-2 bg-[#007EA7] text-white rounded-md hover:bg-[#006891] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar Planilha
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportarModal;