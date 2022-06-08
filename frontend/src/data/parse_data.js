import data from './Age-standardized-suicide-rates.csv';
import * as d3 from 'd3'
import { nest } from 'd3-collection';

export const ageStandardized = async () => {
    var dataset;
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

    await d3.csv(data, rowConverter).then((csv) => {
        console.log(csv)
        const data_2016_og = nest()
            .key((d) => d.country)
            .rollup((d) => { 
                return {
                    // d: d[0],
                    year2016: d[0].year2016,
                    year2015: d[0].year2015,
                    year2010: d[0].year2010,
                    year2000: d[0].year2000
                }
            })
            .entries(csv);
        dataset = data_2016_og;
    });
    return dataset;
}