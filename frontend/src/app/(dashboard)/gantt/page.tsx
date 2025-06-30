'use client';

import { Chart } from 'react-google-charts';
import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// Определение колонок для диаграммы Ганта
export const columns = [
  { type: 'string', label: 'Task ID' },
  { type: 'string', label: 'Task Name' },
  { type: 'string', label: 'Resource' },
  { type: 'date', label: 'Start Date' },
  { type: 'date', label: 'End Date' },
  { type: 'number', label: 'Duration' },
  { type: 'number', label: 'Percent Complete' },
  { type: 'string', label: 'Dependencies' },
];

// --- Генерация большого набора фейковых данных ---
const generateGanttData = () => {
  const rows = [];
  const resources = [
    'Ячейка A-01', 'Ячейка A-02', 'Ячейка A-03', 'Ячейка A-04',
    'Ячейка B-01', 'Ячейка B-02', 'Ячейка B-03',
    'Ячейка C-01', 'Ячейка C-02', 'Ячейка D-01',
  ];
  const today = new Date();
  const periodStartDate = new Date();
  periodStartDate.setFullYear(today.getFullYear() - 1); // Начало периода - 1 год назад

  for (let i = 0; i < 50; i++) { // Создаем 50 задач
    const resource = resources[Math.floor(Math.random() * resources.length)];
    const startOffset = Math.floor(Math.random() * 730); // Случайное начало в пределах 2 лет
    const durationDays = Math.floor(Math.random() * 60) + 15; // Длительность от 15 до 75 дней

    const startDate = new Date(periodStartDate);
    startDate.setDate(startDate.getDate() + startOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    
    let progress = Math.floor(Math.random() * 91) + 5; // от 5% до 95%
    if (endDate < today) {
        progress = 100; // Завершено, если дата окончания в прошлом
    } else if (startDate > today) {
        progress = 0; // Не начато, если дата начала в будущем
    }

    rows.push([
        `task-${resource.replace(/\s/g, '-')}-${i}`,
        `Платеж по ${resource}`,
        resource,
        startDate,
        endDate,
        null,
        progress,
        null,
    ]);
  }

  // Сортируем задачи по ресурсу, а затем по дате начала
  rows.sort((a, b) => {
    const resourceA = a[2] as string;
    const resourceB = b[2] as string;
    const dateA = a[3] as Date;
    const dateB = b[3] as Date;

    if (resourceA < resourceB) return -1;
    if (resourceA > resourceB) return 1;
    return dateA.getTime() - dateB.getTime();
  });

  return [columns, ...rows];
};

export const data = generateGanttData();

const minDate = new Date(Math.min(...data.slice(1).map(row => (row[3] as Date).getTime())));
const maxDate = new Date(Math.max(...data.slice(1).map(row => (row[4] as Date).getTime())));

export const options = {
  gantt: {
    trackHeight: 30,
    barHeight: 20,
    criticalPathEnabled: false,
    arrow: { width: 0, color: 'transparent' },
    palette: [{ color: '#F62D40', dark: '#E5293A', light: '#F8888F' }],
  },
};

export default function GanttPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToToday = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const timelineWidth = container.scrollWidth - container.clientWidth;
    const totalDuration = maxDate.getTime() - minDate.getTime();
    const todayOffset = new Date().getTime() - minDate.getTime();

    const scrollPosition = (todayOffset / totalDuration) * timelineWidth;
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  }, []);

  const scrollBy = useCallback((months: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const pixelsPerDay = container.scrollWidth / ((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24));
    const scrollAmount = pixelsPerDay * 30 * months;
    
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  return (
    <div className="p-6 flex flex-col h-full">
      <h1 className="text-xl font-bold mb-4">Диаграмма Ганта по платежам</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => scrollBy(-12)} variant="outline"> &lt;&lt; Год </Button>
        <Button onClick={() => scrollBy(-1)} variant="outline"> &lt; Мес </Button>
        <Button onClick={scrollToToday}>Сегодня</Button>
        <Button onClick={() => scrollBy(1)} variant="outline"> Мес &gt; </Button>
        <Button onClick={() => scrollBy(12)} variant="outline"> Год &gt;&gt; </Button>
      </div>

      <div className="w-full overflow-x-auto flex-grow" ref={scrollContainerRef}>
        <div style={{ height: `${(data.length - 1) * 40 + 50}px` }}>
            <Chart
              chartType="Gantt"
              width="100%"
              height="100%"
              data={data}
              options={options}
              chartLanguage="ru"
            />
        </div>
      </div>
    </div>
  );
} 