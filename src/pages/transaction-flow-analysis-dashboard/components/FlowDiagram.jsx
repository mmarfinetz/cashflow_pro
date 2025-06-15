// src/pages/transaction-flow-analysis-dashboard/components/FlowDiagram.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Icon from 'components/AppIcon';

const FlowDiagram = ({ data, isLoading, isFullScreen, viewMode }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

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
      'housing': '#EF4444',
      'transportation': '#F59E0B', 
      'food': '#8B5CF6',
      'shopping': '#06B6D4',
      'healthcare': '#84CC16',
      'entertainment': '#EC4899'
    };
    
    return expenseColors[node.id] || '#6B7280';
  };

  const getLinkColor = (link, isHighlighted) => {
    const sourceColor = typeof link.source === 'object' 
      ? getNodeColor(link.source)
      : getNodeColor({ id: link.source, type: 'income' });
    
    return sourceColor + (isHighlighted ? '90' : '40'); // Add transparency
  };

  const getNodeLabel = (node) => {
    if (viewMode === 'simple') {
      // For simple view, just return the name
      return node.name;
    } else {
      // For detailed view, return name and value
      return `${node.name} (${formatCurrency(node.value)})`;
    }
  };

  const isPathSelected = (link) => {
    if (!selectedPath) return false;
    
    const linkSourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const linkTargetId = typeof link.target === 'object' ? link.target.id : link.target;
    
    return (
      (selectedPath.source === linkSourceId && selectedPath.target === linkTargetId) ||
      (selectedPath.source === linkTargetId && selectedPath.target === linkSourceId)
    );
  };

  useEffect(() => {
    if (!data || !data.nodes || !data.links || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    
    // Clear previous content
    svg.selectAll("*").remove();
    
    // Set dimensions
    const containerWidth = svgRef.current.parentElement.clientWidth;
    const containerHeight = isFullScreen ? window.innerHeight - 120 : 500;
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
      .nodeWidth(viewMode === 'simple' ? 10 : 20)
      .nodePadding(viewMode === 'simple' ? 10 : 30)
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
      .attr("stroke", d => getLinkColor(d, isPathSelected(d)))
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", d => isPathSelected(d) ? 0.9 : 0.6)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        setHoveredLink(d);
        d3.select(this).attr("opacity", 0.9);
        d3.select(this).attr("stroke", getLinkColor(d, true));
        
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
        d3.select(this).attr("opacity", isPathSelected(d) ? 0.9 : 0.6);
        d3.select(this).attr("stroke", getLinkColor(d, isPathSelected(d)));
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, d) {
        event.stopPropagation(); // Prevent click from bubbling to SVG
        const linkSourceId = typeof d.source === 'object' ? d.source.id : d.source;
        const linkTargetId = typeof d.target === 'object' ? d.target.id : d.target;
        
        if (selectedPath && selectedPath.source === linkSourceId && selectedPath.target === linkTargetId) {
          // If clicking on already selected path, deselect it
          setSelectedPath(null);
        } else {
          // Otherwise, select this path
          setSelectedPath({
            source: linkSourceId,
            target: linkTargetId
          });
        }
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
      .attr("opacity", 0.9)
      .on("mouseover", function(event, d) {
        setHoveredNode(d);
        d3.select(this).attr("opacity", 1);
        
        // Highlight all connected links
        svg.selectAll(".link").attr("opacity", link => {
          const linkSourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const linkTargetId = typeof link.target === 'object' ? link.target.id : link.target;
          
          if (linkSourceId === d.id || linkTargetId === d.id) {
            return 0.9;
          } else {
            return isPathSelected(link) ? 0.9 : 0.3;
          }
        });
        
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .html(`
            <div class="bg-surface border border-border rounded-lg p-3 elevation-3">
              <div class="font-medium text-text-primary">${d.name}</div>
              <div class="text-sm text-text-secondary mt-1">${formatCurrency(d.value)}</div>
              <div class="text-xs text-text-secondary mt-1 capitalize">${d.type}</div>
              ${d.type === 'income' ? 
                `<div class="text-xs text-success mt-1">Source of funds</div>` :
                d.type === 'expense' ? 
                `<div class="text-xs text-error mt-1">Use of funds</div>` :
                `<div class="text-xs text-primary mt-1">Net savings</div>`
              }
            </div>
          `);
      })
      .on("mouseout", function(event, d) {
        setHoveredNode(null);
        d3.select(this).attr("opacity", 0.9);
        
        // Restore link opacity
        svg.selectAll(".link").attr("opacity", link => {
          return isPathSelected(link) ? 0.9 : 0.6;
        });
        
        tooltip.style("opacity", 0);
      });

    // Node labels
    if (viewMode !== 'simple' || isFullScreen) {
      nodes.append("text")
        .attr("x", d => d.x0 < width / 2 ? (d.x1 - d.x0) + 6 : -6)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .attr("font-size", isFullScreen ? "14px" : "12px")
        .attr("font-weight", "500")
        .attr("fill", "var(--color-text-primary)")
        .text(d => getNodeLabel(d));

      // Node values (only in detailed view)
      if (viewMode === 'detailed') {
        nodes.append("text")
          .attr("x", d => d.x0 < width / 2 ? (d.x1 - d.x0) + 6 : -6)
          .attr("y", d => (d.y1 - d.y0) / 2 + 16)
          .attr("dy", "0.35em")
          .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
          .attr("font-size", isFullScreen ? "12px" : "10px")
          .attr("fill", "var(--color-text-secondary)")
          .text(d => `${((d.value / d3.sum(data.nodes.filter(n => n.type === d.type), n => n.value)) * 100).toFixed(1)}%`);
      }
    }

    // Add click handler to the svg to deselect path when clicking on empty space
    svg.on("click", () => {
      setSelectedPath(null);
    });

  }, [data, isFullScreen, viewMode, selectedPath]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-surface p-6">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Icon name="Loader" size={48} className="text-primary mx-auto" />
          </div>
          <p className="text-text-secondary">Loading transaction flow data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-surface p-6">
        <div className="text-center">
          <Icon name="GitBranch" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary mb-2">No transaction flow data available</p>
          <p className="text-sm text-text-tertiary">Try adjusting your filters or date range</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
      <div 
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity z-10"
        style={{ position: 'absolute' }}
      ></div>
      
      {/* Legend - Only visible when not in fullscreen or simple mode */}
      {(!isFullScreen || viewMode !== 'simple') && (
        <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-sm p-3 rounded-lg border border-border">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-text-secondary">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-text-secondary">Expenses</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-600 rounded"></div>
              <span className="text-text-secondary">Savings</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowDiagram;