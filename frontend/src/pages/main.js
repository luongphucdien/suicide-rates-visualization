import React, { useEffect, useState } from 'react';
import * as d3 from 'd3'
import { nest } from 'd3-collection';

const w=600, h=420, padding=50;
var dataset;

export default function Main() {
    useEffect(() => {
        d3.select(".svg").append("svg")
            .attr("class", "line-chart")
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
            const nestedData = nest()
                .key((d) => d.country)
                .rollup((d) => {
                    return ({
                        bothSex: {  '2016': d[0].year2016, 
                                    '2015': d[0].year2015,
                                    '2010': d[0].year2010,
                                    '2000': d[0].year2000   },

                        male: { '2016': d[1].year2016, 
                                '2015': d[1].year2015,
                                '2010': d[1].year2010,
                                '2000': d[1].year2000   },

                        female: {   '2016': d[2].year2016, 
                                    '2015': d[2].year2015,
                                    '2010': d[2].year2010,
                                    '2000': d[2].year2000   },

                        all: d
                    });
                })
                .entries(data);
            
            dataset = nestedData;
        });
        
        setTimeout(() => {
            console.log(dataset);
        }, 200);
    }, []);

    

    return (
        <div className='svg'>
            {/* {console.table(dataset)} */}
        </div>
    );
}
