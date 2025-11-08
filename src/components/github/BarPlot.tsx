import { useMemo } from 'react';
import * as d3 from 'd3';

const MARGIN = { top: 0, right: 1, bottom: 0, left: 1 };
const BAR_PADDING = 0.2;

type BarPlotProps = {
    width?: number;
    height?: number;
    data: {
        title: string;
        total: number;
        closed: number;
        blocked: number;
        testing: number;
    }[];
    categoryFilter: string;
    setCategoryFilter: (valueIn: string) => void; // eslint-disable-line
};

export const BarPlot = ({
    width = 700,
    height = 400,
    data,
    categoryFilter,
    setCategoryFilter,
}: BarPlotProps) => {
    // bounds = area inside the graph axis = calculated by subtracting the margins
    if (data.length < 2) {
        height *= 0.25;
    } else if (data.length < 5) {
        height *= 0.5;
    }
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    // Y axis is for groups since the barPlot is horizontal
    const groups = data.sort((a, b) => b.total - a.total).map((d) => d.title);
    const yScale = useMemo(() => {
        return d3
            .scaleBand()
            .domain(groups)
            .range([0, boundsHeight])
            .padding(BAR_PADDING);
    }, [boundsHeight, groups]);

    // X axis

    const xScale = useMemo(() => {
        // eslint-disable-next-line
        const [min, max] = d3.extent(data.map((d) => d.total));
        return d3
            .scaleLinear()
            .domain([0, max || 10])
            .range([0, boundsWidth]);
    }, [data, boundsWidth]);

    // Build the shapes
    const allShapes = data.map((d, i) => {
        const y = yScale(d.title);
        if (y === undefined) {
            return null;
        }
        return (
            <g
                key={i}
                onClick={() => {
                    if (categoryFilter === d.title) {
                        setCategoryFilter('');
                    } else {
                        setCategoryFilter(d.title || '');
                    }
                }}
                className=" cursor-pointer hover:brightness-110 transition"
            >
                <rect
                    x={xScale(0 + d.closed + d.testing)}
                    y={yScale(d.title)}
                    width={xScale(d.total - d.blocked - d.closed - d.testing)}
                    height={yScale.bandwidth()}
                    opacity={1}
                    fillOpacity={1}
                    strokeWidth={1}
                    rx={1}
                    className="fill-green-300 stroke-black"
                />
                <rect
                    x={xScale(d.total - d.blocked)}
                    y={yScale(d.title)}
                    width={xScale(d.blocked)}
                    height={yScale.bandwidth()}
                    opacity={1}
                    className="fill-pink-300 stroke-black"
                    fillOpacity={1}
                    strokeWidth={1}
                    rx={1}
                />
                <rect
                    x={xScale(0)}
                    y={yScale(d.title)}
                    width={xScale(d.closed)}
                    height={yScale.bandwidth()}
                    opacity={1}
                    className="fill-blue-300 stroke-black"
                    fillOpacity={1}
                    strokeWidth={1}
                    rx={1}
                />
                <rect
                    x={xScale(0 + d.closed)}
                    y={yScale(d.title)}
                    width={xScale(d.testing)}
                    height={yScale.bandwidth()}
                    opacity={1}
                    className="fill-neutral-300 stroke-black"
                    fillOpacity={1}
                    strokeWidth={1}
                    rx={1}
                />
            </g>
        );
    });

    const titles = data.map((d, i) => {
        const y = yScale(d.title);
        if (y === undefined) {
            return null;
        }

        return (
            <g key={i}>
                <text
                    x={0}
                    y={y + yScale.bandwidth() / 2}
                    textAnchor="start"
                    alignmentBaseline="central"
                    fontSize={12}
                    fontWeight={'light'}
                    onClick={() => {
                        if (categoryFilter === d.title) {
                            setCategoryFilter('');
                        } else {
                            setCategoryFilter(d.title || '');
                        }
                    }}
                    className=" cursor-pointer dark:hover:fill-white hover:fill-black transition"
                >
                    {`${d.title} (${d.closed}/${d.total})`}
                </text>
            </g>
        );
    });

    return (
        <div className="w-full h-auto fill-neutral-500 dark:fill-neutral-400">
            <svg
                width={`${(225 / (width + 225)) * 100}%`}
                height="100%"
                viewBox={`0 0 ${225} ${height}`}
            >
                {' '}
                {titles}
            </svg>
            <svg
                width={`${(width / (width + 225)) * 100}%`}
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
            >
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
                >
                    {allShapes}
                </g>
            </svg>
        </div>
    );
};
