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
            _margin;

        function init() {
            var width = d3.select(element).node().offsetWidth,
                height = d3.select(element).node().offsetHeight;

            _margin = {top: 30, right: 30, bottom: 70, left: 80};

            _width = width - _margin.left - _margin.right;
            _height = height - _margin.top - _margin.bottom;

            _x = d3.scale.linear();
            _y = d3.scale.linear();

            _xAxis = d3.svg.axis()
                .scale(_x)
                .orient('bottom')
                .tickFormat(d3.format("s"));

            _yAxis = d3.svg.axis()
                .scale(_y)
                .orient('left')
                .tickFormat(d3.format("s"));

            _svg = d3.select(element)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%');

            _svg = _svg.append('g')
            .attr('transform', 'translate(' + _margin.left + ',' + _margin.top + ')');

            _svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + _height + ")")
                .call(_xAxis);
            _svg.append("g")
                .attr("class", "y axis")
                .call(_yAxis);

            _svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+ (_width/2) +","+(_height + 65)+")")
                .text("Frequency");

            _svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(-60,"+(_height/2)+")rotate(-90)")
                .text("Intensity");
        }

        function resize() {
            var width=d3.select(element).node().offsetWidth,
            height=d3.select(element).node().offsetHeight;

            _width = width - _margin.left - _margin.right;
            _height = height - _margin.top - _margin.bottom;

            // Only resize if are already initialized
            if (!_xAxis) {
                return;
            }

            d3.select('.x.axis')
                .attr("transform", "translate(0," + _height + ")")
                .call(_xAxis);

            _y.range([_height, 0]);

            _svg.selectAll('.bar')
                .attr('transform', function(d) {
                    return 'translate(' + _x(d.frequency) + ',' + _y(d.intensity) + ')'; })
                .select('rect')
                .attr('height', function(d) { return _height - _y(d.intensity); });
        }


        this.render = function(data) {
            var frequencyRange = [0, d3.max(data.frequencies)],
                intensityRange = [0, d3.max(data.intensities)],
                that = this;

            _x.domain(frequencyRange)
                .range([0, _width]);
            _y.domain(intensityRange)
                .range([_height, 0]);

            _svg.select('.x.axis')
                .transition().duration(200).ease('sin-in-out')
                .call(_xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.55em")
                .attr("transform", "rotate(-90)" );

            _svg.select('.y.axis')
                .transition().duration(200).ease('sin-in-out')
                .call(_yAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dy", ".5em");

            let chartData = [];

            for(let i=0; i<data.intensities.length; i++) {
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

        this.resize = resize;

        init();

        return this;
    };



    angular.module("mongochemApp")
        .directive('mongochemVibrationalModesChart', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    data: '='
                },
                link: function(scope, element) {

                    var histogram = null;
                    var renderTimeout;

                    function render(data) {
                        if (!data || d3.select(element).node().offsetWidth === 0) {
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

                    window.onresize = function() {
                        scope.$apply();
                    };
                }
            };
        }]);
});
