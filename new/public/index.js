const d3 =  require('d3');
const {nest} = 'd3-collection';

var w=600, h=420, padding=50;
var dataset, rawData;


document.addEventListener('DOMContentLoaded', () => {
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

    d3.csv('Age-standardized-suicide-rates.csv', rowConverter, (data) => {
        const data_2016_og = nest()
            .key((d) => d.country)
            .key((d) => d.year2016)
            .entries(data);
        
        const flattenedData = data_2016_og.map((d) => {
        	return {
        		country: d.key,
        		suicide_both: parseFloat(d.values[0].key),
        		suicide_male: parseFloat(d.values[1].key),
        		suicide_female: parseFloat(d.values[2].key)
        	};
        });
        
        dataset = flattenedData;
        rawData = data;
    });
    
    
    setTimeout(() => {
		console.log(dataset);
	}, 200);
});