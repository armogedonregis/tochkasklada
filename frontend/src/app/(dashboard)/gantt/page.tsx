'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useGetGanttRentalsQuery } from '@/services/cellRentalsService/cellRentalsApi';
import { CellRental } from '@/services/cellRentalsService/cellRentals.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

// Получаем цвета из статусов ячеек
const getStatusColors = (rental: CellRental) => {
  try {
    const statusColor = rental?.status?.color || '#4CAF50';
    return {
      bg: '#F3F4F6',
      progress: statusColor
    };
  } catch (error) {
    console.warn('Error getting status colors:', error);
    return {
      bg: '#F3F4F6',
      progress: '#4CAF50'
    };
  }
};

// Функция форматирования даты
const formatDate = (date: Date | string) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Неверная дата';
    }
    return format(dateObj, 'dd.MM.yy', { locale: ru });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Неверная дата';
  }
};

// Кастомный компонент для отображения заголовка списка
const CustomTaskListHeader: React.FC<{
  headerHeight: number;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight }) => {
  return (
    <div
      className="flex items-center bg-gray-50 border-b border-gray-200 px-4"
      style={{ height: headerHeight }}
    >
      <div className="flex-1 font-medium text-gray-700">Ячейка</div>
      <div className="w-32 font-medium text-gray-700 text-center">Период аренды</div>
    </div>
  );
};

// Кастомный компонент для отображения строк списка
const CustomTaskList: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({ rowHeight, tasks, selectedTaskId }) => {
  return (
    <div className="gantt-task-list">
      {tasks.map((task, index) => {
        if (!task.name || task.name === ' ') return null; // Пропускаем пустые задачи

        return (
          <div
            key={task.id}
            className={`flex items-center px-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors ${selectedTaskId === task.id ? 'bg-blue-50' : ''
              }`}
            style={{ height: rowHeight }}
          >
            <div className="flex-1 text-sm font-medium text-gray-900">
              {task.name}
            </div>
            <div className="w-32 text-xs text-gray-600 text-center">
              {formatDate(task.start)} - {formatDate(task.end)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Кастомный тултип
const CustomTooltip: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task }) => {
  if (!task.name || task.name === ' ') return null;

  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg max-w-xs">
      <div className="font-medium mb-1">{task.name}</div>
      <div className="text-sm opacity-90">
        {formatDate(task.start)} - {formatDate(task.end)}
      </div>
      {task.progress !== undefined && task.progress > 0 && (
        <div className="text-sm opacity-90 mt-1">
          Прогресс: {task.progress}%
        </div>
      )}
    </div>
  );
};

export default function GanttPage() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const ganttRef = useRef<HTMLDivElement>(null);

  // Динамический диапазон дат - центрируем вокруг сегодняшней даты
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const start = subMonths(now, 1.5); // 1.5 месяца назад
    const end = addMonths(now, 1.5);   // 1.5 месяца вперед
    return { start, end };
  });

  // Состояние для отслеживания загрузки дополнительных данных
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Состояние для drag-to-scroll
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  // Получаем данные для диаграммы Ганта
  const { data: rentalsData, isLoading, error, refetch } = useGetGanttRentalsQuery({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString()
  });

  // Создаем пустые задачи для отображения временной шкалы
  const emptyTasks = useMemo(() => {
    return [{
      id: 'empty',
      name: ' ',
      start: dateRange.start,
      end: dateRange.end,
      progress: 0,
      type: 'task' as const,
      styles: {
        backgroundColor: 'transparent',
        progressColor: 'transparent',
        progressSelectedColor: 'transparent'
      }
    }];
  }, [dateRange]);

  // Преобразуем данные аренд в задачи для Gantt
  const tasks: Task[] = useMemo(() => {
    try {
      if (!rentalsData?.data || !Array.isArray(rentalsData.data)) {
        console.log('No rental data available, using empty tasks');
        return emptyTasks;
      }

      if (rentalsData.data.length === 0) {
        console.log('Empty rental data, using empty tasks');
        return emptyTasks;
      }

      const ganttTasks = rentalsData.data
        .filter((rental: CellRental) => {
          // Проверяем валидность данных
          if (!rental?.cell?.name || !rental.startDate || !rental.endDate) {
            console.warn('Invalid rental data:', rental);
            return false;
          }

          const start = new Date(rental.startDate);
          const end = new Date(rental.endDate);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.warn('Invalid dates in rental:', rental);
            return false;
          }

          return true;
        })
        .map((rental: CellRental) => {
          const colors = getStatusColors(rental);
          const cellName = `${rental.cell?.name || 'Ячейка'}`;

          return {
            id: rental.id,
            name: cellName,
            start: new Date(rental.startDate),
            end: new Date(rental.endDate),
            progress: 100,
            type: 'task' as const,
            styles: {
              backgroundColor: colors.bg,
              progressColor: colors.progress,
              progressSelectedColor: colors.progress
            }
          };
        });

      console.log(`Generated ${ganttTasks.length} gantt tasks from ${rentalsData.data.length} rentals`);

      return ganttTasks.length > 0 ? ganttTasks : emptyTasks;
    } catch (error) {
      console.error('Error creating gantt tasks:', error);
      return emptyTasks;
    }
  }, [rentalsData, emptyTasks]);

  // Функция для поиска контейнера скролла
  const findScrollContainer = useCallback(() => {
    if (!ganttRef.current) return null;

    // Сначала ищем специфический класс который мы знаем
    const specificContainer = ganttRef.current.querySelector('._CZjuD') as HTMLElement;
    if (specificContainer && specificContainer.scrollWidth > specificContainer.clientWidth) {
      console.log('Found _CZjuD container:', {
        scrollWidth: specificContainer.scrollWidth,
        clientWidth: specificContainer.clientWidth,
        scrollLeft: specificContainer.scrollLeft
      });
      return specificContainer;
    }

    // Попробуем разные возможные селекторы в порядке приоритета
    const selectors = [
      '.gantt-horizontal-container',
      '.gantt-chart-container',
      '.gantt-horizontal-scroll',
      '.gantt-table-container',
      '.gantt-chart',
      '[class*="horizontal"]',
      '[class*="chart-container"]',
      '[class*="scroll"]'
    ];

    for (const selector of selectors) {
      const container = ganttRef.current.querySelector(selector) as HTMLElement;
      if (container && container.scrollWidth > container.clientWidth) {
        console.log(`Found scroll container: ${selector}`, {
          scrollWidth: container.scrollWidth,
          clientWidth: container.clientWidth,
          className: container.className
        });
        return container;
      }
    }

    // Если ничего не найдено, ищем любой элемент с горизонтальным скроллом
    const allDivs = ganttRef.current.querySelectorAll('div');
    for (const div of allDivs) {
      const element = div as HTMLElement;
      if (element.scrollWidth > element.clientWidth &&
        !element.classList.contains('gantt-task-list-wrapper') && // Исключаем левую панель
        !element.classList.contains('gantt-task-list')) {
        console.log('Found scrollable div:', {
          className: element.className,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth
        });
        return element;
      }
    }

    console.log('No scroll container found');
    return null;
  }, []);

  // Обработчик скролла для динамической подгрузки
  const handleLoadMoreData = useCallback(async (direction: 'past' | 'future') => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    console.log(`Loading more data in ${direction}...`);

    setDateRange(prev => {
      const newRange = direction === 'past'
        ? { start: subMonths(prev.start, 1), end: prev.end }
        : { start: prev.start, end: addMonths(prev.end, 1) };

      return newRange;
    });

    // Завершаем загрузку через небольшую задержку
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 1000);
  }, [isLoadingMore]);

  // Функция для центрирования на текущей дате - ищем элемент today
  const scrollToToday = useCallback(() => {
    try {
      setTimeout(() => {
        const container = findScrollContainer();
        if (!container) {
          console.log('Container not found for scrollToToday');
          return;
        }

        // Ищем элемент сегодняшнего дня по классу "today"
        const todayElement = ganttRef.current?.querySelector('g.today rect') as SVGRectElement;
        if (todayElement) {
          const x = parseFloat(todayElement.getAttribute('x') || '0');
          console.log('Found today element at x:', x);

          // Центрируем на элементе today
          const scrollPosition = x - container.clientWidth / 2;

          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });

          console.log('Scrolled to today position:', scrollPosition);
        } else {
          console.log('Today element not found, using fallback method');

          // Fallback: используем расчет по датам
          const today = new Date();
          const totalDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
          const daysPassed = Math.ceil((today.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

          const scrollPosition = (daysPassed / totalDays) * container.scrollWidth - container.clientWidth / 2;

          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        }
      }, 500); // Увеличиваем задержку чтобы SVG успел отрендериться
    } catch (error) {
      console.error('Error in scrollToToday:', error);
    }
  }, [dateRange, findScrollContainer]);

  // Обработчики для drag-to-scroll
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Проверяем, что клик не в области списка задач
    const target = e.target as HTMLElement;
    if (target.closest('.gantt-task-list-wrapper') || target.closest('.gantt-task-list')) {
      return; // Не обрабатываем drag для списка задач
    }

    const container = findScrollContainer();
    if (!container) return;

    setIsDragging(true);
    setDragStart({
      x: e.pageX,
      scrollLeft: container.scrollLeft
    });

    e.preventDefault();
    document.body.style.userSelect = 'none';
    console.log('Drag started on chart area');
  }, [findScrollContainer]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = findScrollContainer();
    if (!container) return;

    const deltaX = e.pageX - dragStart.x;
    const newScrollLeft = dragStart.scrollLeft - deltaX;

    container.scrollLeft = Math.max(0, Math.min(newScrollLeft, container.scrollWidth - container.clientWidth));

    // Проверяем необходимость загрузки данных при перетаскивании
    const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth);
    if (scrollPercentage <= 0.05 && !isLoadingMore) {
      handleLoadMoreData('past');
    } else if (scrollPercentage >= 0.95 && !isLoadingMore) {
      handleLoadMoreData('future');
    }
  }, [isDragging, dragStart, findScrollContainer, isLoadingMore, handleLoadMoreData]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  // Глобальные обработчики для завершения перетаскивания
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = '';
      };

      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const container = findScrollContainer();
        if (!container) return;

        const deltaX = e.pageX - dragStart.x;
        const newScrollLeft = dragStart.scrollLeft - deltaX;

        container.scrollLeft = Math.max(0, Math.min(newScrollLeft, container.scrollWidth - container.clientWidth));
      };

      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);

      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isDragging, dragStart, findScrollContainer]);

  // Центрируем при первой загрузке
  useEffect(() => {
    if (tasks.length > 1 && !isLoading) {
      scrollToToday();
    }
  }, [tasks.length, isLoading, scrollToToday]);

  // Функция для скролла кнопками
  const handleScrollButton = useCallback((direction: 'left' | 'right') => {
    const container = findScrollContainer();
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: Math.max(0, newScrollLeft),
      behavior: 'smooth'
    });
  }, [findScrollContainer]);

  // Обработчик изменения дат (отключен)
  const handleDateChange = useCallback(() => {
    return false;
  }, []);

  // Обработчик раскрытия/скрытия группы
  const handleExpanderClick = useCallback((task: Task) => {
    console.log('Expander clicked for task:', task.id);
  }, []);

  // Обработчик выбора задачи
  const handleTaskSelect = useCallback((task: Task, isSelected: boolean) => {
    setSelectedTask(isSelected ? task.id : '');
  }, []);

  const handleZoom = (type: 'in' | 'out') => {
    const modes = [ViewMode.Day, ViewMode.Week, ViewMode.Month];
    const currentIndex = modes.indexOf(viewMode);

    if (type === 'in' && currentIndex > 0) {
      setViewMode(modes[currentIndex - 1]);
    } else if (type === 'out' && currentIndex < modes.length - 1) {
      setViewMode(modes[currentIndex + 1]);
    }
  };

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="text-red-600 mb-4">Ошибка загрузки данных диаграммы Ганта</div>
        <Button onClick={() => refetch()} variant="outline">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">График занятости ячеек</h1>
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Загрузка данных...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleScrollButton('left')}
              title="Прокрутить влево"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={scrollToToday}
              title="Перейти к сегодняшнему дню"
            >
              Сегодня
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const container = findScrollContainer();
                console.log('=== ДИАГНОСТИКА СКРОЛЛА ===');
                console.log('Контейнер найден:', !!container);
                if (container) {
                  console.log('Scroll info:', {
                    scrollLeft: container.scrollLeft,
                    scrollWidth: container.scrollWidth,
                    clientWidth: container.clientWidth,
                    canScroll: container.scrollWidth > container.clientWidth,
                    className: container.className
                  });

                  // Поиск элемента today
                  const todayElement = ganttRef.current?.querySelector('g.today rect') as SVGRectElement;
                  if (todayElement) {
                    const x = parseFloat(todayElement.getAttribute('x') || '0');
                    console.log('Today element found at x:', x);
                  } else {
                    console.log('Today element not found');
                  }

                  // Тестовый скролл
                  console.log('Testing scroll...');
                  container.scrollTo({ left: container.scrollLeft + 200, behavior: 'smooth' });
                } else {
                  console.log('Поиск специфического класса _CZjuD:');
                  const czjudElement = ganttRef.current?.querySelector('._CZjuD') as HTMLElement;
                  if (czjudElement) {
                    console.log('_CZjuD найден:', {
                      scrollWidth: czjudElement.scrollWidth,
                      clientWidth: czjudElement.clientWidth,
                      overflowX: getComputedStyle(czjudElement).overflowX,
                      overflowY: getComputedStyle(czjudElement).overflowY
                    });
                  }

                  console.log('Все div элементы в gantt:');
                  if (ganttRef.current) {
                    [...ganttRef.current.querySelectorAll('div')].forEach((div, i) => {
                      const el = div as HTMLElement;
                      console.log(`${i}: ${el.className || 'no-class'}`, {
                        scrollable: el.scrollWidth > el.clientWidth,
                        scrollWidth: el.scrollWidth,
                        clientWidth: el.clientWidth,
                        overflowX: getComputedStyle(el).overflowX
                      });
                    });
                  }
                }
              }}
              title="Отладка скролла"
            >
              Debug
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleScrollButton('right')}
              title="Прокрутить вправо"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom('in')}
              disabled={viewMode === ViewMode.Day}
              title="Увеличить"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-16 text-center">
              {viewMode === ViewMode.Day && 'День'}
              {viewMode === ViewMode.Week && 'Неделя'}
              {viewMode === ViewMode.Month && 'Месяц'}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom('out')}
              disabled={viewMode === ViewMode.Month}
              title="Уменьшить"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={ganttRef}
        className="flex-1 bg-white rounded-lg shadow-sm border"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          height: 'calc(100vh - 180px)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 w-full max-w-4xl">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="gantt-content overflow-y-auto overflow-x-hidden h-full">
            <Gantt
              tasks={tasks}
              viewMode={viewMode}
              locale="ru"
              listCellWidth="320px"
              columnWidth={viewMode === ViewMode.Month ? 300 : viewMode === ViewMode.Week ? 180 : 60}
              rowHeight={32}
              barFill={32}
              barBackgroundColor="#E5E7EB"
              barProgressColor="#3B82F6"
              barProgressSelectedColor="#2563EB"
              projectProgressColor="#9CA3AF"
              projectBackgroundColor="#F3F4F6"
              arrowColor="#9CA3AF"
              fontFamily="inherit"
              fontSize="12px"
              TaskListHeader={CustomTaskListHeader}
              TaskListTable={CustomTaskList}
              TooltipContent={CustomTooltip}
              onDateChange={handleDateChange}
              onSelect={handleTaskSelect}
              onExpanderClick={handleExpanderClick}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-500 mb-2">Нет данных для отображения</div>
              <div className="text-sm text-gray-400">
                Период: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS стили для закрепления элементов и настройки скролла */}
      <style jsx global>{`
        /* Основной контейнер диаграммы */
        .gantt-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: visible !important;
          --scrollbar-track: #f1f1f1;
          --scrollbar-thumb: #888;
        }

        .gantt-scroll-container {
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
          cursor: grab;
        }

        /* Левая панель с ячейками - закреплена */
        .gantt-task-list-wrapper {
          position: sticky !important;
          left: 0 !important;
          z-index: 10 !important;
          background: white !important;
          border-right: 1px solid #e5e7eb !important;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1) !important;
        }

        /* Заголовок левой панели */
        .gantt-task-list-header {
          position: sticky !important;
          top: 0 !important;
          z-index: 15 !important;
          background: white !important;
          border-bottom: 1px solid #e5e7eb !important;
        }

        /* Заголовки дат - закреплены сверху */
        .gantt-header {
          position: sticky !important;
          top: 0 !important;
          z-index: 12 !important;
          background: white !important;
          border-bottom: 1px solid #e5e7eb !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        /* Основная область со скроллом - УБИРАЕМ overflow: hidden */
        .gantt-chart-container,
        .gantt-horizontal-container,
        ._CZjuD {
          overflow-x: auto !important;
          overflow-y: visible !important;
          scrollbar-width: thin !important;
          scrollbar-color: #888 #f1f1f1 !important;
        }
          ._CZjuD::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
        
        ._CZjuD::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ._CZjuD::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        /* Диаграмма должна быть достаточно широкой для скролла */
        .gantt-chart {
          min-width: max-content !important;
          width: max-content !important;
        }

        /* Полоски задач */
        .gantt-task-bar {
          height: 20px !important;
          border-radius: 4px !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        /* Вертикальная синхронизация скролла */
        .gantt-table-body {
          overflow-y: auto !important;
          max-height: calc(100vh - 250px) !important;
        }

        .gantt-chart-body {
          overflow-y: auto !important;
          max-height: calc(100vh - 250px) !important;
        }

        /* Синхронизация вертикального скролла между списком и диаграммой */
        .gantt-table-body::-webkit-scrollbar,
        .gantt-chart-body::-webkit-scrollbar {
          width: 8px;
        }

        .gantt-table-body::-webkit-scrollbar-track,
        .gantt-chart-body::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .gantt-table-body::-webkit-scrollbar-thumb,
        .gantt-chart-body::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        /* Убираем лишние отступы */
        .gantt-task-list {
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Стили для строк */
        .gantt-task-list-row {
          border-bottom: 1px solid #f3f4f6 !important;
        }

        /* Линия сегодняшнего дня */
        .gantt-today-line {
          stroke: #ef4444 !important;
          stroke-width: 2px !important;
          opacity: 0.8 !important;
          z-index: 5 !important;
        }

        /* Сетка диаграммы */
        .gantt-grid-row {
          border-bottom: 1px solid #f9fafb !important;
        }

        .gantt-grid-column {
          border-right: 1px solid #f9fafb !important;
        }

        /* Обеспечиваем правильное позиционирование */
        .gantt-wrapper {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
        }

        /* Принудительно убираем overflow: hidden со всех элементов диаграммы */
        .gantt-container *,
        [class*="gantt"] * {
          overflow: visible !important;
        }

        /* Исключение для элементов которые должны иметь скролл */
        ._CZjuD,
        .gantt-horizontal-container,
        .gantt-chart-container {
          overflow-x: auto !important;
          overflow-y: visible !important;
        }
      `}</style>
    </div>
  );
} 