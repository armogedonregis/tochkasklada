'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetCellRentalQuery, useExtendCellRentalMutation, useCloseCellRentalMutation, useUpdateRentalStatusMutation } from '@/services/cellRentalsService/cellRentalsApi';
import { useGetCellStatusesQuery } from '@/services/cellStatusesService/cellStatusesApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormModal } from '@/hooks/useFormModal';
import { BaseFormModal } from '@/components/modals/BaseFormModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeft, Calendar, User, Phone, Mail, Box, Tag, FileText, XCircle, Power, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';
import { Payment } from '@/services/paymentsService/payments.types';
import { CellRentalStatus } from '@/services/cellRentalsService/cellRentals.types';

// Схема валидации для формы продления
const extendRentalSchema = yup.object({
  rentalDuration: yup.number().required('Срок аренды обязателен').min(1, 'Минимум 1 день'),
  amount: yup.number().required('Сумма обязательна').min(0, 'Сумма не может быть отрицательной'),
  description: yup.string().optional(),
});

// Схема валидации для формы изменения статуса
const updateStatusSchema = yup.object({
  rentalStatus: yup.string().required('Статус обязателен'),
});

type ExtendFormValues = yup.InferType<typeof extendRentalSchema>;
type UpdateStatusFormValues = yup.InferType<typeof updateStatusSchema>;

const CellRentalDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: rental, error, isLoading, refetch } = useGetCellRentalQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const { data: cellStatuses } = useGetCellStatusesQuery();

  const [extendRental, { isLoading: isExtending }] = useExtendCellRentalMutation();
  const [closeRental, { isLoading: isClosing }] = useCloseCellRentalMutation();
  const [updateRental, { isLoading: isUpdating }] = useUpdateRentalStatusMutation();

  const extendModal = useFormModal<ExtendFormValues>({
    onSubmit: async (values) => {
      try {
        await extendRental({ id, ...values }).unwrap();
        toast.success('Аренда успешно продлена!');
        refetch();
      } catch (err) {
        toast.error('Ошибка при продлении аренды.');
      }
    },
  });

  const statusModal = useFormModal<UpdateStatusFormValues>({
    onSubmit: async (values) => {
      try {
        await updateRental({ id, rentalStatus: values.rentalStatus as CellRentalStatus }).unwrap();
        toast.success('Статус аренды успешно обновлен!');
        refetch();
      } catch (err) {
        toast.error('Ошибка при обновлении статуса аренды.');
      }
    },
  });

  const handleCloseRental = async () => {
    if (window.confirm('Вы уверены, что хотите закрыть эту аренду? Это действие необратимо.')) {
      try {
        await closeRental(id).unwrap();
        toast.success('Аренда успешно закрыта!');
        refetch();
      } catch (err) {
        toast.error('Ошибка при закрытии аренды.');
      }
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '–';
    try {
      return format(parseISO(dateString), 'd MMMM yyyy г.', { locale: ru });
    } catch {
      return 'Неверная дата';
    }
  };

  const formatAmount = (amount: number) => new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-1" />
          <Skeleton className="h-64 col-span-2 md:col-span-1" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Не удалось загрузить данные об аренде. Попробуйте обновить страницу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="p-6 text-center text-gray-500">
        Аренда не найдена.
      </div>
    );
  }

  const daysLeft = differenceInDays(parseISO(rental.endDate), new Date());
  const client = rental.client;
  const cells = rental.cell || [];
  const mainCell = Array.isArray(cells) ? cells[0] : undefined;
  const location = mainCell?.container?.location;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={() => extendModal.openCreate()} className="gap-2" disabled={isExtending}>
            <DollarSign className="h-4 w-4" />
            {isExtending ? 'Продление...' : 'Продлить'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => statusModal.openCreate()} 
            className="gap-2" 
            disabled={isUpdating}
          >
            <RefreshCw className="h-4 w-4" />
            {isUpdating ? 'Обновление...' : 'Изменить статус'}
          </Button>
          <Button variant="destructive" onClick={handleCloseRental} className="gap-2" disabled={isClosing}>
            <Power className="h-4 w-4" />
            {isClosing ? 'Закрытие...' : 'Закрыть аренду'}
          </Button>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Card: Rental Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Информация об аренде
              </CardTitle>
              <CardDescription>ID: {rental.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Статус</span>
                <Badge style={{ backgroundColor: cellStatuses?.find(status => status.statusType === rental.rentalStatus)?.color || '#gray', color: 'white' }}>
                  {cellStatuses?.find(status => status.statusType === rental.rentalStatus)?.name || rental.rentalStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Начало аренды</span>
                <strong>{formatDate(rental.startDate)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Окончание аренды</span>
                <strong>{formatDate(rental.endDate)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Осталось дней</span>
                <strong className={daysLeft < 7 ? 'text-red-500' : ''}>
                  {rental.isActive ? `${daysLeft} д.` : '–'}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Продлений</span>
                <strong>{rental.extensionCount}</strong>
              </div>
            </CardContent>
          </Card>

          {/* Card: Client Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User />Клиент</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>{client?.name || 'Имя не указано'}</strong></p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {client?.user?.email || 'Email не указан'}
              </p>
              {client?.phones?.map(p => (
                <p key={p.id} className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {p.phone}
                </p>
              ))}
            </CardContent>
          </Card>

          {/* Card: Cell Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Box />Ячейка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>
                  {(Array.from(new Set(cells.map(c => c.container?.location?.name).filter(Boolean))).length === 1
                    ? (location?.name || 'Локация')
                    : 'Несколько локаций')}
                  {' '}
                  – {' '}
                  {cells.length === 0
                    ? 'Номер'
                    : (cells.length === 1 ? (cells[0].name || 'Номер') : `${cells.length} ячеек: ${cells.map(c => c.name).join(', ')}`)}
                </strong>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                Размер: {
                  cells.length === 0
                    ? '—'
                    : Array.from(new Set(
                        cells.map(c => c.size ? `${c.size.name} (${c.size.short_name})` : null).filter(Boolean)
                      )).join(', ')
                }
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Адрес: {
                  (Array.from(new Set(cells.map(c => c.container?.location?.address).filter(Boolean))).length === 1
                    ? (location?.address || 'Не указан')
                    : (cells.length > 1 ? 'Несколько адресов' : (location?.address || 'Не указан')))
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>История платежей</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Срок (дней)</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rental.payments && rental.payments.length > 0 ? (
                  rental.payments.map((payment: Payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>
                      <TableCell>{formatAmount(payment.amount)}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.rentalDuration || '–'}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status ? 'default' : 'destructive'}>
                          {payment.status ? 'Оплачен' : 'Ошибка'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Платежей по этой аренде не найдено.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Модальное окно продления */}
      <BaseFormModal
        isOpen={extendModal.isOpen}
        onClose={extendModal.closeModal}
        title="Продление аренды"
        onSubmit={extendModal.handleSubmit}
        validationSchema={extendRentalSchema}
        submitText="Продлить"
        fields={[
          {
            type: 'input',
            inputType: 'number',
            fieldName: 'rentalDuration',
            label: 'Срок продления (дней)',
            placeholder: '30',
          },
          {
            type: 'input',
            inputType: 'number',
            fieldName: 'amount',
            label: 'Сумма платежа (₽)',
            placeholder: '5000',
          },
          {
            type: 'input',
            fieldName: 'description',
            label: 'Описание платежа',
            placeholder: 'Продление аренды',
          },
        ]}
        defaultValues={{ rentalDuration: 30, amount: 0, description: '' }}
      />

      {/* Модальное окно изменения статуса */}
      <BaseFormModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.closeModal}
        title="Изменение статуса аренды"
        onSubmit={statusModal.handleSubmit}
        validationSchema={updateStatusSchema}
        submitText="Сохранить"
        fields={[
          {
            type: 'select',
            fieldName: 'rentalStatus',
            label: 'Статус',
            placeholder: 'Выберите статус',
            options: cellStatuses?.map(status => ({
              label: status.name,
              value: status.statusType as string
            })) || []
          }
        ]}
        defaultValues={{ rentalStatus: rental?.rentalStatus || '' }}
      />
    </div>
  );
};

export default CellRentalDetailsPage; 