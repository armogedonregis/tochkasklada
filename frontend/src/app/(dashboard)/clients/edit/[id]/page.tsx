"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import * as yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  useGetClientByIdQuery, 
  useUpdateClientMutation,
  UpdateClientRequest
} from "@/services/clientsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Схема валидации
const clientSchema = yup.object({
  email: yup.string().email("Введите корректный email").required("Email обязателен"),
  firstName: yup.string().required("Имя обязательно"),
  lastName: yup.string().required("Фамилия обязательна"),
  company: yup.string().required("Название компании обязательно"),
  phones: yup.array().of(
    yup.object({
      id: yup.string(),
      number: yup.string().required("Номер телефона обязателен"),
    })
  ).required().min(1, "Добавьте хотя бы один номер телефона"),
});

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phones: { id?: string; number: string }[];
};

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  
  const { data: client, isLoading: isLoadingClient } = useGetClientByIdQuery(clientId);
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      phones: [{ number: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  // Заполняем форму данными клиента, когда они загружены
  useEffect(() => {
    if (client) {
      // Разделяем полное имя на firstName и lastName
      const nameParts = client.name ? client.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      reset({
        email: client.email,
        firstName: firstName,
        lastName: lastName,
        company: client.company,
        phones: client.phones && client.phones.length > 0 
          ? client.phones.map(phone => ({
              id: phone.id,
              number: phone.number,
            }))
          : [{ number: "" }],
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      
      // Преобразуем данные для API
      const updateData: UpdateClientRequest = {
        id: clientId,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.company,
        phones: data.phones.map(p => p.number),
      };
      
      await updateClient(updateData).unwrap();
      router.push("/clients");
    } catch (err) {
      setError("Ошибка при обновлении клиента");
      console.error(err);
    }
  };

  if (isLoadingClient) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Клиент не найден</h1>
        <Button onClick={() => router.push("/clients")}>Назад к списку</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Редактирование клиента</h1>
        <Button variant="outline" onClick={() => router.push("/clients")}>
          Назад к списку
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="firstName"
                    placeholder="Иван"
                    {...field}
                  />
                )}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="lastName"
                    placeholder="Иванов"
                    {...field}
                  />
                )}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    placeholder="ivan@example.com"
                    type="email"
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    id="company"
                    placeholder="ООО Рога и Копыта"
                    {...field}
                  />
                )}
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Телефоны</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ number: "" })}
              >
                Добавить телефон
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <Controller
                    name={`phones.${index}.number`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="+7 (XXX) XXX-XX-XX"
                        {...field}
                      />
                    )}
                  />
                  {errors.phones?.[index]?.number && (
                    <p className="text-red-500 text-sm">
                      {errors.phones[index]?.number?.message}
                    </p>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            ))}
            {errors.phones && !Array.isArray(errors.phones) && (
              <p className="text-red-500 text-sm">{errors.phones.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 