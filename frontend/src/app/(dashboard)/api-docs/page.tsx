'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { useGetSwaggerJsonQuery } from '@/services/swaggerService/swaggerApi';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect, useState } from 'react';

// Динамический импорт SwaggerUI
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <Loader2 className="h-10 w-10 animate-spin text-primary" />
});

// Компонент-обертка для подавления предупреждений о устаревших методах жизненного цикла
const SwaggerWrapper = ({ spec }: { spec: any }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Этот код выполняется только на клиенте
    // Временно подавляем предупреждения в консоли для Swagger UI
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      if (
        message.includes('UNSAFE_') ||
        message.includes('componentWillReceiveProps') ||
        message.includes('componentWillUpdate')
      ) {
        return;
      }
      originalError(...args);
    };

    setIsClient(true);

    return () => {
      // Восстанавливаем оригинальный console.error при размонтировании
      console.error = originalError;
    };
  }, []);

  if (!isClient) {
    return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
  }

  return <SwaggerUI spec={spec} docExpansion="list" deepLinking={true} />;
};

export default function ApiDocsPage() {
  const { data: swaggerData, isLoading, error } = useGetSwaggerJsonQuery();

  if (isLoading) {
    return <Loader2 className="h-10 w-10 animate-spin text-primary" />;
  }

  if (error) {
    return <div className="text-red-600">Ошибка загрузки API документации</div>;
  }

  return (
    <div className="">
      <SwaggerWrapper spec={swaggerData} />
    </div>
  );
} 