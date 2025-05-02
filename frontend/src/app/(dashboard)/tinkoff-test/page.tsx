'use client';

import { useState, ChangeEvent } from 'react';
import { 
  useGetAllPaymentsQuery, 
  useCreatePaymentMutation, 
  useGetPaymentByOrderIdQuery,
  useLazyGetPaymentLinkQuery
} from '@/services/paymentsApi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Loader2, 
  CreditCard, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const TinkoffTestPage = () => {
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [getPaymentLink, { isLoading: isLoadingLink }] = useLazyGetPaymentLinkQuery();
  const { data: payments = [], isLoading, refetch } = useGetAllPaymentsQuery();
  
  const [amount, setAmount] = useState('100');
  const [description, setDescription] = useState('Тестовый платеж');
  const [currentPayment, setCurrentPayment] = useState<{
    orderId: string;
    paymentUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
    }).format(amount / 100); // Конвертируем копейки в рубли
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('ru-RU')} (${formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: ru
    })})`;
  };

  // Обработчик создания тестового платежа
  const handleCreateTestPayment = async () => {
    if (!amount || parseFloat(amount) < 10) {
      toast.error('Сумма должна быть не менее 10 рублей');
      return;
    }

    try {
      const result = await createPayment({
        amount: parseFloat(amount),
        description: description || 'Тестовый платеж Тинькофф'
      }).unwrap();
      
      toast.success('Платеж создан успешно');
      
      // Получаем платежную ссылку
      if (result && result.orderId) {
        const linkResult = await getPaymentLink(result.orderId).unwrap();
        
        if (linkResult && linkResult.success && linkResult.url) {
          setCurrentPayment({
            orderId: result.orderId,
            paymentUrl: linkResult.url
          });
        } else {
          toast.error('Не удалось получить ссылку на оплату');
        }
      }
      
      refetch(); // Обновляем список платежей
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      toast.error('Не удалось создать платеж');
    }
  };

  // Копирование ссылки в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Открытие платежной ссылки в новой вкладке
  const openPaymentLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Отображение недавних платежей
  const recentPayments = payments
    .filter(p => p.description?.includes('Тестовый платеж Тинькофф'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Тестовые платежи Тинькофф</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Форма создания платежа */}
          <Card>
            <CardHeader>
              <CardTitle>Создать тестовый платеж</CardTitle>
              <CardDescription>
                Заполните форму для создания тестового платежа через Тинькофф
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма (в рублях)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="10"
                    value={amount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    placeholder="Введите сумму платежа"
                  />
                  <p className="text-xs text-gray-500">Минимальная сумма: 10 рублей</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder="Описание платежа"
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCreateTestPayment}
                  disabled={isCreating || isLoadingLink || !amount || parseFloat(amount) < 10}
                >
                  {(isCreating || isLoadingLink) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isCreating ? 'Создание платежа...' : 'Получение ссылки...'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Создать тестовый платеж
                    </>
                  )}
                </Button>
              </div>
              
              {/* Отображение ссылки на оплату */}
              {currentPayment && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-medium mb-2">Платеж создан</h3>
                  <p className="text-sm mb-2">ID заказа: <span className="font-mono">{currentPayment.orderId}</span></p>
                  
                  <div className="flex items-center mb-3 space-x-2">
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                      {currentPayment.paymentUrl}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(currentPayment.paymentUrl)}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openPaymentLink(currentPayment.paymentUrl)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button className="w-full" onClick={() => openPaymentLink(currentPayment.paymentUrl)}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Перейти к оплате
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Последние тестовые платежи */}
          <Card>
            <CardHeader>
              <CardTitle>Последние тестовые платежи</CardTitle>
              <CardDescription>
                Список недавно созданных тестовых платежей
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Загрузка платежей...</span>
                </div>
              ) : recentPayments.length > 0 ? (
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{formatAmount(payment.amount)}</span>
                        <Badge variant={payment.status ? "default" : "secondary"}>
                          {payment.status ? 'Оплачен' : 'Не оплачен'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{formatDate(payment.createdAt)}</div>
                      <div className="text-sm mb-2 truncate">{payment.description}</div>
                      
                      {payment.paymentUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => openPaymentLink(payment.paymentUrl!)}
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Открыть ссылку
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTitle>Нет тестовых платежей</AlertTitle>
                  <AlertDescription>
                    Создайте новый тестовый платеж с помощью формы слева
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Инструкция по тестированию */}
        <Card>
          <CardHeader>
            <CardTitle>Как тестировать платежи Тинькофф</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Для тестирования платежей Тинькофф вы можете использовать следующие тестовые карты:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Успешная оплата</h3>
                  <p className="font-mono text-sm">5100 0000 0000 0008</p>
                  <p className="text-xs text-gray-500 mt-2">
                    CVC: любые 3 цифры<br />
                    Срок действия: любая дата в будущем
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Ошибка оплаты</h3>
                  <p className="font-mono text-sm">4000 0000 0000 0002</p>
                  <p className="text-xs text-gray-500 mt-2">
                    CVC: любые 3 цифры<br />
                    Срок действия: любая дата в будущем
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">3D Secure</h3>
                  <p className="font-mono text-sm">4300 0000 0000 0777</p>
                  <p className="text-xs text-gray-500 mt-2">
                    CVC: любые 3 цифры<br />
                    Срок действия: любая дата в будущем<br />
                    Код подтверждения: любые 6 цифр
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TinkoffTestPage; 