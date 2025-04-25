'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; short_name: string }) => void;
}

const CreateCityModal: React.FC<CreateCityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [shortName, setShortName] = useState('');
  const [errors, setErrors] = useState({ title: '', shortName: '' });

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: '', shortName: '' };

    if (!title.trim()) {
      newErrors.title = 'Название города обязательно';
      valid = false;
    }

    if (!shortName.trim()) {
      newErrors.shortName = 'Короткое имя обязательно';
      valid = false;
    } else if (shortName.length > 5) {
      newErrors.shortName = 'Короткое имя не должно превышать 5 символов';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ title, short_name: shortName.toUpperCase() });
      setTitle('');
      setShortName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Добавить город</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название города
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Например: Москва"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Короткое имя (City ID)
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Например: MSK"
            />
            {errors.shortName && <p className="mt-1 text-sm text-red-500">{errors.shortName}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCityModal; 