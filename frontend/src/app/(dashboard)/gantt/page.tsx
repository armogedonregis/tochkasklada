'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useGetCellRentalsQuery } from '@/services/cellRentalsService/cellRentalsApi';
import { CellRental, CellRentalStatus } from '@/services/cellRentalsService/cellRentals.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Цвета для разных статусов аренды
const statusColors: Record<CellRentalStatus, { bg: string, progress: string }> = {
  [CellRentalStatus.ACTIVE]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  },
  [CellRentalStatus.EXPIRING_SOON]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  },
  [CellRentalStatus.EXPIRED]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  },
  [CellRentalStatus.CLOSED]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  },
  [CellRentalStatus.RESERVATION]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  },
  [CellRentalStatus.EXTENDED]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  },
  [CellRentalStatus.PAYMENT_SOON]: {
    bg: '#FFFFFF',
    progress: '#4CAF50'
  }
};

// Кастомная таблица для отображения только номеров ячеек
const CustomTaskList: React.FC<{
  rowHeight: number;
  rowWidth: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({ tasks, rowHeight, selectedTaskId }) => {
  return (
    <div
      className="grid"
      style={{
        border: "none",
      }}
    >
      {tasks.map(task => (
        <div
          key={task.id}
          className="flex items-center px-4"
          style={{
            height: rowHeight,
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: selectedTaskId === task.id ? "#f3f4f6" : "white",
          }}
        >
          <span className="font-medium">
            {task.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// Компонент для отображения заголовка списка задач
const TaskListHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight }) => {
  return (
    <div
      className="flex items-center px-4"
      style={{
        height: headerHeight,
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <span className="font-medium">Номер ячейки</span>
    </div>
  );
};

// Функция для преобразования аренд в задачи для Gantt
const convertRentalsToTasks = (rentals: CellRental[]): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();

  // Группируем аренды по ячейкам
  const cellGroups = rentals.reduce((acc, rental) => {
    const cellId = rental.cell?.id;
    if (!cellId) return acc;

    if (!acc[cellId]) {
      acc[cellId] = {
        cellId,
        cellName: `${rental.cell?.name}`,
        rentals: []
      };
    }
    acc[cellId].rentals.push(rental);
    return acc;
  }, {} as Record<string, { cellId: string, cellName: string, rentals: CellRental[] }>);

  // Создаем задачи для каждой ячейки
  Object.values(cellGroups).forEach(({ cellId, cellName, rentals }) => {
    // Для каждой аренды создаем отдельную задачу
    rentals.forEach((rental) => {
      const startDate = new Date(rental.startDate);
      const endDate = new Date(rental.endDate);

      // Вычисляем прогресс
      let progress = 0;
      if (endDate < today) {
        progress = 100;
      } else if (startDate <= today && today <= endDate) {
        const total = endDate.getTime() - startDate.getTime();
        const elapsed = today.getTime() - startDate.getTime();
        progress = Math.round((elapsed / total) * 100);
      }

      const colors = statusColors[rental.rentalStatus];

      tasks.push({
        id: `cell-${cellId}-rental-${rental.id}`,
        name: cellName,
        start: startDate,
        end: endDate,
        progress,
        type: 'task',
        styles: {
          backgroundColor: colors.bg,
          progressColor: colors.progress,
          progressSelectedColor: colors.progress,
          backgroundSelectedColor: colors.bg,
        },
      });
    });

    // Если у ячейки нет аренд, создаем пустую задачу
    if (rentals.length === 0) {
      const now = new Date();
      tasks.push({
        id: `cell-${cellId}`,
        name: cellName,
        start: now,
        end: new Date(now.getTime() + 24 * 60 * 60 * 1000), // +1 день
        progress: 0,
        type: 'task',
        styles: {
          backgroundColor: '#ffffff',
          progressColor: '#ffffff',
          progressSelectedColor: '#ffffff',
          backgroundSelectedColor: '#f5f5f5',
        },
      });
    }
  });

  return tasks;
};

// Компонент для отображения линии текущего дня
const TodayLine: React.FC<{ columnWidth: number; height: number }> = ({
  columnWidth,
  height
}) => {
  return (
    <g className="today-line">
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={height}
        className="stroke-blue-500"
        strokeWidth="2"
        strokeDasharray="4"
      />
    </g>
  );
};

export default function GanttPage() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [isInitialScroll, setIsInitialScroll] = useState(true);
  const ganttRef = useRef<HTMLDivElement>(null);

  // Добавляем стили для линии текущего дня
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .today-highlight {
        position: relative;
      }
      .today-highlight::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        background-color: blue;
        transform: translateX(-50%);
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Получаем все аренды
  const { data: rentalsData, isLoading, error } = useGetCellRentalsQuery({
    limit: 1000,
    sortBy: 'startDate',
    sortDirection: 'asc',
  });

  // Функция для скролла к текущему дню
  const scrollToToday = useCallback(() => {
    const todayElement = ganttRef.current?.querySelector('.today-highlight');
    const container = ganttRef.current?.querySelector('.gantt-horizontal-container');
    
    if (todayElement && container) {
      const containerWidth = container.clientWidth;
      const todayRect = todayElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativePosition = todayRect.left - containerRect.left;
      
      // Вычисляем позицию скролла, чтобы сегодняшняя дата была по центру
      const scrollPosition = container.scrollLeft + relativePosition - containerWidth / 2;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: isInitialScroll ? 'instant' : 'smooth'
      });
      
      if (isInitialScroll) {
        setIsInitialScroll(false);
      }
    }
  }, [isInitialScroll]);

  // Центрируем на текущей дате при первой загрузке
  useEffect(() => {
    if (rentalsData?.data) {
      // Даем немного времени на рендеринг
      const timer = setTimeout(scrollToToday, 100);
      return () => clearTimeout(timer);
    }
  }, [rentalsData, scrollToToday]);

  // Центрируем при изменении режима отображения
  useEffect(() => {
    const timer = setTimeout(scrollToToday, 100);
    return () => clearTimeout(timer);
  }, [viewMode, scrollToToday]);

  // Функции навигации
  const handleScroll = (direction: 'left' | 'right') => {
    const container = ganttRef.current?.querySelector('.gantt-horizontal-container');
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollPosition = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleZoom = (type: 'in' | 'out') => {
    const modes = [ViewMode.Hour, ViewMode.Day, ViewMode.Week, ViewMode.Month, ViewMode.Year];
    const currentIndex = modes.indexOf(viewMode);
    if (type === 'in' && currentIndex > 0) {
      setViewMode(modes[currentIndex - 1]);
    } else if (type === 'out' && currentIndex < modes.length - 1) {
      setViewMode(modes[currentIndex + 1]);
    }
  };

  // Преобразуем аренды в задачи для диаграммы Ганта
  const tasks = useMemo(() => {
    if (!rentalsData?.data) return [];
    return convertRentalsToTasks(rentalsData.data);
  }, [rentalsData]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Произошла ошибка при загрузке данных
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">График занятости ячеек</h1>

        <div className="flex items-center gap-4">
          {/* Кнопки навигации */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={scrollToToday}
            >
              Сегодня
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Кнопки масштабирования */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom('in')}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom('out')}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="mb-4 flex flex-wrap gap-4">
        {Object.entries(statusColors).map(([status, colors]) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors.progress }}
            />
            <span className="text-sm">
              {status === 'ACTIVE' ? 'Активная' :
                status === 'EXPIRING_SOON' ? 'Скоро истекает' :
                  status === 'EXPIRED' ? 'Просрочена' :
                    status === 'CLOSED' ? 'Закрыта' :
                      status === 'RESERVATION' ? 'Бронь' :
                        status === 'EXTENDED' ? 'Продлена' :
                          'Скоро оплата'}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex-grow relative shadow-md rounded-lg bg-white overflow-hidden" ref={ganttRef}>
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          locale="ru"
          listCellWidth="120px"
          columnWidth={100}
          handleWidth={8}
          rowHeight={40}
          arrowColor='red'
          TaskListTable={CustomTaskList}
          TaskListHeader={TaskListHeader}
        />
      </div>
    </div>
  );
} 