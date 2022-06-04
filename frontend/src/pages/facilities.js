import { useEffect } from "react";
import * as d3 from 'd3'
import { nest } from 'd3-collection';
import data from '../data/Facilities.csv';

const w=700, h=500;
var dataset, geo_data;
export default function Facilities() {
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
                mental_hospitals: parseFloat(d['Mental _hospitals'])
            };
        };
    
        d3.csv(data, rowConverter).then((csv) => {
            dataset = csv;
            console.log(dataset);
    
        });

        d3.json('https://raw.githubusercontent.com/luongphucdien/Data-Visualization/main/world-geo-data.json').then((json) => {
            geo_data = json;
        });

        setTimeout(() => {
            for (var i=0; i<dataset.length; i++) {
                const country = dataset[i].country;
                const facility = dataset[i].mental_hospitals;

                for (var j=0; j<geo_data.features.length; j++) {
                    const name_long = geo_data.features[j].properties.name_long;
                    const name_sort = geo_data.features[j].properties.name_sort;
                    const admin = geo_data.features[j].properties.admin;
                    const brk_name = geo_data.features[j].properties.brk_name;
                    if (country === name_long || country === name_sort || country === admin || country === brk_name) {
                        geo_data.features[j].properties.facility = facility;
                        break;
                    }
                }
            };

            for (var i=0; i<geo_data.features.length; i++) {
                const country = geo_data.features[i];
                if (!country.properties.facility)
                    console.log(country.properties.admin)
            }

            console.log(dataset);
            console.log(geo_data);

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
								d3.min(dataset, (d) => { return parseInt(d.mental_hospitals); }),
								d3.max(dataset, (d) => { return parseInt(d.mental_hospitals); })
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
                    if (!d.properties.facility)
                        return 'rgb(183, 183, 183)';
                    return colorScale(d.properties.facility);
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
                        const facility = d.properties.facility;
                        d3.select('#country-value').text(country);
                        d3.select('#facility-value').text(facility);
                        d3.select('#tooltip-group').classed('visually-hidden', false);
                    }
                });
        }, 200);
    }, []);



    return (
        <div className=''>
            <div className='svg-wrapper mt-5' style={{overflow: 'hidden', border: 'solid black 5px'}}>

            </div>

            <h3 className='text-center'>Mental health facilities in 2016</h3>
            
            <div id='tooltip-group' className='visually-hidden'>
                <h3>Country: <span id='country-value'></span></h3>
                <h3>Number of facilities(per 100,000 population): <span id='facility-value'></span>%</h3>
            </div>
        </div>
    )
}