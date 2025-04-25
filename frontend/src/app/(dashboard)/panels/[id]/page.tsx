'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Panel } from '../create/page';

const PanelEditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => setUnwrappedParams(resolvedParams));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;
    const savedPanels = localStorage.getItem('panels');
    if (savedPanels) {
      const panels = JSON.parse(savedPanels);
      const currentPanel = panels.find((p: Panel) => p.id === unwrappedParams.id);
      setPanel(currentPanel);
    }
  }, [unwrappedParams]);

  const handleSave = () => {
    if (!panel) return;
    const savedPanels = localStorage.getItem('panels');
    if (savedPanels) {
      const panels = JSON.parse(savedPanels);
      const updatedPanels = panels.map((p: Panel) => (p.id === panel.id ? panel : p));
      localStorage.setItem('panels', JSON.stringify(updatedPanels));
      router.push('/panels');
    }
  };

  if (!panel) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Редактировать панель</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Название панели"
              value={panel.name}
              onChange={(e) => setPanel({ ...panel, name: e.target.value })}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="IP адрес"
              value={panel.ipAddress}
              onChange={(e) => setPanel({ ...panel, ipAddress: e.target.value })}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Порт"
              value={panel.port}
              onChange={(e) => setPanel({ ...panel, port: e.target.value })}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Логин"
              value={panel.login}
              onChange={(e) => setPanel({ ...panel, login: e.target.value })}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Пароль"
              value={panel.password}
              onChange={(e) => setPanel({ ...panel, password: e.target.value })}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Сохранить
            </button>
          </div>
        </form>

        <div className="mt-8">
          <button
            onClick={() => router.push(`/panels/${panel.id}/relays`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Перейти к реле
          </button>
        </div>
      </main>
    </div>
  );
};

export default PanelEditPage;