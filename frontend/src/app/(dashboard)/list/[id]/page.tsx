'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetListQuery, useCloseListMutation, useDeleteListMutation } from '@/services/listService/listApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArrowLeft, FileText, User, Mail, Phone, MessageSquare, Calendar, AlertTriangle, X, Trash2, MapPin } from 'lucide-react';
import { ToastService } from '@/components/toast/ToastService';

const ListDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [actionComment, setActionComment] = useState<string>('');

  const { data: listItem, error: listError, isLoading: isListLoading } = useGetListQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [closeList, { isLoading: isClosing }] = useCloseListMutation();
  const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '–';
    try {
      return format(parseISO(dateString), 'd MMMM yyyy г., HH:mm', { locale: ru });
    } catch {
      return 'Неверная дата';
    }
  };

  const handleCloseList = async () => {
    if (!actionComment.trim()) {
      ToastService.error('Укажите комментарий для закрытия');
      return;
    }
    
    try {
      await closeList({
        id,
        data: { comment: actionComment }
      }).unwrap();
      
      ToastService.success('Запись в листе ожидания успешно закрыта');
      router.push('/list');
    } catch (error) {
      ToastService.error('Ошибка при закрытии записи');
    }
  };

  const handleDeleteList = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.')) {
      return;
    }

    try {
      await deleteList(id).unwrap();
      ToastService.success('Запись успешно удалена');
      router.push('/list');
    } catch (error) {
      ToastService.error('Ошибка при удалении записи');
    }
  };

  if (isListLoading) {
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

  if (listError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Не удалось загрузить данные записи. Попробуйте обновить страницу.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!listItem) {
    return (
      <div className="p-6 text-center text-gray-500">
        Запись не найдена.
      </div>
    );
  }

  const isOpen = !listItem.closedAt;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteList}
            disabled={isDeleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </Button>
        </div>
      </header>

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card: List Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Информация о записи
              </CardTitle>
              <CardDescription>ID: {listItem.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Статус:</span>
                <Badge variant={isOpen ? 'default' : 'secondary'}>
                  {isOpen ? 'Ожидает' : 'Закрыта'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">ФИО:</span>
                <strong className="text-right flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {listItem.name}
                </strong>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Email:</span>
                <strong className="text-right flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {listItem.email}
                </strong>
              </div>
              
              {listItem.phone && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Телефон:</span>
                  <strong className="text-right flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {listItem.phone}
                  </strong>
                </div>
              )}
              
              {listItem.location && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Локация:</span>
                  <strong className="text-right flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {listItem.location.name} ({listItem.location.short_name})
                  </strong>
                </div>
              )}

              {listItem.size && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Размер:</span>
                  <strong className="text-right flex items-center gap-2">
                    {listItem.size.name} ({listItem.size.short_name})
                  </strong>
                </div>
              )}
              
              {listItem.description && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Описание:</span>
                  <strong className="text-right flex items-start gap-2 max-w-[60%] break-words">
                    <FileText className="h-4 w-4 mt-0.5" />
                    {listItem.description}
                  </strong>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Дата создания:</span>
                <strong className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(listItem.createdAt)}
                </strong>
              </div>
              
              {listItem.closedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Дата закрытия:</span>
                  <strong>{formatDate(listItem.closedAt)}</strong>
                </div>
              )}
              
              {listItem.closedBy && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Закрыл:</span>
                  <strong>{listItem.closedBy.email}</strong>
                </div>
              )}
              
              {listItem.comment && (
                <div>
                  <span className="text-muted-foreground">Комментарий:</span>
                  <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    {listItem.comment}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Actions */}
          {isOpen && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Действия с записью</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Закрыть запись
                  </Label>
                  
                  <div>
                    <Label htmlFor="close-comment">Причина закрытия *</Label>
                    <Textarea
                      id="close-comment"
                      placeholder="Укажите причину закрытия (обязательно)..."
                      value={actionComment}
                      onChange={(e) => setActionComment(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCloseList}
                    disabled={!actionComment.trim() || isClosing}
                    className="w-full gap-2"
                  >
                    <X className="h-4 w-4" />
                    {isClosing ? 'Закрываю...' : 'Закрыть запись'}
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Рекомендации</AlertTitle>
                    <AlertDescription>
                      Закрывайте запись когда клиент получил ячейку в данной локации или больше не заинтересован в аренде.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Дополнительная информация</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Эта запись в листе ожидания была создана {listItem.location ? `для локации "${listItem.location.name}"` : 'без указания локации'}.
              {isOpen ? ' Когда найдется подходящая ячейка, вы можете связаться с клиентом и закрыть эту запись.' : ' Запись закрыта и больше не требует обработки.'}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ListDetailsPage;
