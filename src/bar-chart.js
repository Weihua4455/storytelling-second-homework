import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, height])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#7fc97f',
    '#beaed4',
    '#fdc086',
    '#ffff99',
    '#386cb0',
    '#f0027f',
    '#bf5b17'
  ])
d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('height', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('width', 5)
    .attr('fill', 'yellow')
    .attr('class', d => {
      return d.continent
    })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', 'yellow')
  })

  // Let's define low GDP countries as
  // couries whose per-capita GDP is less than
  // $4,000
  d3.select('#low-gdp').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 4000) {
        return 'orange'
      } else {
        return 'yellow'
      }
    })
  })
  d3.select('#africa').on('click', function() {
    svg.selectAll('rect').attr('fill', 'yellow')
    svg.selectAll('.Africa').attr('fill', 'orange')
  })

  d3.select('#asia').on('click', function() {
    svg.selectAll('rect').attr('fill', 'yellow')
    svg.selectAll('.Asia').attr('fill', 'orange')
  })

  d3.select('#by-continent').on('click', function() {
    svg.selectAll('rect').attr('fill', d => {
      return colorScale(d.continent)
    })
  })
  d3.select('#north-america').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return 'orange'
      } else {
        return 'yellow'
      }
    })
  })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
