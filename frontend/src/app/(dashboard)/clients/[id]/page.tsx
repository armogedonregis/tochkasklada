'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetClientByIdQuery } from '@/services/clientsService/clientsApi';
import { useGetClientRentalsQuery } from '@/services/cellRentalsService/cellRentalsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeft, User, Phone, Mail, FileText, Box, Calendar, AlertTriangle, Banknote } from 'lucide-react';
import { CellRental, CellRentalStatus } from '@/services/cellRentalsService/cellRentals.types';
import { Payment } from '@/services/paymentsService/payments.types';
import { useGetCellStatusesQuery } from '@/services/cellStatusesService/cellStatusesApi';

const ClientDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: client, error: clientError, isLoading: isClientLoading } = useGetClientByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const { data: clientRentals, error: rentalsError, isLoading: isRentalsLoading } = useGetClientRentalsQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const { data: cellStatuses } = useGetCellStatusesQuery();

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

  const getStatusBadge = (rental: CellRental) => {
    return (
      <Badge style={{ backgroundColor: cellStatuses?.find(status => status.statusType === rental.rentalStatus)?.color || '#gray', color: 'white' }}>
        {cellStatuses?.find(status => status.statusType === rental.rentalStatus)?.name || rental.rentalStatus}
      </Badge>
    );
  };

  const calculateTotalSpent = () => {
    if (!clientRentals) return 0;
    return clientRentals.reduce((total, rental) => {
      const rentalPayments = rental.payments || [];
      return total + rentalPayments.reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);
  };

  const getAllPayments = () => {
    if (!clientRentals) return [];
    const allPayments: (Payment & { rentalInfo: { cellName: string; rentalId: string } })[] = [];

    clientRentals.forEach(rental => {
      if (rental.payments) {
        rental.payments.forEach(payment => {
          const cells = rental.cell || [];
          const cellName = cells.length === 0
            ? 'Неизвестная ячейка'
            : (cells.length === 1 ? (cells[0].name || '—') : cells.map(c => c.name).join(', '));
          allPayments.push({
            ...payment,
            rentalInfo: {
              cellName,
              rentalId: rental.id
            }
          });
        });
      }
    });

    return allPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  if (isClientLoading || isRentalsLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (clientError || rentalsError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Не удалось загрузить данные о клиенте. Попробуйте обновить страницу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 text-center text-gray-500">
        Клиент не найден.
      </div>
    );
  }

  const activeRentals = clientRentals?.filter(rental => rental.status?.statusType !== CellRentalStatus.CLOSED) || [];
  const totalSpent = calculateTotalSpent();
  const allPayments = getAllPayments();

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card: Client Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User />
                Информация о клиенте
              </CardTitle>
              <CardDescription>ID: {client.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">ФИО:</span>
                <strong className="text-right">{client.name}</strong>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Email:</span>
                <strong className="text-right flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {client.user?.email || 'Не указан'}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground">Телефоны:</span>
                <div className="mt-2 space-y-1">
                  {client.phones && client.phones.length > 0 ? (
                    client.phones.map((phone: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{phone.phone}</span>
                          {phone.comment && (
                            <span className="text-xs text-gray-500">{phone.comment}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">Телефоны не указаны</div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Дата регистрации:</span>
                <strong>{formatDate(client.createdAt)}</strong>
              </div>
            </CardContent>
          </Card>

          {/* Card: Statistics */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Активных аренд:</span>
                <strong className="text-green-600">{activeRentals.length}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Всего аренд:</span>
                <strong>{clientRentals?.length || 0}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Всего платежей:</span>
                <strong>{allPayments.length}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Общая сумма потрачено:</span>
                <strong className="text-blue-600 flex items-center gap-1">
                  <Banknote className="h-4 w-4" />
                  {formatAmount(totalSpent)}
                </strong>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Rentals */}
        {activeRentals.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Активные аренды</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="table-mobile-container">
                <Table className="table-mobile">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ячейка</TableHead>
                      <TableHead>Локация</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Начало</TableHead>
                      <TableHead>Окончание</TableHead>
                      <TableHead>Дней осталось</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRentals.map((rental) => {
                      const daysLeft = differenceInDays(parseISO(rental.endDate), new Date()) + 1;
                      const cells = rental.cell || [];
                      const cellName = cells.length === 0 ? '—' : (cells.length === 1 ? (cells[0].name || '—') : `${cells.length} ячеек`);
                      const locationName = (() => {
                        const locs = Array.from(new Set(cells.map(c => c.container?.location?.name).filter(Boolean)));
                        if (locs.length === 0) return '—';
                        if (locs.length === 1) return locs[0] as string;
                        return 'Несколько локаций';
                      })();
                      return (
                        <TableRow key={rental.id}>
                          <TableCell className="font-mono">{cellName}</TableCell>
                          <TableCell>{locationName}</TableCell>
                          <TableCell>{getStatusBadge(rental)}</TableCell>
                          <TableCell>{formatDate(rental.startDate)}</TableCell>
                          <TableCell>{formatDate(rental.endDate)}</TableCell>
                          <TableCell>
                            <span className={daysLeft < 7 ? 'text-red-500 font-semibold' : ''}>
                              {daysLeft} дн.
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/cell-rentals/${rental.id}`)}
                            >
                              Подробнее
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Rentals */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">История аренд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-mobile-container">
              <Table className="table-mobile">
                <TableHeader>
                  <TableRow>
                    <TableHead>Ячейка</TableHead>
                    <TableHead>Локация</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Период аренды</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {clientRentals && clientRentals.length > 0 && clientRentals.filter(rental => rental.status?.statusType === CellRentalStatus.CLOSED).length > 0 ? (
                    clientRentals.map((rental) => {
                      const duration = differenceInDays(parseISO(rental.endDate), parseISO(rental.startDate)) + 1;
                      const cells = rental.cell || [];
                      const cellName = cells.length === 0 ? '—' : (cells.length === 1 ? (cells[0].name || '—') : `${cells.length} ячеек`);
                      const locationName = (() => {
                        const locs = Array.from(new Set(cells.map(c => c.container?.location?.name).filter(Boolean)));
                        if (locs.length === 0) return '—';
                        if (locs.length === 1) return locs[0] as string;
                        return 'Несколько локаций';
                      })();
                      return (
                        <TableRow key={rental.id}>
                          <TableCell className="font-mono">{cellName}</TableCell>
                          <TableCell>{locationName}</TableCell>
                          <TableCell>{getStatusBadge(rental)}</TableCell>
                          <TableCell>
                            {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                          </TableCell>
                          <TableCell>{duration} дн.</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/cell-rentals/${rental.id}`)}
                            >
                              Подробнее
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        У клиента пока нет аренд.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* All Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">История платежей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-mobile-container">
              <Table className="table-mobile">
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Ячейка</TableHead>
                    <TableHead>Срок (дней)</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayments.length > 0 ? (
                    allPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                        <TableCell className="font-semibold">{formatAmount(payment.amount)}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell className="font-mono">{payment.rentalInfo.cellName}</TableCell>
                        <TableCell>{payment.rentalDuration || '–'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/cell-rentals/${payment.rentalInfo.rentalId}`)}
                          >
                            К аренде
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        У клиента пока нет платежей.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};

export default ClientDetailsPage; 