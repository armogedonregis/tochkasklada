'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Relay = {
  id: string;
  name: string;
  type: string;
  user: string | null;
};

export interface Panel {
  id: string;
  name: string;
  ipAddress: string;
  port: string;
  login: string;
  password: string;
  relays: Relay[];
}

const validateIPAddress = (ip: string) => {
  const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipPattern.test(ip);
};

const validatePort = (port: string) => {
  const portNumber = parseInt(port, 10);
  return portNumber >= 1 && portNumber <= 65535;
};

const CreatePanelPage = () => {
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [panels, setPanels] = useState<Panel[]>(() => {
    const savedPanels = localStorage.getItem('panels');
    return savedPanels ? JSON.parse(savedPanels) : [];
  });
  const router = useRouter();

  const addPanel = () => {
    if (!validateIPAddress(ipAddress)) {
      alert('Неверный формат IP-адреса.');
      return;
    }
    if (!validatePort(port)) {
      alert('Порт должен быть в диапазоне от 1 до 65535.');
      return;
    }
    const newPanel = {
      id: Date.now().toString(),
      name,
      ipAddress,
      port,
      login,
      password,
      relays: Array.from({ length: 16 }, (_, index) => ({
        id: (index + 1).toString(),
        name: `Реле ${index + 1}`,
        type: index === 15 ? 'GATE' : 'LIGHT',
        user: null,
      })),
    };
    const updatedPanels = [...panels, newPanel];
    setPanels(updatedPanels);
    localStorage.setItem('panels', JSON.stringify(updatedPanels));
    setName('');
    setIpAddress('');
    setPort('');
    setLogin('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Добавить новую панель</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Название панели"
              title="Введите название панели"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="IP адрес"
              title="Введите корректный IP адрес, например, 192.168.1.1"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="number"
              placeholder="Порт"
              title="Введите порт в диапазоне от 1 до 65535"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Логин"
              title="Введите логин для доступа"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Пароль"
              title="Введите пароль для доступа"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={addPanel}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Добавить панель
              </button>
              <button
                type="button"
                onClick={() => router.push('/panels')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Список панелей</h2>
          <ul>
            {panels.map((panel) => (
              <li key={panel.id} className="bg-white shadow overflow-hidden sm:rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900">{panel.name}</h3>
                <p className="text-sm text-gray-500">IP: {panel.ipAddress}, Порт: {panel.port}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CreatePanelPage;
