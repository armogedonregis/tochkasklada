'use client';

import React, { useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- Генерация данных для gantt-task-react ---
const generateGanttData = (): Task[] => {
  const tasks: Task[] = [];
  const resources = [
    'Ячейка A-01', 'Ячейка A-02', 'Ячейка A-03', 'Ячейка A-04',
    'Ячейка B-01', 'Ячейка B-02', 'Ячейка B-03',
    'Ячейка C-01', 'Ячейка C-02', 'Ячейка D-01',
  ];
  const today = new Date();
  const periodStartDate = new Date();
  periodStartDate.setFullYear(today.getFullYear() - 1);

  for (let i = 0; i < 50; i++) {
    const resource = resources[i % resources.length];
    const startOffset = Math.floor(Math.random() * 730);
    const durationDays = Math.floor(Math.random() * 60) + 15;

    const startDate = new Date(periodStartDate);
    startDate.setDate(startDate.getDate() + startOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    
    let progress = Math.floor(Math.random() * 91) + 5;
    if (endDate < today) {
        progress = 100;
    } else if (startDate > today) {
        progress = 0;
    }
    
    tasks.push({
        id: `task-${i}`,
        name: `Платеж по ${resource}`,
        start: startDate,
        end: endDate,
        progress: progress,
        type: 'task',
        project: resource,
        isDisabled: false,
        styles: {
            progressColor: '#F62D40',
            progressSelectedColor: 'white',
            backgroundColor: '#e3e3e3',
            backgroundSelectedColor: '#d1d1d1'
        },
    });
  }

  return tasks;
};

export default function GanttPage() {
  const [tasks] = useState(generateGanttData());
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  return (
    <div className="p-6 flex flex-col h-full">
      <h1 className="text-xl font-bold mb-4">Диаграмма Ганта по платежам</h1>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Масштаб:</span>
        <div className="w-[180px]">
          <Select
            value={viewMode}
            onValueChange={(value) => setViewMode(value as ViewMode)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите масштаб" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ViewMode.Day}>День</SelectItem>
              <SelectItem value={ViewMode.Week}>Неделя</SelectItem>
              <SelectItem value={ViewMode.Month}>Месяц</SelectItem>
              <SelectItem value={ViewMode.Year}>Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full flex-grow relative shadow-md rounded-lg">
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          locale="ru"
          listCellWidth={tasks.some(t => t.progress > 0) ? '155px' : ''}
          ganttHeight={0} // Динамическая высота
          columnWidth={65}
        />
      </div>
    </div>
  );
} 