'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetRequestQuery, useMoveToListMutation, useCloseRequestMutation, useDeleteRequestMutation } from '@/services/requestsService/requestsApi';
import { useGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeft, FileText, User, Mail, Phone, MessageSquare, Calendar, AlertTriangle, MoveRight, X, Trash2 } from 'lucide-react';
import { RequestStatus } from '@/services/requestsService/requests.types';
import { ToastService } from '@/components/toast/ToastService';

const RequestDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [actionComment, setActionComment] = useState<string>('');

  const { data: request, error: requestError, isLoading: isRequestLoading } = useGetRequestQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const { data: locations } = useGetLocationsQuery();

  const [moveToList, { isLoading: isMoving }] = useMoveToListMutation();
  const [closeRequest, { isLoading: isClosing }] = useCloseRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '–';
    try {
      return format(parseISO(dateString), 'd MMMM yyyy г., HH:mm', { locale: ru });
    } catch {
      return 'Неверная дата';
    }
  };

  const handleMoveToList = async () => {
    if (!selectedLocationId) {
      ToastService.error('Выберите локацию для листа ожидания');
      return;
    }
    
    try {
      await moveToList({
        id,
        data: {
          locationId: selectedLocationId,
          comment: comment || 'Перенесено в лист ожидания'
        }
      }).unwrap();
      
      ToastService.success('Заявка успешно перенесена в лист ожидания');
      router.push('/requests');
    } catch (error) {
      ToastService.error('Ошибка при переносе в лист ожидания');
    }
  };

  const handleCloseRequest = async () => {
    try {
      await closeRequest({
        id,
        data: { comment: actionComment || 'Заявка закрыта администратором' }
      }).unwrap();
      
      ToastService.success('Заявка успешно закрыта');
      router.push('/requests');
    } catch (error) {
      ToastService.error('Ошибка при закрытии заявки');
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) {
      return;
    }

    try {
      await deleteRequest(id).unwrap();
      ToastService.success('Заявка успешно удалена');
      router.push('/requests');
    } catch (error) {
      ToastService.error('Ошибка при удалении заявки');
    }
  };

  if (isRequestLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (requestError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Не удалось загрузить данные о заявке. Попробуйте обновить страницу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 text-center text-gray-500">
        Заявка не найдена.
      </div>
    );
  }

  const isWaiting = request.status === RequestStatus.WAITING;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
        
        <div className="flex gap-2">
          {isWaiting && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteRequest}
                disabled={isDeleting}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Удалить
              </Button>
            </>
          )}
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card: Request Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Информация о заявке
              </CardTitle>
              <CardDescription>ID: {request.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Статус:</span>
                <Badge variant={request.status === RequestStatus.WAITING ? 'default' : 'secondary'}>
                  {request.status === RequestStatus.WAITING ? 'Ожидает' : 'Закрыта'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">ФИО:</span>
                <strong className="text-right flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {request.name}
                </strong>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Email:</span>
                <strong className="text-right flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {request.email}
                </strong>
              </div>
              
              {request.phone && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Телефон:</span>
                  <strong className="text-right flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {request.phone}
                  </strong>
                </div>
              )}
              
              {(request.sizeform || request.location) && (
                <div>
                  <span className="text-muted-foreground">Параметры:</span>
                  <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm space-y-1">
                    {request.sizeform && (
                      <div>
                        <span className="text-muted-foreground">Размер: </span>
                        <span>{request.sizeform}</span>
                      </div>
                    )}
                    {request.location && (
                      <div>
                        <span className="text-muted-foreground">Локация: </span>
                        <span>{request.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Дата создания:</span>
                <strong className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(request.createdAt)}
                </strong>
              </div>
              
              {request.closedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Дата закрытия:</span>
                  <strong>{formatDate(request.closedAt)}</strong>
                </div>
              )}
              
              {request.closedBy?.user && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Закрыл:</span>
                  <strong>{request.closedBy.user.email}</strong>
                </div>
              )}
              
              {request.comment && (
                <div>
                  <span className="text-muted-foreground">Комментарий:</span>
                  <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {request.comment}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Actions */}
          {isWaiting && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Действия с заявкой</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Move to List */}
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <MoveRight className="h-4 w-4" />
                    Перенести в лист ожидания
                  </Label>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="location-select">Выберите локацию</Label>
                      <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                        <SelectTrigger id="location-select">
                          <SelectValue placeholder="Выберите локацию" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations?.data?.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name} ({location.short_name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="move-comment">Комментарий</Label>
                      <Textarea
                        id="move-comment"
                        placeholder="Дополнительный комментарий..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleMoveToList}
                      disabled={!selectedLocationId || isMoving}
                      className="w-full gap-2"
                    >
                      <MoveRight className="h-4 w-4" />
                      {isMoving ? 'Переношу...' : 'Перенести в лист ожидания'}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Закрыть заявку
                    </Label>
                    
                    <div>
                      <Label htmlFor="close-comment">Причина закрытия</Label>
                      <Textarea
                        id="close-comment"
                        placeholder="Укажите причину закрытия..."
                        value={actionComment}
                        onChange={(e) => setActionComment(e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <Button 
                      variant="outline"
                      onClick={handleCloseRequest}
                      disabled={isClosing}
                      className="w-full gap-2"
                    >
                      <X className="h-4 w-4" />
                      {isClosing ? 'Закрываю...' : 'Закрыть заявку'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestDetailsPage;
