import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'
import { nest } from 'd3-collection';
import { zoomTransform } from 'd3';

const w=800, h=420, padding=50, range = 10;
var dataset, rawData;
// var xScale, yScale;

export default function Main() {
    const rowConverter = (d) => {
        return {
            country: d.Country,
            sex: d.Sex,
            year2016: parseFloat(d['2016']),
            year2015: parseFloat(d['2015']),
            year2010: parseFloat(d['2010']),
            year2000: parseFloat(d['2000'])
        };
    };

    d3.csv('/data/archive/Age-standardized-suicide-rates.csv', rowConverter).then((data) => {
        const data_2016_og = nest()
            .key((d) => d.country)
            .rollup((d) => { return d[0].year2016; })
            .entries(data);
        
        dataset = data_2016_og;
        rawData = data;
    });

    useEffect(() => {
        d3.select(".svg").append("svg")
            .attr("class", "bar-chart")
            .attr("width", w+100)
            .attr("height", h+padding*2);

        const svg = d3.select('.bar-chart');

        setTimeout(() => {
            console.table(dataset);

            const barChart = d3.select('.bar-chart');
            const y_max_og = d3.max(dataset, (d) => {
                return d.value;
            });
            console.log(y_max_og);

            const xScale = d3.scaleBand()
                            .domain(d3.range(dataset.length))
                            .range([20, w])
                            .paddingInner(0.05);

            const yScale = d3.scaleLinear()
                            .domain([0, y_max_og])
                            .range([h, 0])
                            .nice()

            // const zoomBehavior = d3.zoom()
            //                     .scaleExtent([0.5, 5])
            //                     .translateExtent([ [0,0], [w,h] ])
            //                     .on('zoom', () => {
            //                         const zoomState = zoomTransform(svg.node());
            //                         const newYScale = zoomState.rescaleY(yScale);
            //                         console.log(yScale.domain());
            //                         console.log(newYScale.domain());
            //                         yScale.domain(newYScale.domain());
            //                     });
            // svg.call(zoomBehavior);

            var key = (d) => {
                return d.key;
            }

            barChart.selectAll("rect")
                    .data(dataset, key)
                    .enter()
                    .append("rect")
                    .attr("y", (d) => {
                        return yScale(d.value);
                    })
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("height", function(d) {
                        return h - yScale(d.value);
                    })
                    .attr("width", function(d) {
                        return xScale.bandwidth();
                    })
                    .style("fill", '#69b3a2')
                    .attr('transform', () => {
                        return 'translate(' + padding + ',' + padding + ')'
                    })
                    .on('mouseover', (event, d) => {
                        d3.select(event.currentTarget).style("fill", '#d157d7');
                        
                        const country_value = d.key;
                        const suicide_value = d.value;
                        d3.select('#country-value').text(country_value);
                        d3.select('#suicide-value').text(suicide_value + '%');

                        d3.select('#tooltip-group').style('display', 'block');
                        console.log(d.value);
                    })
                    .on('mouseout', (event, d) => {
                        d3.select(event.currentTarget).style("fill", '#69b3a2');
                        d3.select('#tooltip-group').style('display', 'none');
                    });


            var yAxis = d3.axisLeft().scale(yScale).tickFormat((d) => {
                return d + '%';
            });
            
            barChart.append('g').call(yAxis)
                    .attr('class', 'y-axis')
                    .attr('transform', () => {
                        return 'translate(' + (padding) + ',' + padding + ')';
                    });


            d3.select('#sex-select').on('change', (event) => {
                const criterion = parseInt(d3.select(event.currentTarget).property('value'));
                const data_2016_new = nest()
                                        .key((d) => d.country)
                                        .rollup((d) => { return d[criterion].year2016; })
                                        .entries(rawData);
                console.table(data_2016_new);
                dataset = data_2016_new;

                const y_max = d3.max(dataset, (d) => {
                    return d.value;
                });

                yScale.domain([0, y_max]).nice();

                barChart.selectAll('.y-axis')
                    .transition()
                    .duration(500)
                    .call(yAxis);

                barChart.selectAll("rect")
                    .data(dataset, key)
                    .transition()
                    .duration(500)
                    .attr("y", (d) => {
                        return yScale(d.value);
                    })
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("height", function(d) {
                        return h - yScale(d.value);
                    })
                    .attr("width", function(d) {
                        return xScale.bandwidth();
                    })
            });

            d3.select('#sort').on('change', (event) => {
                const criterion = d3.select(event.currentTarget).property('value');
                dataset = dataset.sort((a, b) => {
                    switch (criterion) {
                        case 'asc':
                            if (a.value < b.value)
                                return -1;
                            else if (a.value > b.value)
                                return 1;
                            else
                                return 0;
                    
                        case 'desc':
                            if (a.value < b.value)
                                return 1;
                            else if (a.value > b.value)
                                return -1;
                            else
                                return 0;
                    }
                });

                console.table(dataset);

                key = (d) => {
                    return d.key;
                }
                
                const y_max = d3.max(dataset, (d) => {
                    return d.value;
                });
                console.log(y_max);

                yScale.domain([0, y_max]).nice();
                xScale.domain(d3.range(dataset.length));

                barChart.selectAll('.y-axis')
                    .transition()
                    .duration(500)
                    .call(yAxis);

                // const bars = d3.selectAll('rect');

                // bars.data(new_dataset, key)
                //     .enter()
                //     .attr('y', (d) => {
                //         return yScale(d.value);
                //     })
                //     .attr('x', w)
                //     .attr('height', (d) => {
                //         return h - yScale(d.value);
                //     })
                //     .attr('width', (d) => {
                //         return xScale.bandwidth();
                //     })
                //     .style("fill", '#69b3a2')
                //     .merge(bars)
                //     .transition()
                //     .duration(500)
                //     .attr('y', (d) => {
                //         return yScale(d.value);
                //     })
                //     .attr('x', (d, i) => {
                //         return xScale(i);
                //     })
                //     .attr('height', (d) => {
                //         return h - yScale(d.value);
                //     })
                //     .attr('width', (d) => {
                //         return xScale.bandwidth();
                //     })
                //     .style("fill", '#69b3a2');

                // bars.exit()
                //     .transition()
                //     .duration(500)
                //     .attr('x', w)
                //     .remove();


                barChart.selectAll("rect")
                    .data(dataset, key)
                    .transition()
                    .duration(500)
                    .attr("y", (d) => {
                        return yScale(d.value);
                    })
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("height", function(d) {
                        return h - yScale(d.value);
                    })
                    .attr("width", function(d) {
                        return xScale.bandwidth();
                    })
            });

        }, 200);
    }, []);

    // useEffect(() => {
        
    // }, [currentZoom]);

    

    return (
        <div className=''>
            <div className='svg'></div>
            <div>
                <select id='sex-select'>
                    <option value={0}>Both sexes</option>
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                </select>

                <select id='sort'>
                    <option value={'asc'}>Ascending order</option>
                    <option value={'desc'}>Descending order</option>
                </select>
            </div>
            <div id='tooltip-group' style={{display: 'none'}}>
                <h3>Country: <span id='country-value'></span></h3>
                <h3>Suicide percentage: <span id='suicide-value'></span></h3>
            </div>
        </div>
    );
}
