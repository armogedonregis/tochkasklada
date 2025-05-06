import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Panel } from '@/types/panel.types';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';

// Схема валидации
const panelValidationSchema = yup.object({
  name: yup.string().required('Название обязательно'),
  ipAddress: yup
    .string()
    .required('IP адрес обязателен')
    .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, 'Неверный формат IP адреса'),
  port: yup
    .number()
    .required('Порт обязателен')
    .min(1, 'Порт должен быть больше 0')
    .max(65535, 'Порт должен быть меньше 65536'),
  login: yup.string().required('Логин обязателен'),
  password: yup.string().required('Пароль обязателен'),
  isActive: yup.boolean().default(false).required(),
});

type PanelFormData = {
  name: string;
  ipAddress: string;
  port: number;
  login: string;
  password: string;
  isActive: boolean;
};

interface PanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PanelFormData) => Promise<void>;
  panel: Panel | null;
  title: string;
}

export function PanelModal({ isOpen, onClose, onSave, panel, title }: PanelModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PanelFormData>({
    resolver: yupResolver(panelValidationSchema),
    defaultValues: {
      name: '',
      ipAddress: '',
      port: 80,
      login: '',
      password: '',
      isActive: false,
    },
  });

  useEffect(() => {
    if (panel) {
      reset({
        name: panel.name,
        ipAddress: panel.ipAddress,
        port: panel.port,
        login: panel.login,
        password: panel.password,
        isActive: panel.isActive,
      });
    } else {
      reset({
        name: '',
        ipAddress: '',
        port: 80,
        login: '',
        password: '',
        isActive: false,
      });
    }
  }, [panel, reset]);

  const onSubmit = async (data: PanelFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving panel:', error);
      toast.error('Ошибка при сохранении панели');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Если модальное окно пытаются закрыть кликом за пределами (open становится false),
      // то предотвращаем закрытие, не вызывая onClose
      if (!open) {
        // Здесь мы ничего не делаем, чтобы предотвратить закрытие
      }
    }}>
      <DialogContent className="sm:max-w-[500px]" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="relative">
          <DialogTitle>{title}</DialogTitle>
          <button 
            onClick={onClose} 
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            type="button"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogDescription>
            Заполните информацию о панели управления
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Название
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Панель в Кудрово"
              className={`col-span-3 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.name.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ipAddress" className="text-right">
              IP адрес
            </Label>
            <div className="col-span-3">
              <Controller
                name="ipAddress"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    mask="000.000.000.000"
                    unmask={false}
                    radix="."
                    value={field.value}
                    onAccept={(value) => field.onChange(value)}
                    placeholder="192.168.1.1"
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.ipAddress ? 'border-red-500' : ''}`}
                  />
                )}
              />
              {errors.ipAddress && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.ipAddress.message}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="port" className="text-right">
              Порт
            </Label>
            <Input
              id="port"
              type="number"
              {...register('port', { valueAsNumber: true })}
              placeholder="80"
              className={`col-span-3 ${errors.port ? 'border-red-500' : ''}`}
            />
            {errors.port && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.port.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="login" className="text-right">
              Логин
            </Label>
            <Input
              id="login"
              {...register('login')}
              placeholder="admin"
              className={`col-span-3 ${errors.login ? 'border-red-500' : ''}`}
            />
            {errors.login && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.login.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className={`col-span-3 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <div className="col-span-3 col-start-2 text-red-500 text-xs mt-1">
                {errors.password.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right">
              <Label htmlFor="isActive">Активна</Label>
            </div>
            <div className="col-span-3 flex items-center">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 