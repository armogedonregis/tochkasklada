'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };


  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Проверка для iOS
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    setIsIOS(isIos && !isStandalone);
  }, []);

  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Установить на iOS
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Нажмите на иконку "Поделиться"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Установить приложение
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Добавить на домашний экран для быстрого доступа
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Установить
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
