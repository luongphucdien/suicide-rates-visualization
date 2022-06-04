import React, { useEffect } from 'react';
import * as d3 from 'd3'
import { nest } from 'd3-collection';
import data from '../data/Age-standardized-suicide-rates.csv';

const w=700, h=500, padding=50, range = 10;
var dataset, geo_data;
// var xScale, yScale;

export default function Main() {
    useEffect(() => {
        d3.select('.svg-wrapper').append('svg')
                                    .attr('class', 'svg')
                                    .attr('width', w)
                                    .attr('height', h)
                                    .attr('viewBox', [0,0,w,h]);

        const svg = d3.select('.svg');
        const g = svg.append('g');


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
    
        d3.csv(data, rowConverter).then((csv) => {
            const data_2016_og = nest()
                .key((d) => d.country)
                .rollup((d) => { return d[0].year2016; })
                .entries(csv);
            
            dataset = data_2016_og;
            // rawData = data;
            // console.log(dataset);
    
        });

        d3.json('https://raw.githubusercontent.com/luongphucdien/Data-Visualization/main/world-geo-data.json').then((json) => {
            geo_data = json;
        });

        setTimeout(() => {
            for (var i=0; i<dataset.length; i++) {
                const country = dataset[i].key;
                const suicide_data = dataset[i].value;

                for (var j=0; j<geo_data.features.length; j++) {
                    const name_long = geo_data.features[j].properties.name_long;
                    const name_sort = geo_data.features[j].properties.name_sort;
                    const admin = geo_data.features[j].properties.admin;
                    const brk_name = geo_data.features[j].properties.brk_name;
                    if (country === name_long || country === name_sort || country === admin || country === brk_name) {
                        geo_data.features[j].properties.suicide_data = suicide_data;
                        break;
                    }
                }
            };

            console.log(dataset);
            console.log(geo_data);

            const t0 = { k: w/2/Math.PI, x: w/2, y: h/2 };

            const projection = d3.geoMercator().fitSize([w, h], geo_data);
            var path = d3.geoPath().projection(projection);

            const colorScale = d3.scaleQuantize()
							.range(['rgb(255, 218, 232)',
									'rgb(255, 181, 194)',
									'rgb(255, 143, 153)',
									'rgb(255, 99, 105)',
									'rgb(253, 23, 0)'
							])
							.domain([
								d3.min(dataset, (d) => { return parseInt(d.value); }),
								d3.max(dataset, (d) => { return parseInt(d.value); })
							]);

            const zoom = d3.zoom()
                            .scaleExtent([1, 8])
                            .on("zoom", (event) => {
                                const {transform} = event;
                                svg.attr("transform", transform);
                                svg.attr("stroke-width", 1 / transform.k);
                            });

            svg.call(zoom).on('click', () => {
                svg.transition().duration(750).call(
                    zoom.transform,
                    d3.zoomIdentity,
                    d3.zoomTransform(svg.node()).invert([w / 2, h / 2])
                );
            });
    
            g.selectAll('path')
                .data(geo_data.features)
                .enter()
                .append('path')
                .attr('d', path)
                .style('fill', (d) => {
                    if (!d.properties.suicide_data)
                        return 'rgb(183, 183, 183)';
                    return colorScale(d.properties.suicide_data);
                })
                .on('mouseover', (event, d) => {
                    d3.select(event.path[0]).transition().style('stroke', 'blue');
                    
                })
                .on('mouseout', (event, d) => {
                    d3.select(event.path[0]).transition().style('stroke', 'none');
                })
                .on('click', (event, d) => {
                    event.stopPropagation();
                    if (d3.select(event.path[0]).classed('highlighted')) {
                        d3.select('.highlighted').classed('highlighted', false);
                        d3.select('#tooltip-group').classed('visually-hidden', true);
                    }
                    else {
                        d3.select('.highlighted').classed('highlighted', false);
                        d3.select(event.path[0]).classed('highlighted', true);

                        const country = d.properties.admin;
                        const suicide = d.properties.suicide_data;
                        d3.select('#country-value').text(country);
                        d3.select('#suicide-value').text(suicide);
                        d3.select('#tooltip-group').classed('visually-hidden', false);
                    }
                });
        }, 200);
    }, []);

    
    

    


    return (
        <div className=''>
            <div className='svg-wrapper' style={{background: 'gray', overflow: 'hidden'}}>

            </div>
            
            <div id='tooltip-group' className='visually-hidden'>
                <h3>Country: <span id='country-value'></span></h3>
                <h3>Suicide percentage: <span id='suicide-value'></span>%</h3>
            </div>
        </div>
    );
}
