require.ensure(['d3'], function(require) {
    var d3 = require('d3');

    var VibrationalModesChart = function(element, options) {

        if (!(this instanceof VibrationalModesChart)) {
            return new VibrationalModesChart(element);
        }

        var _svg = null,
            _width = null,
            _height = null,
            _x = null,
            _y = null,
            _xAxis = null,
            _yAxis = null,
            _margin,
            _xLabel = null,
            _yLabel = null,
            _data = null;


        function init() {
            _x = d3.scale.linear();
            _y = d3.scale.linear();

            _xAxis = d3.svg.axis()
                .scale(_x)
                .orient('bottom')
                .tickFormat(d3.format('.0f'));

            _yAxis = d3.svg.axis()
                .scale(_y)
                .orient('left')
                .tickFormat(d3.format('.2f'));

            _svg = d3.select(element)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%');

            _svg = _svg.append('g');

            _svg.append('g')
                .attr('class', 'x axis');

            _svg.append('g')
                .attr('class', 'y axis')
                .call(_yAxis);

            _xLabel = _svg.append('text')
                .attr('text-anchor', 'middle')
                .html('Frequency (cm\u207B\u00B9)');

            _yLabel = _svg.append('text')
                .attr('text-anchor', 'middle')
                .text('Intensity');
        }

        this._generateLine = function(data, frequencyRange, intensityRange, gamma) {
            var freqRange = [];
            freqRange[0] = 0.0;
            freqRange[1] = 0.0;
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
        };

        this.render = function(data) {

            // If we are not passed data then this is for resize so use
            // cached data...
            if (!data) {
                data = _data;
            }
            // Save the data for resize events
            _data = data;

            if (!data) {
                return;
            }

            var frequencyRange = [0, d3.max(data.frequencies) * 1.1],
                intensityRange = [0, d3.max(data.intensities)],
                that = this, width = d3.select(element).node().offsetWidth,
                height = d3.select(element).node().offsetHeight;

            if (width === 0 || height === 0) {
                return;
            }

            _margin = {top: 30, right: 30, bottom: 70, left: 80};

            _width = width - _margin.left - _margin.right;
            _height = height - _margin.top - _margin.bottom;

            _svg.attr('transform', 'translate(' + _margin.left + ',' + _margin.top + ')');

            _x.domain(frequencyRange)
                .range([0, _width]);
            _y.domain(intensityRange)
                .range([_height, 0]);

            _svg.select('.x.axis')
                .attr('transform', 'translate(0,' + _height + ')')
                .transition().duration(200).ease('sin-in-out')
                .call(_xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.55em')
                .attr('transform', 'rotate(-90)' );

            _svg.select('.y.axis')
                .transition().duration(200).ease('sin-in-out')
                .call(_yAxis)
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

            var bars = _svg.selectAll('.bar')
                .data(chartData);

            var g = bars.enter()
                .append('g')
                .attr('class', 'bar');

            g.append('rect')
            .on('mouseover', function(data) {
                if (options.mouseoverbar) {
                    options.mouseoverbar(data);
                }
            })
            .on('click', function(data) {
                if(options.clickbar) {
                    options.clickbar(data);
                    that.selectedBar(data.index);
                }
            });

            var barWidth = 4;

            bars.transition()
                .duration(1000)
                .ease('cubic-in-out')
                .attr('transform', function(d) {
                    return 'translate(' + (_x(d.frequency) - barWidth/2) + ',' + _y(d.intensity) + ')'; })
                .select('rect')
                .attr('width', barWidth)
                .attr('height', function(d) { return _height - _y(d.intensity); });

            bars.exit().transition().style({opacity: 0}).remove();

            let lineFreqData = this._generateLine(data, frequencyRange, intensityRange, 40);

            var lineFunc = d3.svg.line()
                .x(function (d) {
                    return _x(d.x);
                })
                .y(function (d) {
                    return _y(d.y);
                })
                .interpolate('linear');

            let line = _svg.select('.line');
            if (line.empty()) {
                line = _svg.append('svg:path');
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
                let experimentalLine = _svg.select('.experimental-line');
                if (experimentalLine.empty()) {
                    experimentalLine = _svg.append('svg:path');
                    experimentalLine.attr('stroke', '#74C365')
                        .attr('stroke-width', 4)
                        .attr('fill', 'none')
                        .attr('class', 'experimental-line');
                }

                _x.domain(d3.extent(frequencies))
                .range([0, _width]);
                _svg.select('.x.axis')
                .attr('transform', 'translate(0,' + _height + ')')
                .transition().duration(200).ease('sin-in-out')
                .call(_xAxis)
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '-.55em')
                .attr('transform', 'rotate(-90)' );

                lineFreqData = this._generateLine(data, d3.extent(frequencies), intensityRange, 10);

                var expDrag = d3.behavior.drag().on('drag', function() {
                    var pixelDelta = d3.event.sourceEvent.pageY - dragStart,
                        pixelY = d3.event.y, pixelYStart = pixelY - pixelDelta,
                        intensityStart = _y.invert(pixelYStart),
                        intensity = _y.invert(pixelY);

                    // Calculate scale factor
                    if (intensityStart > 0) {
                        experimentalScaleFactor = intensity / intensityStart;
                    }

                    experimentalScaleFactor = Math.max(0.01, experimentalScaleFactor);

                    experimentalLine.attr('d', experimentalLineFunc(experimentalLineData));
                }).on('dragstart', function() {
                    dragStart = d3.event.sourceEvent.pageY;
                }).on('dragend', function() {
                    for (let i = 0; i < numberOfPoints; ++i) {
                        experimentalLineData[i].y = experimentalLineData[i].y * experimentalScaleFactor;
                    }
                });

                experimentalLine.call(expDrag);

                var experimentalLineFunc = d3.svg.line()
                .x(function (d) {
                    return _x(d.x);
                })
                .y(function (d) {
                    return _y(d.y * experimentalScaleFactor);
                })
                .interpolate('linear');

                experimentalLine.attr('d', experimentalLineFunc(experimentalLineData));
            }
            else {
                _svg.select('.experimental-line').remove();
            }

            line.attr('d', lineFunc(lineFreqData));

            _xLabel.attr('transform', 'translate('+ (_width/2) +','+(_height + 65)+')');
            _yLabel.attr('transform', 'translate(-60,'+(_height/2)+')rotate(-90)');
        };

        this.selectedBar = function(index) {
            // TODO The must be a better way todo this selec
            var bars = _svg.selectAll('.bar');
            bars.classed('selected', false);

            if (index > 0) {
                d3.select(bars[0][index]).classed('selected', true);
            }
        };

        this.hide = function(hide) {
            if (hide) {
                _svg.attr('hide', true);
            }
            else {
                _svg.attr('hide', null);
            }
        };

        init();

        return this;
    };



    angular.module('mongochemApp')
        .directive('mongochemVibrationalModesChart', ['$rootScope', '$timeout', '$window',
        function($rootScope, $timeout, $window) {
            return {
                restrict: 'EA',
                scope: {
                    data: '='
                },
                link: function(scope, element) {

                    var histogram = null;
                    var renderTimeout;

                    function render(data) {
                        if (d3.select(element).node().offsetWidth === 0) {
                            if (histogram) {
                                histogram.hide(true);
                            }
                            return;
                        }
                        if (renderTimeout) {
                            clearTimeout(renderTimeout);
                        }

                        if (!histogram) {
                            var options = {};

                            options.mouseoverbar = function(bar) {
                                $rootScope.$broadcast('mongochem-frequency-histogram-mouseoverbar', bar);
                            };

                            options.clickbar = function(bar) {
                                $rootScope.$broadcast('mongochem-frequency-histogram-clickbar', bar);
                            };

                            histogram = new VibrationalModesChart(element[0], options);

                            $rootScope.$on('mongochem-frequency-histogram-selectbar', function(evt, index) {
                                histogram.selectedBar(index);
                            });
                        }

                        renderTimeout = $timeout(function() {
                            histogram.hide(false);
                            histogram.render(data);
                        }, 200);
                    }

                    // watch for data changes
                    scope.$watch('data', function(newData) {
                        return render(newData);
                    }, true);

                    angular.element($window).bind('resize', function() {
                        render();
                    });
               }
            };
        }]);
});
