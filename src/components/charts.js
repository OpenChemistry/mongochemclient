import React, { Component } from 'react';
import { findDOMNode } from 'react-dom'
import d3 from 'd3'
import './charts.css'

export default class VibrationalModesChart extends Component {

  render () {
    return <svg width='100%' height='100%' />
  }

  componentDidMount () {
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickFormat(d3.format('.0f'));

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient('left')
      .tickFormat(d3.format('.2f'));


    this.svg = d3.select(findDOMNode(this))
    this.svg = this.svg.append('g');

    this.svg.append('g')
      .attr('class', 'x axis');

    this.svg.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);

    this.xLabel = this.svg.append('text')
      .attr('text-anchor', 'middle')
      .html('Frequency (cm\u207B\u00B9)');

    this.yLabel = this.svg.append('text')
      .attr('text-anchor', 'middle')
      .text('Intensity');

    window.addEventListener("resize", this.renderChart.bind(this));

    this.renderChart();

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.renderChart.bind(this));
  }

  componentDidUpdate () {
    this.renderChart();
  }

  renderChart () {
    // If we are not passed data then this is for resize so use
    // cached data...
    let data = this.props.data;

    if (!data) {
      data = this.data;
    }

    // Save the data for resize events
    this.data = this.props.data;

    if (!this.props.data) {
      return;
    }

    var element = findDOMNode(this), frequencyRange = [0, d3.max(data.frequencies) * 1.1],
      intensityRange = [0, d3.max(data.intensities)],
      that = this, width = element.clientWidth,
      height = element.clientHeight;

    //width = this.props.width;
    //height = this.props.height;

    if (width === 0 || height === 0) {
      return;
    }

    this.margin = {top: 30, right: 30, bottom: 70, left: 80};

    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    this.svg.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x.domain(frequencyRange)
      .range([0, this.width]);
    this.y.domain(intensityRange)
      .range([this.height, 0]);

    this.svg.select('.x.axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .transition().duration(200).ease('sin-in-out')
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)' );

    this.svg.select('.y.axis')
      .transition().duration(200).ease('sin-in-out')
      .call(this.yAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dy', '.5em');

    let chartData = [];

    for(let i = 0; i < data.intensities.length; i++) {
      chartData.push({
        'index': i,
        'frequency': data.frequencies[i],
        'intensity': data.intensities[i],
        'mode': data.modes[i]
      });
    }

    var bars = this.svg.selectAll('.bar')
      .data(chartData);

    var g = bars.enter()
      .append('g')
      .attr('class', 'bar');

    g.append('rect')
      .on('mouseover', (data) => {
        if (this.props.mouseoverbar) {
          this.props.mouseoverbar(data);
        }
      })
      .on('click', (data) => {
        if(this.props.clickbar) {
          this.props.clickbar(data);
        }
        that.selectedBar(data.index);
      });

    const barWidth = 4;

    bars.transition()
      .duration(1000)
      .ease('cubic-in-out')
      .attr('transform', (d) => 'translate(' + (this.x(d.frequency) - barWidth/2) + ',' + this.y(d.intensity) + ')')
      .select('rect')
      .attr('width', barWidth)
      .attr('height', (d) => this.height - this.y(d.intensity));

    bars.exit().transition().style({opacity: 0}).remove();

    let lineFreqData = this.generateLine(data, frequencyRange, intensityRange, 40);

    const lineFunc = d3.svg.line()
      .x((d) => this.x(d.x))
      .y((d) => this.y(d.y))
      .interpolate('linear');

    let line = this.svg.select('.line');
    if (line.empty()) {
      line = this.svg.append('svg:path');
      line.attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('class', 'line');
    }

    if (data.experiment) {
      let measuredSpectrum = data.experiment.measuredSpectrum;
      let experimentalLineData = [];
      let frequencies = measuredSpectrum.frequencies.values;
      let intensities = measuredSpectrum.intensities.values;
      let maxIntensityCalculated = intensityRange[1];
      let maxIntensityExperiment = d3.max(intensities);
      let scaleFactor = maxIntensityCalculated /  maxIntensityExperiment;

      for (let i = 0; i < frequencies.length; ++i) {
        experimentalLineData.push({
          'x': frequencies[i],
          'y': intensities[i] * scaleFactor,
        });
      }

      let dragStart = null;
      let experimentalScaleFactor = 1;
      let experimentalLine = this.svg.select('.experimental-line');
      if (experimentalLine.empty()) {
        experimentalLine = this.svg.append('svg:path');
        experimentalLine.attr('stroke', '#74C365')
          .attr('stroke-width', 4)
          .attr('fill', 'none')
          .attr('class', 'experimental-line');
      }

      const expFreqRange = [d3.min(frequencies) * 0.95,
                              d3.max(frequencies) * 1.05];
      this.x.domain(expFreqRange)
        .range([0, this.width]);
      this.svg.select('.x.axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .transition().duration(200).ease('sin-in-out')
        .call(this.xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '-.55em')
        .attr('transform', 'rotate(-90)' );
      bars.transition()
        .duration(1000)
        .ease('cubic-in-out')
        .attr('transform', (d) => 'translate(' + (this.x(d.frequency) - barWidth/2) + ',' + this.y(d.intensity) + ')')
        .select('rect')
        .attr('width', barWidth)
        .attr('height', (d) => this.height - this.y(d.intensity));

      lineFreqData = this.generateLine(data, expFreqRange, intensityRange, 5);

      const numberOfPoints = 400;
      var expDrag = d3.behavior.drag().on('drag', () => {
        var pixelDelta = d3.event.sourceEvent.pageY - dragStart,
        pixelY = d3.event.y, pixelYStart = pixelY - pixelDelta,
        intensityStart = this.y.invert(pixelYStart),
        intensity = this.y.invert(pixelY);

        // Calculate scale factor
        if (intensityStart > 0) {
          experimentalScaleFactor = intensity / intensityStart;
        }

        experimentalScaleFactor = Math.max(0.01, experimentalScaleFactor);

        experimentalLine.attr('d', experimentalLineFunc(experimentalLineData));
      }).on('dragstart', () => {
        dragStart = d3.event.sourceEvent.pageY;
      }).on('dragend', () => {
        for (let i = 0; i < numberOfPoints; ++i) {
          experimentalLineData[i].y = experimentalLineData[i].y * experimentalScaleFactor;
        }
      });

      experimentalLine.call(expDrag);

      var experimentalLineFunc = d3.svg.line()
        .x((d) => this.x(d.x))
        .y((d) => this.y(d.y))
        .interpolate('linear');

      experimentalLine.attr('d', experimentalLineFunc(experimentalLineData));
    }
    else {
      this.svg.select('.experimental-line').remove();
    }

    line.attr('d', lineFunc(lineFreqData));

    this.xLabel.attr('transform', 'translate('+ (this.width/2) +','+(this.height + 65)+')');
    this.yLabel.attr('transform', 'translate(-60,'+(this.height/2)+')rotate(-90)');
  }

  generateLine (data, frequencyRange, intensityRange, gamma) {
    var freqRange = [ 0.0, 0.0 ];
    var prefactor = gamma / 3.14;
    var lineFreqData = [];
    var numberOfPoints = 400;
    let increment = (frequencyRange[1] - frequencyRange[0]) / (numberOfPoints - 1);
    for (let i = 0; i < numberOfPoints; ++i) {
      let freqIntensity = 0.0;
      let currentFreq = frequencyRange[0] + i * increment;
      for (let j = 0; j < data.intensities.length; ++j) {
        let xx0 = currentFreq - data.frequencies[j];
        freqIntensity += prefactor * data.intensities[j] / (xx0*xx0 + gamma*gamma);
      }
      if (freqIntensity > freqRange[1]) {
        freqRange[1] = freqIntensity;
      }
      lineFreqData.push({
        'x': currentFreq,
        'y': freqIntensity
      });
    }
    let normalization = intensityRange[1] / freqRange[1];
    for (let i = 0; i < numberOfPoints; ++i) {
      lineFreqData[i].y = lineFreqData[i].y * normalization;
    }

    return lineFreqData;
  }

  selectedBar(index) {
    // TODO The must be a better way todo this selec
    const bars = this.svg.selectAll('.bar');
    bars.classed('selected', false);

    if (index > 0) {
      d3.select(bars[0][index]).classed('selected', true);
    }
  }
}

VibrationalModesChart.propTypes = {
  data: PropTypes.object,
}

VibrationalModesChart.defaultProps = {
  data: null
}


//var VibrationalModesChart = function(element, options) {
//
//
//  this.hide = function(hide) {
//      if (hide) {
//          _svg.attr('hide', true);
//      }
//      else {
//          _svg.attr('hide', null);
//      }
//  };
//
//  init();
//
//  return this;
//};
//
//

//angular.module('mongochemApp')
//  .directive('mongochemVibrationalModesChart', ['$rootScope', '$timeout', '$window',
//  function($rootScope, $timeout, $window) {
//      return {
//          restrict: 'EA',
//          scope: {
//              data: '='
//          },
//          link: function(scope, element) {
//
//              var histogram = null;
//              var renderTimeout;
//
//              function render(data) {
//                  if (d3.select(element).node().offsetWidth === 0) {
//                      if (histogram) {
//                          histogram.hide(true);
//                      }
//                      return;
//                  }
//                  if (renderTimeout) {
//                      clearTimeout(renderTimeout);
//                  }
//
//                  if (!histogram) {
//                      var options = {};
//
//                      options.mouseoverbar = function(bar) {
//                          $rootScope.$broadcast('mongochem-frequency-histogram-mouseoverbar', bar);
//                      };
//
//                      options.clickbar = function(bar) {
//                          $rootScope.$broadcast('mongochem-frequency-histogram-clickbar', bar);
//                      };
//
//                      histogram = new VibrationalModesChart(element[0], options);
//
//                      $rootScope.$on('mongochem-frequency-histogram-selectbar', function(evt, index) {
//                          histogram.selectedBar(index);
//                      });
//                  }
//
//                  renderTimeout = $timeout(function() {
//                      histogram.hide(false);
//                      histogram.render(data);
//                  }, 200);
//              }
//
//              // watch for data changes
//              scope.$watch('data', function(newData) {
//                  return render(newData);
//              }, true);
//
//              angular.element($window).bind('resize', function() {
//                  render();
//              });
//         }
//      };
//  }]);
//});
