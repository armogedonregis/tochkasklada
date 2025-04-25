'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PanelsPage = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [panels, setPanels] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPanels = localStorage.getItem('panels');
      return savedPanels ? JSON.parse(savedPanels) : [];
    }
    return [];
  });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('panels', JSON.stringify(panels));
    }
  }, [panels]);

  const addPanel = () => {
    const newPanel = {
      id: Date.now().toString(),
      name: `Панель #${panels.length + 1}`,
      ipAddress: `192.168.1.${panels.length + 100}`,
      port: 8080 + panels.length,
      status: "Активна",
      relays: Array.from({ length: 16 }, (_, index) => ({
        name: `Реле ${index + 1}`,
        type: index === 15 ? 'GATE' : 'LIGHT',
      })),
    };
    setPanels([...panels, newPanel]);
  };

  const deletePanel = (id: string) => {
    setPanels(panels.filter((panel: any) => panel.id !== id));
  };

  return (
    <div className="py-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Панели управления
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/panels/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Добавить панель
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Переключить на {viewMode === 'cards' ? 'таблицу' : 'карточки'}
          </button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {panels.map((panel: any) => (
            <div
              key={panel.id}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/panels/${panel.id}`)}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{panel.name}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      panel.status === "Активна"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {panel.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">IP: {panel.ipAddress}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Порт: {panel.port}</p>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Реле:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {panel.relays.slice(0, 6).map((relay: any, index: number) => (
                      <button
                        key={index}
                        className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        {relay.name}
                      </button>
                    ))}
                    {panel.relays.length > 6 && (
                      <button className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
                        +{panel.relays.length - 6} ещё
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePanel(panel.id);
                  }}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Название
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  IP адрес
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Порт
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {panels.map((panel: any) => (
                <tr key={panel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {panel.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {panel.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {panel.port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        panel.status === "Активна"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {panel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/panels/${panel.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deletePanel(panel.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PanelsPage;