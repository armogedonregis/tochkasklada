'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useGetGanttRentalsQuery } from '@/services/cellRentalsService/cellRentalsApi';
import { CellRental } from '@/services/cellRentalsService/cellRentals.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ChevronDown, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

// Получаем цвета из статусов ячеек
const getStatusColors = (rental: CellRental) => {
  const statusColor = rental.status?.color || '#4CAF50';
  return {
    bg: '#F3F4F6',
    progress: statusColor
  };
};

// Кастомный компонент для отображения заголовка списка
const CustomTaskListHeader: React.FC<{
  headerHeight: number;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight }) => {
  return (
    <div
      className="flex items-center px-4 font-medium"
      style={{
        height: headerHeight,
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
      }}
    >
      <span>Ячейка</span>
    </div>
  );
};

// Кастомный компонент для отображения списка задач
const CustomTaskList: React.FC<{
  tasks: Task[];
  rowHeight: number;
  selectedTaskId: string;
  onExpanderClick: (task: Task) => void;
}> = ({ tasks, rowHeight, selectedTaskId }) => {
  return (
    <div className="grid h-full">
      {tasks.map(task => {
        if (task.id === 'empty') return null;
        
        return (
          <div
            key={task.id}
            className="flex items-center px-4 hover:bg-gray-50 transition-colors group"
            style={{
              height: rowHeight,
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: selectedTaskId === task.id ? "#f3f4f6" : "white",
              minHeight: rowHeight,
            }}
          >
            <div className="flex items-center space-x-2 truncate flex-1">
              <span className="font-medium">
                {task.name}
              </span>
              <span className="text-sm text-gray-500 group-hover:opacity-100 opacity-0">
                {formatDate(task.start)} - {formatDate(task.end)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Кастомный компонент для тултипа
const CustomTooltip: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task }) => {
  if (task.id === 'empty') return null;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border">
      <div className="font-medium mb-1">{task.name}</div>
      <div className="text-sm text-gray-600">
        <div>Начало: {formatDate(task.start)}</div>
        <div>Конец: {formatDate(task.end)}</div>
        {task.type !== 'project' && (
          <div className="mt-1 pt-1 border-t">
            Статус: <span className="inline-block w-3 h-3 rounded-full ml-1" style={{ backgroundColor: task.styles?.progressColor }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Функция форматирования даты
const formatDate = (date: Date) => {
  return format(date, 'dd.MM.yy', { locale: ru });
};

// Функция группировки задач по локации
const groupTasksByLocation = (tasks: Task[]): Task[] => {
  if (!tasks.length) return tasks;

  const locationGroups = new Map<string, Task[]>();
  const nonGroupTasks: Task[] = [];

  tasks.forEach(task => {
    if (task.id === 'empty') {
      nonGroupTasks.push(task);
      return;
    }

    const locationId = task.project || 'other';
    if (!locationGroups.has(locationId)) {
      locationGroups.set(locationId, []);
    }
    locationGroups.get(locationId)!.push(task);
  });

  const groupedTasks: Task[] = nonGroupTasks;

  locationGroups.forEach((tasks, locationId) => {
    if (locationId === 'other') return;

    const firstTask = tasks[0];
    const lastTask = tasks[tasks.length - 1];

    // Создаем группу
    const groupTask: Task = {
      id: `group_${locationId}`,
      name: `Локация ${locationId}`,
      type: 'project',
      start: new Date(Math.min(...tasks.map(t => t.start.getTime()))),
      end: new Date(Math.max(...tasks.map(t => t.end.getTime()))),
      progress: 0,
      hideChildren: false,
      styles: {
        backgroundColor: '#E5E7EB',
        progressColor: '#9CA3AF',
        progressSelectedColor: '#6B7280',
        backgroundSelectedColor: '#D1D5DB'
      }
    };

    groupedTasks.push(groupTask);
    tasks.forEach(task => {
      task.project = groupTask.id;
      groupedTasks.push(task);
    });
  });

  return groupedTasks;
};

export default function GanttPage() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const ganttRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = addMonths(start, 6);
    return { start, end };
  });

  // Создаем пустые задачи для отображения временной шкалы
  const emptyTasks = useMemo(() => {
    return [{
      id: 'empty',
      name: ' ',
      start: dateRange.start,
      end: dateRange.end,
      progress: 0,
      type: 'task',
      styles: {
        backgroundColor: 'transparent',
        progressColor: 'transparent',
        progressSelectedColor: 'transparent',
        backgroundSelectedColor: 'transparent',
      },
    } as Task];
  }, [dateRange]);

  // Получаем данные с учетом диапазона дат
  const { data: rentalsData, isLoading } = useGetGanttRentalsQuery({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString(),
    limit: 1000
  });

  console.log('Rentals data:', rentalsData);

  // Преобразуем аренды в задачи
  useEffect(() => {
    console.log('Processing tasks with data:', rentalsData?.data);
    if (!rentalsData?.data?.length) {
      console.log('No rentals data, returning empty tasks:', emptyTasks);
      setTasks(emptyTasks);
      return;
    }

    // Создаем задачи из аренд
    const result: Task[] = [...emptyTasks];
    
    rentalsData.data.forEach(rental => {
      const startDate = new Date(rental.startDate);
      const endDate = new Date(rental.endDate);
      const colors = getStatusColors(rental);
      
      result.push({
        id: rental.id,
        name: `${rental.cell?.name} ${rental.status ? `(${rental.status.name})` : ''}`,
        start: startDate,
        end: endDate,
        progress: 100,
        type: 'task',
        styles: {
          backgroundColor: colors.bg,
          progressColor: colors.progress,
          progressSelectedColor: colors.progress,
          backgroundSelectedColor: '#E5E7EB'
        }
      } as Task);
    });
    
    // Сортируем ячейки по имени
    result.sort((a, b) => {
      if (a.id === 'empty' || b.id === 'empty') return 0;
      return a.name.localeCompare(b.name);
    });
    
    console.log('Transformed tasks:', result);
    setTasks(result);
  }, [rentalsData, emptyTasks]);

  // Функция для центрирования на текущей дате
  const scrollToToday = useCallback(() => {
    const container = ganttRef.current?.querySelector('.gantt-horizontal-container');
    const svgContainer = ganttRef.current?.querySelector('.gantt-chart-timeline');
    if (!container || !svgContainer) return;

    const today = new Date();
    const start = dateRange.start;
    const totalWidth = svgContainer.scrollWidth;
    const totalDays = (dateRange.end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const pixelsPerDay = totalWidth / totalDays;
    
    requestAnimationFrame(() => {
      const scrollPosition = (daysPassed * pixelsPerDay) - (container.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
    });
  }, [dateRange]);

  // Обработчик изменения дат
  const handleDateChange = useCallback((task: Task) => {
    if (task.type === 'project') return false;
    return true;
  }, []);

  // Обработчик раскрытия/скрытия группы
  const handleExpanderClick = useCallback((task: Task) => {
    if (task.type !== 'project') return;
    
    const newTasks = tasks.map(t => {
      // Если это та же задача, меняем ее состояние
      if (t.id === task.id) {
        return { ...t, hideChildren: !t.hideChildren };
      }
      
      // Если это локация и мы скрываем ее
      if (task.id.startsWith('location_') && !task.project) {
        // Скрываем все контейнеры и ячейки этой локации
        if (t.project === task.id || t.project?.startsWith('container_') && tasks.find(ct => ct.id === t.project)?.project === task.id) {
          return { ...t, hideChildren: task.hideChildren ? false : true };
        }
      }
      
      // Если это контейнер
      if (task.id.startsWith('container_')) {
        // Скрываем только ячейки этого контейнера
        if (t.project === task.id) {
          return { ...t, hideChildren: task.hideChildren ? false : true };
        }
      }
      
      return t;
    });
    
    // setTasks(newTasks); // This line was removed as per the edit hint
  }, [tasks]);

  // Обработчик выбора задачи
  const handleTaskSelect = useCallback((task: Task, isSelected: boolean) => {
    setSelectedTask(isSelected ? task.id : '');
  }, []);

  // Центрируем при первой загрузке
  useEffect(() => {
    if (tasks.length) {
      setTimeout(scrollToToday, 100);
    }
  }, [tasks, scrollToToday]);

  // Обработчики навигации
  const handleScrollButton = (direction: 'left' | 'right') => {
    const container = ganttRef.current?.querySelector('.gantt-horizontal-container');
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleZoom = (type: 'in' | 'out') => {
    const modes = [ViewMode.Hour, ViewMode.Day, ViewMode.Week, ViewMode.Month, ViewMode.Year];
    const currentIndex = modes.indexOf(viewMode);
    if (type === 'in' && currentIndex > 0) {
      setViewMode(modes[currentIndex - 1]);
      setTimeout(scrollToToday, 100);
    } else if (type === 'out' && currentIndex < modes.length - 1) {
      setViewMode(modes[currentIndex + 1]);
      setTimeout(scrollToToday, 100);
    }
  };

  // Обработчики для drag-to-scroll
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setIsDragging(true);
    setStartPoint({
      x: e.pageX - container.offsetLeft,
      y: e.pageY - container.offsetTop,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop
    });

    // Меняем курсор на grab
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!scrollContainerRef.current) return;

    setIsDragging(false);
    const container = scrollContainerRef.current;
    container.style.cursor = 'auto';
    container.style.userSelect = 'auto';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const container = scrollContainerRef.current;
    
    const dx = e.pageX - container.offsetLeft - startPoint.x;
    const dy = e.pageY - container.offsetTop - startPoint.y;
    
    container.scrollLeft = startPoint.scrollLeft - dx;
    container.scrollTop = startPoint.scrollTop - dy;
  }, [isDragging, startPoint]);

  // Очистка обработчиков при размонтировании
  useEffect(() => {
    const cleanup = () => {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'auto';
        scrollContainerRef.current.style.userSelect = 'auto';
      }
    };

    document.addEventListener('mouseup', cleanup);
    return () => {
      document.removeEventListener('mouseup', cleanup);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">График занятости ячеек</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleScrollButton('left')}
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
              onClick={() => handleScrollButton('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

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

      <div 
        className="w-full flex-grow shadow-md rounded-lg bg-white gantt-container" 
        ref={ganttRef}
        style={{ 
          height: 'calc(100vh - 180px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 gantt-scroll-container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          <div className="gantt-content">
            <Gantt
              tasks={tasks}
              viewMode={viewMode}
              locale="ru"
              listCellWidth="320px"
              columnWidth={viewMode === ViewMode.Month ? 300 : viewMode === ViewMode.Week ? 180 : 60}
              rowHeight={44}
              barFill={60}
              barBackgroundColor="#E5E7EB"
              barProgressColor="#3B82F6"
              barProgressSelectedColor="#2563EB"
              projectProgressColor="#9CA3AF"
              projectBackgroundColor="#F3F4F6"
              arrowColor="#9CA3AF"
              fontFamily="inherit"
              fontSize="14px"
              TaskListHeader={CustomTaskListHeader}
              TaskListTable={CustomTaskList}
              TooltipContent={CustomTooltip}
              onDateChange={handleDateChange}
              onSelect={handleTaskSelect}
              onExpanderClick={handleExpanderClick}
              ganttHeight={tasks.length * 44 + 100}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gantt-container {
          --scrollbar-track: #f1f1f1;
          --scrollbar-thumb: #888;
        }

        .gantt-scroll-container {
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
          cursor: grab;
        }

        .today {
          rect {
            fill: #6363fd;
          }
        }

        .gantt-scroll-container:active {
          cursor: grabbing;
        }

        .gantt-content {
          min-width: fit-content;
          pointer-events: auto;
        }

        .gantt-horizontal-container {
          overflow: visible !important;
        }
        
        .gantt-scroll-container::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        .gantt-scroll-container::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 6px;
          margin: 2px;
        }
        
        .gantt-scroll-container::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 6px;
          border: 3px solid var(--scrollbar-track);
        }
        
        .gantt-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .gantt-scroll-container::-webkit-scrollbar-corner {
          background: var(--scrollbar-track);
        }
      `}</style>
    </div>
  );
} 