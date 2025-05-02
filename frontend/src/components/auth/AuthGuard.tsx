"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLazyGetCurrentUserQuery } from "@/services/authApi";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/store/slice/userSlice";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
  roles?: string[];
};

export default function AuthGuard({ 
  children, 
  requireAuth = true,
  roles = [] 
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.user);
  const [isChecking, setIsChecking] = useState(true);
  // Оставляем для совместимости, но не будем использовать
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    const checkAuth = async () => {
      // Если пользователь не аутентифицирован и требуется авторизация
      if (!isAuthenticated && requireAuth) {
        router.push("/login");
        setIsChecking(false);
        return;
      }

      // Если пользователь аутентифицирован, но находится на странице логина
      if (isAuthenticated && pathname === "/login") {
        router.push("/");
        setIsChecking(false);
        return;
      }

      // Примечание: Мы отключили запрос /users/me, так как он не реализован на сервере
      // Права доступа будут проверяться по данным из сохраненного состояния
      
      // Проверка прав доступа
      if (isAuthenticated && roles.length > 0 && user) {
        if (!roles.includes(user.role)) {
          // Пользователь не имеет необходимой роли
          router.push("/");
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, requireAuth, pathname, router, token, user, dispatch, roles]);

  // Пока проверяем авторизацию, показываем заглушку загрузки
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Проверка пройдена, показываем содержимое
  return <>{children}</>;
} 