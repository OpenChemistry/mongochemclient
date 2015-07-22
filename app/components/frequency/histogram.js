require.ensure(['d3'], function(require) {
    var d3 = require('d3');

    var FrequencyHistogram = function(element, options) {

        if (!(this instanceof FrequencyHistogram)) {
            return new FrequencyHistogram(element);
        }

        var _svg = null,
            _width = null,
            _height = null,
            _x = null,
            _y = null,
            _xAxis = null;

        function init() {
            var margin = {top: 30, right: 30, bottom: 30, left: 30},
                width = d3.select(element).node().offsetWidth,
                height = d3.select(element).node().offsetHeight;

            _width = width - margin.left - margin.right;
            _height = height - margin.top - margin.bottom;

            _x = d3.scale.linear();
            _y = d3.scale.linear();

            _xAxis = d3.svg.axis()
                .scale(_x)
                .orient('bottom');

    //        _xAxis.ticks(options.ticks);

            _svg = d3.select(element)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%');

            _svg = _svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            _svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + _height + ")")
                .call(_xAxis);
        }

        function resize() {
            var margin = {top: 30, right: 30, bottom: 30, left: 30},
            width=d3.select(element).node().offsetWidth,
            height=d3.select(element).node().offsetHeight;

            _width = width - margin.left - margin.right;
            _height = height - margin.top - margin.bottom;

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
                    return 'translate(' + _x(d.x) + ',' + _y(d.y) + ')'; })
                .select('rect')
                .attr('height', function(d) { return _height - _y(d.y); });
        }


        this.render = function(data) {
            var range = [0, d3.max(data.bins, function(d) { return d.x; }) + data.x.delta];

            _x.domain(range)
                .range([0, _width]);
            _y.domain([0, d3.max(data.bins, function(d) { return d.y; })])
                .range([_height, 0]);

            _svg.select('.x.axis')
                .transition().duration(200).ease('sin-in-out')
                .call(_xAxis);

            var bars = _svg.selectAll('.bar')
                .data(data.bins);

            var g = bars.enter()
                .append('g')
                .attr('class', 'bar');

            g.append('rect')
            .on('mouseover', function(data) {
                if (options.mouseoverbar) {
                    options.mouseoverbar(data);
                }
            });

            bars.transition()
                .duration(1000)
                .ease('cubic-in-out')
                .attr('transform', function(d) {
                    return 'translate(' + _x(d.x) + ',' + _y(d.y) + ')'; })
                .select('rect')
                .attr('x', 1)
                .attr('width', _x(data.x.delta) - 1)
                .attr('height', function(d) { return _height - _y(d.y); });

            bars.exit().transition().style({opacity: 0}).remove();
        };

        this.selectedBar = function(index) {
            // TODO The must be a better way todo this selec
            var bars = _svg.selectAll('.bar');
            bars.classed('selected', false);

            if (index > 0) {
                d3.select(bars[0][index]).classed('selected', true);
            }
        }

        this.resize = resize;

        init();

        return this;
    };



    angular.module("mongochemApp")
        .directive('mongochemFrequencyHistogram', ['$rootScope', function($rootScope) {
            return {
                restrict: 'EA',
                scope: {
                    data: '='
                },
                link: function(scope, element) {

                    var histogram = null;

                    function render(data) {

                        if (!data || d3.select(element).node().offsetWidth === 0) {
                            return;
                        }

                        if (!histogram) {
                            var options = {};

                            options.mouseoverbar = function(bar) {
                                $rootScope.$broadcast('mongochem-frequency-histogram-mouseoverbar', bar);
                            };

                            histogram = new FrequencyHistogram(element[0], options);

                            $rootScope.$on('mongochem-frequency-histogram-selectbar', function(evt, index) {
                                histogram.selectedBar(index);
                            })
                        }

                        histogram.render(data);
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
