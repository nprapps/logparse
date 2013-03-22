// DOM shizz
var LABEL_HEIGHT = 25;
var CONTAINER_HEIGHT = 350;

var $container = $('.container');

var dataset = new Miso.Dataset({
    url: 'data/blah.json',
});

dataset.fetch({
    success: function() {
        visualizedis();
    },

    error: function(e) {
        console.warn(e);
    }
});

function visualizedis() {
    var items_per_hour = dataset.groupBy('Hour', ['Items']);

    var chart_data = []; // array of objects to feed to d3

    items_per_hour.each(function(row, idx) {
        chart_data.push({ name: row['Hour'], value: row['Items'] });
    });

    var width = $container.width(),
        height = CONTAINER_HEIGHT,
        bar_height = height - LABEL_HEIGHT;

    var x_scale = d3.scale.ordinal().rangeBands([0, width], 0.1, 0),
        y_scale = d3.scale.linear().range([0, bar_height]);

    x_scale.domain(items_per_hour.column('Hour').data);
    y_scale.domain([0, items_per_hour.max('Items')]);

    var svg = d3.select('.container').append('svg')
        .attr('width', width)
        .attr('height', height);

    var chart = svg.append('g')
                    .attr('class', 'chart');

    chart.selectAll('rect')
                    .data(chart_data)
                    .enter()
                    .append('rect')
                    .attr('x', function(item) { return x_scale(item.name) })
                    .attr('y', function(item) { return bar_height - y_scale(item.value) })
                    .attr('width', x_scale.rangeBand())
                    .attr('height', function(item) { return y_scale(item.value) })
                    .attr('fill', 'green');

    chart.selectAll('text')
                    .data(chart_data)
                    .enter()
                    .append('text')
                    .text(function (item) { return item.name; })
                    .attr('text-anchor', 'middle')
                    .attr('x', function(item) { return x_scale(item.name) + x_scale.rangeBand()/2; })
                    .attr('y', bar_height + 20);
    window.bleh = dataset;
}
