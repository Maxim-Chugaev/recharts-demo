import rawData from '../../data.json';

export interface Variation {
    id: string;
    name: string;
}

export interface RawDataPoint {
    date: string;
    visits: Record<string, number>;
    conversions: Record<string, number>;
}

export interface ChartDataPoint {
    date: string;
    [key: string]: number | string;
}

export type TimeFrame = 'day' | 'week';

const getVariationId = (v: { id?: number; name: string }): string => {
    if (v.name === 'Original') return '0';
    return v.id?.toString() || '';
};

export const variations: Variation[] = rawData.variations.map((v) => ({
    id: getVariationId(v),
    name: v.name,
}));

export const getChartData = (timeFrame: TimeFrame): ChartDataPoint[] => {
    const data = rawData.data as RawDataPoint[];

    if (timeFrame === 'day') {
        return data.map((day) => {
            const point: ChartDataPoint = { date: day.date };
            variations.forEach((v) => {
                const visits = day.visits[v.id] || 0;
                const conversions = day.conversions[v.id] || 0;
                point[v.id] = visits > 0 ? (conversions / visits) * 100 : 0;
            });
            return point;
        });
    } else {
        // Weekly aggregation
        const weeklyData: Record<string, { visits: Record<string, number>; conversions: Record<string, number>; startDate: string }> = {};

        data.forEach((day) => {
            // Weekly aggregation: Group by week starting Sunday
            const dateObj = new Date(day.date);
            const startOfWeek = new Date(dateObj);
            startOfWeek.setDate(dateObj.getDate() - dateObj.getDay());
            const weekKey = startOfWeek.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = {
                    visits: {},
                    conversions: {},
                    startDate: weekKey
                };
            }

            variations.forEach(v => {
                weeklyData[weekKey].visits[v.id] = (weeklyData[weekKey].visits[v.id] || 0) + (day.visits[v.id] || 0);
                weeklyData[weekKey].conversions[v.id] = (weeklyData[weekKey].conversions[v.id] || 0) + (day.conversions[v.id] || 0);
            });
        });

        return Object.values(weeklyData).sort((a, b) => a.startDate.localeCompare(b.startDate)).map(week => {
            const point: ChartDataPoint = { date: week.startDate };
            variations.forEach(v => {
                const visits = week.visits[v.id] || 0;
                const conversions = week.conversions[v.id] || 0;
                point[v.id] = visits > 0 ? (conversions / visits) * 100 : 0;
            });
            return point;
        });
    }
};
