import React, { useState } from "react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

export default function Agendamentos() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <div className="h-[80px]" />
        <main className="flex-1 flex flex-col items-center px-4 md:px-8 pt-6 pb-10 gap-6">
          <div className="w-full max-w-[1380px] text-center">
            <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
            <p className="text-gray-500 text-lg">Visualize todos os funcionários de sua empresa</p>
          </div>
        </main>
      </div>
    </div>
  );
}
