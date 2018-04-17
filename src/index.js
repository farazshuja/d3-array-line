import * as d3 from 'd3';
import shuffle from 'shuffle-array';
import styles from './css/styles.css';

// adjust width/height and margins of the graph
const svgWidth = 960;
const svgHeight = 400;
const margin = { top: 50, right: 100, bottom: 100, left: 80 };

// creating the main svg
const svg = d3.select('#graph')
  .append('svg')
  .attr('id', 'chart')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// graph area to show lines and axis
const g = svg.append("g")
  .attr('class', 'graph-area')
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let current_index = 0;
let range = 30; // show 30 points at a time
function initAPI() {
  const data = shuffle(d3.range(0, 1000));
  
  updateGraph(data);

}

function updateGraph(data) {
  console.log(data);
  const data_in_range = data.slice(current_index, (current_index + range));
  console.log(data_in_range);
    
  const x = d3.scaleLinear()
    .domain([0, range])
    .range([0, svgWidth - margin.right]);

  const scaleX = d3.scaleLinear()
    .domain([current_index, current_index + range])
    .range([0, svgWidth - margin.right]);

  const scaleY = d3.scaleLinear()
    .domain([0, d3.max(data_in_range)])
    .range([svgHeight - margin.bottom, 0]);

  d3.selectAll('.axis').remove();
  d3.selectAll('.lines').remove();
  
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${svgHeight - margin.bottom})`)
    .call(d3.axisBottom(scaleX));

  g.append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(0, 0)`)
    .call(d3.axisLeft(scaleY).ticks(8));

    
  const line = d3.line()
    .x((d, i) => x(i))
    .y(d => scaleY(d));
  
  const lineG = g.append('g').attr('class', 'lines');
  const linePath = lineG.append('path')
    .attr('d', line(data_in_range))
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  setTimeout(() => {
    current_index++;
    if((current_index + range) <= data.length) {
      updateGraph(data)
    }    
  }, 1000);
  
}



initAPI();


