"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { logout } from "@/store/slice/userSlice";
import { Button } from "@/components/ui/button";

export default function ProfileButton() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Закрыть меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
        Войти
      </Button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-2 touch-manipulation"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="hidden sm:inline">{user.email}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 z-10 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2 font-semibold text-sm border-b border-gray-200 dark:border-gray-700">
            Мой аккаунт
          </div>
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.email}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role === "ADMIN" ? "Администратор" : "Клиент"}
              </span>
            </div>
          </div>
          <button 
            className="w-full text-left p-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer touch-manipulation"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
} 