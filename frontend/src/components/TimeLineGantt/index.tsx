'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CellRental } from '@/services/cellRentalsService/cellRentals.types';
import { Timeline, TimelineOptions, TimelineTimeAxisOption, TimelineTimeAxisScaleType } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { addMonths, subMonths, isAfter, isBefore } from 'date-fns';

interface TimelineGanttProps {
    tasks: CellRental[];
}

interface TimelineItem {
    id: string;
    content: string;
    start: string;
    end: string;
    group: string;
    style?: string;
    title?: string;
}

type ViewModeType = 'day' | 'week' | 'month';

const TimelineGantt = ({ tasks }: TimelineGanttProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<Timeline | null>(null);
    const [viewMode, setViewMode] = useState<ViewModeType>('month');
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Вычисляем прогресс аренды
    const calculateProgress = useCallback((rental: CellRental): number => {
        const now = new Date();
        const start = new Date(rental.startDate);
        const end = new Date(rental.endDate);

        if (isBefore(now, start)) return 0;
        if (isAfter(now, end)) return 100;

        const totalDuration = end.getTime() - start.getTime();
        const passedDuration = now.getTime() - start.getTime();

        return Math.round((passedDuration / totalDuration) * 100);
    }, []);

    // Создаем группы
    const groups = useMemo(() => {
        if (!tasks.length) return new DataSet([]);

        const uniqueGroups = new Map();
        tasks.forEach(rental => {
            if (!uniqueGroups.has(rental.cell?.id || '')) {
                uniqueGroups.set(rental.cell?.id || '', {
                    id: rental.cell?.id || '',
                    content: `
                        <div class="group-content">
                            <div class="group-name">${rental.cell?.name || ''}</div>
                            <div class="group-dates">
                                ${new Date(rental.startDate).toLocaleDateString('ru-RU')} - 
                                ${new Date(rental.endDate).toLocaleDateString('ru-RU')}
                            </div>
                        </div>
                    `,
                    order: rental.cell?.name || ''
                });
            }
        });

        return new DataSet(Array.from(uniqueGroups.values()));
    }, [tasks]);

    // Создаем элементы timeline
    const items = useMemo(() => {
        if (!tasks.length) return new DataSet<TimelineItem>([]);

        const timelineItems = tasks.map(rental => {
            const progress = calculateProgress(rental);
            const statusColor = rental.status?.color || '#3B82F6';

            return {
                id: rental.id,
                content: rental.cell?.name || '',
                start: rental.startDate,
                end: rental.endDate,
                group: rental.cell?.id || '',
                style: `background-color: ${statusColor}; border-color: ${statusColor};`,
                title: `${rental.cell?.name || ''} (${progress}%)`
            };
        });

        return new DataSet<TimelineItem>(timelineItems);
    }, [tasks, calculateProgress]);

    const getViewOptions = useCallback((mode: ViewModeType): TimelineOptions => {
        const now = new Date();
        const baseOptions = {
            day: {
                timeAxis: { scale: 'day' as TimelineTimeAxisScaleType, step: 1 },
                format: {
                    minorLabels: {
                        day: 'DD.MM'
                    },
                    majorLabels: {
                        day: 'MMMM YYYY'
                    }
                },
                start: new Date(now.setHours(0, 0, 0, 0)),
                end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                zoomMin: 1000 * 60 * 60 * 24,
                zoomMax: 1000 * 60 * 60 * 24 * 60
            },
            week: {
                timeAxis: { scale: 'week' as TimelineTimeAxisScaleType, step: 1 },
                format: {
                    minorLabels: {
                        day: 'DD.MM'
                    },
                    majorLabels: {
                        day: 'MMMM YYYY'
                    }
                },
                start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                zoomMin: 1000 * 60 * 60 * 24,
                zoomMax: 1000 * 60 * 60 * 24 * 120
            },
            month: {
                timeAxis: { scale: 'day' as TimelineTimeAxisScaleType, step: 7 },
                format: {
                    minorLabels: {
                        day: 'DD.MM'
                    },
                    majorLabels: {
                        day: 'MMMM YYYY'
                    }
                },
                start: subMonths(now, 3),
                end: addMonths(now, 3),
                zoomMin: 1000 * 60 * 60 * 24 * 7,
                zoomMax: 1000 * 60 * 60 * 24 * 365
            }
        };

        return baseOptions[mode];
    }, []);

    // Инициализация Timeline
    useEffect(() => {
        if (!containerRef.current || !tasks.length) return;

        const viewOptions = getViewOptions(viewMode);

        const options: TimelineOptions = {
            ...viewOptions,
            orientation: 'top',
            stack: false,
            showCurrentTime: true,
            height: '100%',
            locale: 'ru',
            verticalScroll: true,
            horizontalScroll: true,
            zoomKey: 'ctrlKey',
            selectable: false,
            editable: false,
            groupOrder: 'order',
            dataAttributes: 'all',
        };

        // Очищаем предыдущий экземпляр
        if (timelineRef.current) {
            timelineRef.current.destroy();
        }

        // Создаем новый Timeline
        timelineRef.current = new Timeline(
            containerRef.current,
            items,
            groups,
            options
        );

        const handleRangeChange = () => {
            if (!timelineRef.current || viewMode !== 'month') return;

            const window = timelineRef.current.getWindow();
            const range = window.end.getTime() - window.start.getTime();
            const days = range / (1000 * 60 * 60 * 24);

            let step = 2;
            if (days > 60) step = 5;
            if (days > 120) step = 10;
            if (days > 180) step = 15;

            timelineRef.current.setOptions({
                timeAxis: {
                    scale: 'day' as TimelineTimeAxisScaleType,
                    step: step
                }
            });
        };



        setTimeout(() => {
            if (timelineRef.current) {
                timelineRef.current.moveTo(new Date(), { animation: false });
            }
        }, 100);

        return () => {
            if (timelineRef.current) {
                timelineRef.current.off('rangechange', handleRangeChange);
                timelineRef.current.destroy();
                timelineRef.current = null;
            }
        };
    }, [tasks, groups, items, viewMode, getViewOptions]);

    // Перетаскивание без анимации
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return; // только левая кнопка мыши
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !timelineRef.current) return;

        const deltaX = e.clientX - dragStart.x;

        if (Math.abs(deltaX) > 3) { // уменьшили чувствительность
            const window = timelineRef.current.getWindow();
            const range = window.end.getTime() - window.start.getTime();
            const moveTime = (deltaX / containerRef.current!.clientWidth) * range * 0.5; // уменьшили скорость

            const newStart = new Date(window.start.getTime() - moveTime);
            const newEnd = new Date(window.end.getTime() - moveTime);

            timelineRef.current.setWindow(newStart, newEnd, { animation: false });
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Глобальные обработчики
    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                handleMouseMove(e as any);
            };

            const handleGlobalMouseUp = () => {
                setIsDragging(false);
            };

            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove);
                document.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    // Навигация
    const scrollToToday = useCallback(() => {
        if (timelineRef.current) {
            timelineRef.current.moveTo(new Date(), { animation: true });
        }
    }, []);

    const handleScroll = useCallback((direction: 'left' | 'right') => {
        if (!timelineRef.current) return;

        const window = timelineRef.current.getWindow();
        const range = window.end.getTime() - window.start.getTime();
        const moveTime = range * 0.3;

        const newStart = new Date(window.start.getTime() + (direction === 'left' ? -moveTime : moveTime));
        const newEnd = new Date(window.end.getTime() + (direction === 'left' ? -moveTime : moveTime));

        timelineRef.current.setWindow(newStart, newEnd, { animation: true });
    }, []);

    // Зум
    const handleZoom = useCallback((direction: 'in' | 'out') => {
        if (!timelineRef.current) return;

        const zoomPercentage = direction === 'in' ? 0.8 : 1.25;
        const window = timelineRef.current.getWindow();
        const center = new Date((window.start.getTime() + window.end.getTime()) / 2);
        const range = window.end.getTime() - window.start.getTime();
        const newRange = range * zoomPercentage;

        const newStart = new Date(center.getTime() - newRange / 2);
        const newEnd = new Date(center.getTime() + newRange / 2);

        timelineRef.current.setWindow(newStart, newEnd, { animation: true });
    }, []);

    const handleViewModeChange = useCallback((mode: ViewModeType) => {
        setViewMode(mode);
    }, []);

    return (
        <div className="timeline-gantt">
            {/* Панель управления */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">График занятости ячеек</h1>

                <div className="flex items-center gap-4">
                    {/* Навигация */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleScroll('left')}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={scrollToToday} size="sm">
                            Сегодня
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleScroll('right')}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Режимы отображения */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                        {(['day', 'week', 'month'] as ViewModeType[]).map(mode => (
                            <Button
                                key={mode}
                                variant={viewMode === mode ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewModeChange(mode)}
                                className="text-xs"
                            >
                                {mode === 'day' && 'День'}
                                {mode === 'week' && 'Неделя'}
                                {mode === 'month' && 'Месяц'}
                            </Button>
                        ))}
                    </div>

                    {/* Зум */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleZoom('in')}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleZoom('out')}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Timeline контейнер */}
            <div className="timeline-wrapper">
                <div
                    ref={containerRef}
                    className={`timeline-container ${isDragging ? 'dragging' : ''}`}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                />
            </div>

            <style jsx global>{`
        .timeline-gantt {
          height: calc(100vh - 120px);
          background: white;
          border-radius: 8px;
          padding: 20px;
        }
        
        .timeline-wrapper {
          height: calc(100% - 60px);
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .timeline-container {
          height: 100%;
          width: 100%;
        }

        .timeline-container.dragging {
          user-select: none;
          -webkit-user-select: none;
        }

        /* Отключаем анимации при перетаскивании */
        .timeline-container.dragging .vis-item,
        .timeline-container.dragging .vis-label {
          transition: none !important;
        }

        .vis-timeline {
          border: none;
          font-family: inherit;
        }

        .vis-item {
          border-radius: 4px;
          border-width: 1px;
          font-size: 12px;
          color: white;
          font-weight: 500;
        }

        .vis-labelset .vis-label {
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          color: #1e293b;
          font-weight: 500;
          font-size: 12px;
        }

        .vis-labelset .vis-label .group-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .vis-labelset .vis-label .group-name {
            font-weight: 500;
        }

        .vis-labelset .vis-label .group-dates {
            font-size: 11px;
            color: #64748b;
        }

        .vis-current-time {
          background-color: #3b82f6;
          width: 2px;
          z-index: 9;
        }

        .vis-grid.vis-vertical {
          border-color: #f1f5f9;
        }

        .vis-grid.vis-major {
          border-color: #e2e8f0;
        }
      `}</style>
        </div>
    );
};

export default TimelineGantt;