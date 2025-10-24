import React, { useState } from "react";
// Assumindo que Header e Sidebar estão em um local compartilhado
import Header from "../../shared/components/header/header"; 
import Sidebar from "../../shared/components/sidebar/sidebar";
import {
  Package,
  ArrowUp,
  Search,
  CalendarDays, 
  Filter, // Ícone do Filtro
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Importa seus componentes existentes
import NovoProdutoModal from '../../shared/components/modalEstoque/NovoProdutoModal'; 
import SucessoModal from '../../shared/components/modalEstoque/SucessoModal';
import ExportarModal from '../../shared/components/modalEstoque/ExportarModal'; 
import EstoqueItemRow from "../../shared/components/estoque/EstoqueItemRow";
import CalendarDropdown from '../../shared/components/estoque/CalendarDropdown'; 
import FilterDropdown from '../../shared/components/estoque/FilterDropdown'; 


// --- Componente Principal Estoque ---
export default function Estoque() {
  // ... (Estados e funções existentes) ...
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // ESTADOS DOS MODAIS
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openExportModal = () => setIsExportModalOpen(true);
  const closeExportModal = () => setIsExportModalOpen(false);
  
  const handleSaveSuccess = () => {
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => {
          setIsSuccessModalOpen(false);
      }, 3000); 
  };
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  // ESTADOS DO CALENDÁRIO
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedFilterDate, setSelectedFilterDate] = useState(null); 

  const handleDateFilterChange = (date) => {
    setSelectedFilterDate(date);
    if (date) {
        console.log("Filtrando a lista por data:", date.toLocaleDateString('pt-BR'));
    } else {
        console.log("Filtro de data removido.");
    }
    // Mantemos o calendário aberto para permitir a navegação de meses ou fechamos aqui.
    // setIsCalendarOpen(false); 
  };

  // NOVO: Estados para o Filtro
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Estado para armazenar os filtros ativos (ex: {situacao: ['Disponível', 'Abaixo do normal']})
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    console.log("Novos Filtros Ativos:", newFilters);
    // Aqui você adicionaria a lógica para filtrar a lista 'itensEstoque'
  };

  // Função auxiliar para verificar se há algum filtro ativo (para mudar a cor do botão)
  const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);

  // ... (Seus dados existentes - itensEstoque e kpiData) ...
  const itensEstoque = [
    // Seus dados de estoque... (mantidos por brevidade)
    { 
      nome: "Vidro", 
      descricao: "-", 
      preco: "R$ 8,50", 
      quantidade: 8, 
      situacao: "Disponível", 
      checked: false,
      detalhes: {
        espessura: "4 mm",
        unidadeMedida: "m²",
        tipoVidro: "Temperado",
        cor: "Incolor",
        aplicacao: "Janelas, portas, fachadas, box de banheiro, divisórias",
        acabamento: "Corte reto",
        valorCompra: "R$ 2,00",
        valorVenda: "R$ 8,50",
        movimentos: [
          {
            tipo: "Saída",
            data: "06/02/2025",
            unidade: "m²",
            quantidade: "4",
            observacao: "Porta de giro/Porta de vidro de correr/Manutenção de 2 vitrôs do quarto",
            funcionario: "Junior Silva"
          },
          {
            tipo: "Entrada",
            data: "05/02/2025",
            unidade: "m²",
            quantidade: "6",
            observacao: "-",
            funcionario: "Junior Silva"
          }
        ]
      }
    },
    { 
      nome: "Parafusadeira Canhão", 
      descricao: "Para parafusadeira com ímã", 
      preco: "R$ 26,50", 
      quantidade: 2, 
      situacao: "Abaixo do normal", 
      checked: false 
    },
    { 
      nome: "Protetor auditivo", 
      descricao: "-", 
      preco: "R$ 5,00", 
      quantidade: 10, 
      situacao: "Disponível", 
      checked: true 
    },
    { 
      nome: "Roldana mini preta", 
      descricao: "-", 
      preco: "R$ 3,00", 
      quantidade: 9, 
      situacao: "Disponível", 
      checked: false 
    },
    { 
      nome: "Tucano grande", 
      descricao: "Suporte de prateleira", 
      preco: "R$ 23,00", 
      quantidade: 2, 
      situacao: "Abaixo do normal", 
      checked: true 
    },
    { 
      nome: "Fecho para porta", 
      descricao: "Branco", 
      preco: "R$ 10,00", 
      quantidade: 1, 
      situacao: "Abaixo do normal", 
      checked: true 
    },
  ];

  const [selectedItems, setSelectedItems] = useState(itensEstoque.filter(item => item.checked).map(item => item.nome));

  const handleCheckboxChange = (nome) => {
    setSelectedItems(prev =>
      prev.includes(nome)
        ? prev.filter(item => item !== nome)
        : [...prev, nome]
    );
  };
    
  const kpiData = [
    { title: "Total de produtos em estoque", value: "0,00", caption: "+00% este mês", captionColor: 'green' },
    { title: "Itens com baixo estoque", value: "0,00", caption: "0 atualmente" },
    { title: "Produto em alta", value: "0,00", caption: "0 atualmente" },
    { title: "Itens fora de estoque", value: "0,00", caption: "0 atualmente" },
  ];


  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="pt-20 lg:pt-[80px]" /> 
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-[1800px] mx-auto">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpiData.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                            <div className="bg-[#003d6b] p-2 rounded">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            {stat.caption && (
                                <p className="mt-2 text-sm text-gray-600 flex items-center">
                                    {stat.captionColor === 'green' && <ArrowUp className="w-4 h-4 mr-1 text-green-500" />}
                                    {stat.caption}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabela de Estoque */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              
              {/* Barra de Ações e Pesquisa */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                
                {/* Botão Novo Item */}
                <button 
                    onClick={openModal} 
                    className="w-full md:w-auto bg-[#007EA7] text-white font-medium py-2.5 px-5 rounded-md hover:bg-[#006891] transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  Novo Item
                </button>

                {/* Container de Pesquisa e Filtros */}
                <div className="flex items-center gap-3 w-full justify-end">
                  
                  {/* Campo de Pesquisa com Filtro ativo */}
                  <div className="relative w-full max-w-lg"> 
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Busque Por..."
                            className="w-full pl-28 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#007EA7] focus:border-[#007EA7] text-sm"
                        />
                        {/* Filtro Vidro */}
                        <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                            <span className="flex items-center bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">
                                Vidro
                                <button className="ml-1.5 text-gray-600 hover:text-gray-900 font-bold">
                                    ×
                                </button>
                            </span>
                        </div>
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Botões de Filtro */}
                  <div className="flex gap-2 w-auto whitespace-nowrap">
                    
                    {/* Botão de Data com Dropdown do Calendário */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="flex items-center gap-2 border border-gray-300 py-2.5 px-4 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            <CalendarDays className="w-4 h-4" /> 
                            {selectedFilterDate ? selectedFilterDate.toLocaleDateString('pt-BR') : 'Data'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <CalendarDropdown 
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                            onDateSelect={handleDateFilterChange}
                        />
                    </div>

                    {/* Botão de Filtro com Dropdown de Filtros */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 border border-gray-300 py-2.5 px-4 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors ${hasActiveFilters ? 'border-[#003d6b] text-[#003d6b] bg-[#e6f0f5]' : ''}`}
                        >
                            <Filter className="w-4 h-4" /> 
                            Filtrar
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Chamada do componente FilterDropdown */}
                        <FilterDropdown 
                            isOpen={isFilterOpen}
                            onClose={() => setIsFilterOpen(false)}
                            selectedFilters={activeFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    
                    <button 
                      onClick={openExportModal}
                      className="flex items-center gap-2 border border-gray-300 py-2.5 px-4 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Exportar
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tabela */}
              <div className="overflow-x-auto">
                {/* Cabeçalho da Tabela */}
                <div className="flex items-center bg-gray-50 border-b border-gray-200 mb-2 min-h-[48px] rounded-t-md">
                    <div className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[5%] pl-4 pr-1">
                        <input type="checkbox" className="w-4 h-4 text-[#003d6b] border-gray-300 rounded focus:ring-[#003d6b]" />
                    </div>
                    <div className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%] pl-2 pr-1 flex items-center">Nome</div>
                    <div className="py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-[25%] px-4 flex items-center">Descrição</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[10%]">Preço</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">Quantidade em estoque</div>
                    <div className="py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%]">Situação</div>
                    <div className="py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider w-[15%] pr-4">Ações</div>
                </div>

                {/* Corpo da Tabela: Chama o componente EstoqueItemRow */}
                <div>
                    {itensEstoque.map((item, index) => (
                        <EstoqueItemRow
                            key={index}
                            item={item}
                            isSelected={selectedItems.includes(item.nome)}
                            onToggle={handleCheckboxChange}
                        />
                    ))}
                </div>
              </div>
              
              {/* Paginação */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-medium">1-6</span> de <span className="font-medium">10</span> resultados
                </p>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1 border border-gray-300 py-2 px-4 rounded-md text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>
                    <button className="flex items-center gap-1 bg-[#003d6b] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#002a4d] transition-colors">
                        Próximo <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      
      {/* Modais */}
      <NovoProdutoModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSaveSuccess={handleSaveSuccess}
      />
      
      <SucessoModal 
          isOpen={isSuccessModalOpen} 
          onClose={closeSuccessModal}
      />

      <ExportarModal 
          isOpen={isExportModalOpen} 
          onClose={closeExportModal}
      />

    </div>
  );
}