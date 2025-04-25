'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Panel } from '../../create/page';

const RelaysPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [relays, setRelays] = useState<Panel['relays'] | null>(null);
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
      if (currentPanel) {
        setRelays(currentPanel.relays);
      }
    }
  }, [unwrappedParams]);

  const handleRelayChange = (index: number, field: string, value: string) => {
    if (!relays) return;
    const updatedRelays = [...relays];
    updatedRelays[index] = { ...updatedRelays[index], [field]: value };
    setRelays(updatedRelays);
  };

  const handleDeleteRelay = (index: number) => {
    if (!relays) return;
    const updatedRelays = relays.filter((_, i) => i !== index);
    setRelays(updatedRelays);
  };

  const handleSave = () => {
    if (!unwrappedParams || !relays) return;
    const savedPanels = localStorage.getItem('panels');
    if (savedPanels) {
      const panels = JSON.parse(savedPanels);
      const updatedPanels = panels.map((panel: Panel) =>
        panel.id === unwrappedParams.id ? { ...panel, relays } : panel
      );
      localStorage.setItem('panels', JSON.stringify(updatedPanels));
    }
  };

  if (!relays) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Реле панели</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Номер</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {relays.map((relay, index) => (
              <tr key={relay.id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={relay.name}
                    onChange={(e) => handleRelayChange(index, 'name', e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={relay.type}
                    onChange={(e) => handleRelayChange(index, 'type', e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="CELL">Ячейка</option>
                    <option value="LIGHT">Свет</option>
                    <option value="GATE">Ворота</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteRelay(index)}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Сохранить изменения
          </button>
          <button
            onClick={() => router.push(`/panels/${unwrappedParams?.id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Назад к панели
          </button>
        </div>
      </main>
    </div>
  );
};

export default RelaysPage;
