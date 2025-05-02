"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateClientMutation, CreateClientRequest } from "@/services/clientsApi";
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
      number: yup.string().required("Номер телефона обязателен"),
    })
  ).required().min(1, "Добавьте хотя бы один номер телефона"),
});

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phones: { number: string }[];
};

export default function NewClientPage() {
  const router = useRouter();
  const [createClient, { isLoading }] = useCreateClientMutation();
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
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

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      
      // Преобразуем данные в формат, ожидаемый API
      const clientData: CreateClientRequest = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.company,
        phones: data.phones.map(p => p.number),
      };
      
      await createClient(clientData).unwrap();
      router.push("/clients");
    } catch (err) {
      setError("Ошибка при создании клиента");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Новый клиент</h1>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить клиента"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 