import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'
import { nest } from 'd3-collection';

const w=600, h=420, padding=50, range = 10;
var dataset;

export default function Main() {
    useEffect(() => {
        d3.select(".svg").append("svg")
            .attr("class", "bar-chart")
            .attr("width", w+100)
            .attr("height", h+padding*2);

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
            const data_2016_both = nest()
                .key((d) => d.country)
                .rollup((d) => { return d[0].year2016; })
                .entries(data);
            
            dataset = data_2016_both;
        });
        
        setTimeout(() => {
            console.table(dataset);

            const barChart = d3.select('.bar-chart');
            const y_max_2016 = d3.max(dataset, (d) => {
                return d.value;
            });
            console.log(y_max_2016);

            var xScale = d3.scaleBand()
                            .domain(d3.range(dataset.length))
                            .range([padding, w+padding])
                            .paddingInner(0.05);

            var yScale = d3.scaleLinear()
                            .domain([0, y_max_2016+1])
                            .range([h, 0])
                            .nice()

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
                    .attr("fill", 'blue');
        }, 200);
    }, []);

    

    return (
        <div className='svg'>
            {/* {console.table(dataset)} */}
        </div>
    );
}
