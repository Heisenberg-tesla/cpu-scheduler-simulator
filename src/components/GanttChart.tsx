import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Selection } from 'd3';
import { GanttChartBlock } from '../utils/types';

type D3Selection = Selection<any, any, any, any>;

interface GanttChartProps {
    data: GanttChartBlock[];
    width?: number;
    height?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ data, width = 800, height = 200 }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data.length || !svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 50, bottom: 40, left: 60 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const chart = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales with padding
        const timeScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.endTime) || 0])
            .range([0, chartWidth])
            .nice(); // Round to nice numbers

        const uniqueProcessIds = Array.from(new Set(data.map(d => d.processId)));
        const processScale = d3.scaleBand()
            .domain(uniqueProcessIds)
            .range([0, chartHeight])
            .padding(0.3); // Increase padding between bars

        // Add grid lines
        chart.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .attr('transform', `translate(0,${chartHeight})`)
            .call(
                d3.axisBottom(timeScale)
                    .tickSize(-chartHeight)
                    .tickFormat(() => '')
            );

        // Add axes with improved styling
        const xAxis = d3.axisBottom(timeScale)
            .tickFormat(d => d.toString())
            .ticks(10);

        const yAxis = d3.axisLeft(processScale);

        chart.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(xAxis)
            .append('text')
            .attr('class', 'axis-label')
            .attr('x', chartWidth / 2)
            .attr('y', 35)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Time Units');

        chart.append('g')
            .attr('class', 'y-axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('x', -chartHeight / 2)
            .attr('y', -45)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Process ID');

        // Add Gantt blocks with animations
        const blocks = chart.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d: GanttChartBlock) => timeScale(d.startTime))
            .attr('y', (d: GanttChartBlock) => processScale(d.processId) || 0)
            .attr('width', 0) // Start with width 0 for animation
            .attr('height', processScale.bandwidth())
            .attr('fill', (d: GanttChartBlock) => d.color)
            .attr('rx', 4)
            .attr('ry', 4)
            .style('filter', 'drop-shadow(2px 2px 2px rgba(0,0,0,0.1))');

        // Animate blocks
        blocks.transition()
            .duration(750)
            .attr('width', (d: GanttChartBlock) => timeScale(d.endTime) - timeScale(d.startTime));

        // Add tooltips with more information
        blocks.append('title')
            .text((d: GanttChartBlock) => {
                return `Process: ${d.processId}
Start Time: ${d.startTime}
End Time: ${d.endTime}
Duration: ${d.endTime - d.startTime}`;
            });

        // Add time labels with better positioning and contrast
        const labels = chart.selectAll('.time-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'time-label')
            .attr('x', (d: GanttChartBlock) => timeScale(d.startTime) + (timeScale(d.endTime) - timeScale(d.startTime)) / 2)
            .attr('y', (d: GanttChartBlock) => (processScale(d.processId) || 0) + processScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .style('pointer-events', 'none')
            .style('text-shadow', '1px 1px 1px rgba(0,0,0,0.3)')
            .text((d: GanttChartBlock) => d.endTime - d.startTime);

        // Fade in labels
        labels.style('opacity', 0)
            .transition()
            .delay(750) // Wait for blocks animation
            .duration(500)
            .style('opacity', 1);

    }, [data, width, height]);

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
            <svg ref={svgRef} className="gantt-chart w-full"></svg>
        </div>
    );
};

export default GanttChart;
