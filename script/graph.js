export function createXpChart(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '600');
    svg.setAttribute('height', '400');
  
    let cumulativeXp = 0;
    const points = data.map((t, i) => {
      cumulativeXp += t.amount;
      return `${50 + i * 50},${350 - cumulativeXp / 100}`;
    }).join(' ');
  
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'blue');
    svg.appendChild(polyline);
  
    return svg;
  }
  
  export function createPassFailChart(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '400');
  
    const passes = data.filter(p => p.grade === 1).length;
    const total = data.length;
    const passPercentage = ((passes / total) * 100).toFixed(1);
  
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '200');
    circle.setAttribute('cy', '200');
    circle.setAttribute('r', '150');
    circle.setAttribute('fill', 'green');
    svg.appendChild(circle);
  
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '200');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.textContent = `${passPercentage}% Pass`;
    svg.appendChild(text);
  
    return svg;
  }