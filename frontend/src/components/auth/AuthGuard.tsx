"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLazyGetCurrentUserQuery } from "@/services/authService/authApi";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/store/slice/userSlice";
import { Button } from "@/components/ui/button";

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
  const [userChecked, setUserChecked] = useState(false);
  const [getCurrentUser, { isError: isUserError }] = useLazyGetCurrentUserQuery();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && requireAuth) {
        router.push("/login");
        setIsChecking(false);
        return;
      }

      if (isAuthenticated && pathname === "/login") {
        router.push("/");
        setIsChecking(false);
        return;
      }

      if (isAuthenticated && requireAuth && !userChecked) {
        try {
          const userData = await getCurrentUser().unwrap();
          dispatch(setUser(userData));
          setUserChecked(true);
          
          if (roles.length > 0 && !roles.includes(userData.role)) {
            setAccessDenied(true);
          }
        } catch (error) {
          console.error("Ошибка получения данных пользователя:", error);
          dispatch(logout());
          router.push("/login");
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, requireAuth, pathname, router, token, dispatch, roles, getCurrentUser, userChecked]);

  useEffect(() => {
    return () => {
      setUserChecked(false);
    };
  }, [pathname]);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
        <p className="mb-4">У вас нет прав для просмотра этой страницы.</p>
        <Button onClick={() => router.push("/")}>На главную</Button>
      </div>
    );
  }

  return <>{children}</>;
} 