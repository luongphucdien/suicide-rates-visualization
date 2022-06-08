import React, { useEffect } from "react";
import * as d3 from 'd3'
import { nest } from 'd3-collection';
import { ageStandardized } from '../data/parse_data';


const w=700, h=500;
var raw_dataset = ageStandardized(), dataset;
export default function CompareYear() {
    useEffect(() => {
        raw_dataset.then((res) => {
            dataset = res;
        });

        setTimeout(() => {
            console.log(dataset);
        }, 200);
    }, []);
}