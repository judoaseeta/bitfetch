import { YscaleObject } from './SubCharts';
import {HistoData} from "../../core/lib/entities/histoData";
import {max, min} from "d3-array";
import {scaleLinear} from "d3-scale";

function generateYscale(datas: { coin: string; data: HistoData[]}[], height: number): YscaleObject {
    const newObject: YscaleObject = {};
    datas.forEach(({ coin, data }) => {
        const minimum = min(data, d => d.low);
        const maximum = max(data, d => d.high);
        newObject[coin] = scaleLinear()
            .domain([minimum!, maximum!])
            .range([height, 0])
    })
    return newObject;
}

export default generateYscale;
