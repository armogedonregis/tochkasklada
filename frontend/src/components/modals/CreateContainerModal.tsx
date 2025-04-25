'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Location } from '@/services/locationsApi';
import { useAddContainerMutation } from '@/services/containersApi';
import { toast } from 'react-toastify';

interface CreateContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
}

const CreateContainerModal: React.FC<CreateContainerModalProps> = ({ isOpen, onClose, locations }) => {
  const [containerNumber, setContainerNumber] = useState('');
  const [locationId, setLocationId] = useState('');
  const [errors, setErrors] = useState({ containerId: '', locId: '' });
  const [addContainer, { isLoading, isSuccess, error }] = useAddContainerMutation();

  useEffect(() => {
    if (locations.length > 0 && !locationId) {
      setLocationId(locations[0].id);
    }
  }, [locations, locationId]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Контейнер успешно создан');
      resetForm();
      onClose();
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (error) {
      toast.error('Ошибка при создании контейнера');
    }
  }, [error]);

  const resetForm = () => {
    setContainerNumber('');
    setLocationId(locations.length > 0 ? locations[0].id : '');
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { containerId: '', locId: '' };

    if (!containerNumber.trim()) {
      newErrors.containerId = 'Введите номер контейнера';
      valid = false;
    } else if (!/^\d+$/.test(containerNumber)) {
      newErrors.containerId = 'Номер должен содержать только цифры';
      valid = false;
    }

    if (!locationId) {
      newErrors.locId = 'Выберите локацию';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addContainer({ 
        id: parseInt(containerNumber),
        locId: locationId,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Добавить контейнер</h2>
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
              Номер контейнера
            </label>
            <input
              type="text"
              value={containerNumber}
              onChange={(e) => setContainerNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Например: 1"
            />
            {errors.containerId && <p className="mt-1 text-sm text-red-500">{errors.containerId}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Локация
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.locId && <p className="mt-1 text-sm text-red-500">{errors.locId}</p>}
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
              disabled={isLoading}
            >
              {isLoading ? 'Создание...' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContainerModal; 