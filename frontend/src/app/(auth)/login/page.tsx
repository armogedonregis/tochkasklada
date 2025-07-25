"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginMutation } from "@/services/authService/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slice/userSlice";

// Схема валидации формы логина
const formSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(6, { message: "Минимум 6 символов" }),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log(process.env.API_URL)


  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      const result = await login(values).unwrap();
      
      // Сохраняем данные пользователя и токен в стор
      dispatch(
        setCredentials({
          user: result.user,
          token: result.access_token,
        })
      );
      
      // Перенаправляем в основное приложение
      router.push("/");
    } catch (error) {
      setError("Неверный email или пароль");
      console.error("Login failed:", error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Вход в систему</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input autoComplete="username" type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Пароль</FormLabel>
                <FormControl>
                  <Input autoComplete="current-password" type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage className="text-red-500 dark:text-red-400" />
              </FormItem>
            )}
          />
          
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">{error}</div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </Form>
    </div>
  );
} 