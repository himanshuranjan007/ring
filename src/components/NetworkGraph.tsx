
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type NetworkGraphProps = {
  className?: string;
  nodeCount?: number;
  lineCount?: number;
};

export default function NetworkGraph({ 
  className, 
  nodeCount = 20,
  lineCount = 15 
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Clear any existing nodes and lines
    container.innerHTML = '';
    
    // Create network nodes
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'network-node';
      
      // Random position
      const left = Math.random() * containerWidth;
      const top = Math.random() * containerHeight;
      
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      
      // Add active class to some nodes
      if (Math.random() > 0.7) {
        node.classList.add('node-active');
        node.style.animation = `node-pulse ${2 + Math.random() * 3}s infinite ease-in-out`;
        node.style.animationDelay = `${Math.random() * 2}s`;
      }
      
      container.appendChild(node);
    }
    
    // Create network lines
    const nodes = container.querySelectorAll('.network-node');
    
    for (let i = 0; i < lineCount; i++) {
      // Select two random nodes
      const nodeIndex1 = Math.floor(Math.random() * nodes.length);
      let nodeIndex2 = Math.floor(Math.random() * nodes.length);
      
      // Ensure different nodes
      while (nodeIndex2 === nodeIndex1) {
        nodeIndex2 = Math.floor(Math.random() * nodes.length);
      }
      
      const node1 = nodes[nodeIndex1] as HTMLElement;
      const node2 = nodes[nodeIndex2] as HTMLElement;
      
      const n1x = parseInt(node1.style.left);
      const n1y = parseInt(node1.style.top);
      const n2x = parseInt(node2.style.left);
      const n2y = parseInt(node2.style.top);
      
      // Calculate line length and angle
      const length = Math.sqrt(Math.pow(n2x - n1x, 2) + Math.pow(n2y - n1y, 2));
      const angle = Math.atan2(n2y - n1y, n2x - n1x) * (180 / Math.PI);
      
      // Create line
      const line = document.createElement('div');
      line.className = 'network-line';
      
      // Randomly select line color
      const colorRand = Math.random();
      if (colorRand < 0.6) {
        line.classList.add('network-line-green');
      } else if (colorRand < 0.8) {
        line.classList.add('network-line-red');
      } else {
        line.classList.add('network-line-blue');
      }
      
      line.style.width = `${length}px`;
      line.style.left = `${n1x + 3}px`;  // +3 for node center offset
      line.style.top = `${n1y + 3}px`;   // +3 for node center offset
      line.style.transform = `rotate(${angle}deg)`;
      line.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(line);
    }
    
    return () => {
      container.innerHTML = '';
    };
  }, [nodeCount, lineCount]);
  
  return (
    <div ref={containerRef} className={cn("w-full h-full", className)}></div>
  );
}
