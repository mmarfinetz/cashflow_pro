import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Icon from 'components/AppIcon';

const SankeyDiagram = ({ data, isFullScreen = false, selectedCategories = [], onCategoryClick }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getNodeColor = (node) => {
    if (node.type === 'income') return '#10B981'; // Primary green
    if (node.type === 'savings') return '#059669'; // Darker green
    
    // Expense categories with distinct colors
    const expenseColors = {
      'operations': '#EF4444',
      'marketing': '#F59E0B', 
      'salaries': '#8B5CF6',
      'utilities': '#06B6D4',
      'office-rent': '#84CC16'
    };
    
    return expenseColors[node.id] || '#6B7280';
  };

  const getLinkColor = (link) => {
    const sourceColor = getNodeColor(link.source);
    return sourceColor + '40'; // Add transparency
  };

  useEffect(() => {
    if (!data || !data.nodes || !data.links) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Set dimensions
    const containerWidth = svgRef.current.parentElement.clientWidth;
    const containerHeight = isFullScreen ? window.innerHeight - 120 : 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    svg
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create sankey generator
    const sankeyGenerator = sankey()
      .nodeWidth(15)
      .nodePadding(20)
      .extent([[0, 0], [width, height]]);

    // Process data
    const sankeyData = sankeyGenerator({
      nodes: data.nodes.map(d => ({ ...d })),
      links: data.links.map(d => ({ ...d }))
    });

    // Create links
    const links = g.append("g")
      .selectAll(".link")
      .data(sankeyData.links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", d => getLinkColor(d))
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.6)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        setHoveredLink(d);
        d3.select(this).attr("opacity", 0.8);
        
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .html(`
            <div class="bg-surface border border-border rounded-lg p-3 elevation-3">
              <div class="font-medium text-text-primary">${d.source.name} → ${d.target.name}</div>
              <div class="text-sm text-text-secondary mt-1">${formatCurrency(d.value)}</div>
              <div class="text-xs text-text-secondary mt-1">${((d.value / d.source.value) * 100).toFixed(1)}% of ${d.source.name}</div>
            </div>
          `);
      })
      .on("mouseout", function(event, d) {
        setHoveredLink(null);
        d3.select(this).attr("opacity", 0.6);
        tooltip.style("opacity", 0);
      });

    // Create nodes
    const nodes = g.append("g")
      .selectAll(".node")
      .data(sankeyData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .style("cursor", "pointer");

    // Node rectangles
    nodes.append("rect")
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => getNodeColor(d))
      .attr("rx", 4)
      .attr("opacity", d => selectedCategories.length === 0 || selectedCategories.includes(d.id) ? 1 : 0.3)
      .on("mouseover", function(event, d) {
        setHoveredNode(d);
        d3.select(this).attr("opacity", 1);
        
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .html(`
            <div class="bg-surface border border-border rounded-lg p-3 elevation-3">
              <div class="font-medium text-text-primary">${d.name}</div>
              <div class="text-sm text-text-secondary mt-1">${formatCurrency(d.value)}</div>
              <div class="text-xs text-text-secondary mt-1 capitalize">${d.type}</div>
            </div>
          `);
      })
      .on("mouseout", function(event, d) {
        setHoveredNode(null);
        d3.select(this).attr("opacity", selectedCategories.length === 0 || selectedCategories.includes(d.id) ? 1 : 0.3);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        if (onCategoryClick) {
          onCategoryClick(d.id);
        }
      });

    // Node labels
    nodes.append("text")
      .attr("x", d => d.x0 < width / 2 ? (d.x1 - d.x0) + 6 : -6)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .attr("font-size", isFullScreen ? "14px" : "12px")
      .attr("font-weight", "500")
      .attr("fill", "var(--color-text-primary)")
      .text(d => d.name);

    // Node values
    nodes.append("text")
      .attr("x", d => d.x0 < width / 2 ? (d.x1 - d.x0) + 6 : -6)
      .attr("y", d => (d.y1 - d.y0) / 2 + 16)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .attr("font-size", isFullScreen ? "12px" : "10px")
      .attr("fill", "var(--color-text-secondary)")
      .text(d => formatCurrency(d.value));

  }, [data, isFullScreen, selectedCategories]);

  if (!data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <Icon name="BarChart3" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full"></svg>
      <div 
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity z-10"
        style={{ position: 'absolute' }}
      ></div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-text-secondary">Income Sources</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-error rounded"></div>
          <span className="text-text-secondary">Expense Categories</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded"></div>
          <span className="text-text-secondary">Net Savings</span>
        </div>
      </div>
    </div>
  );
};

export default SankeyDiagram;