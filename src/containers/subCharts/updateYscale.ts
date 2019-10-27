import {max, min} from "d3-array";
import { ScaleLinear } from "d3-scale";
import {HistoData} from "../../core/lib/entities/histoData";


// function to update yScale when receiving new data
function updateYscale(oldYscale: ScaleLinear<number,number>, data: HistoData[]): ScaleLinear<number,number>{
    const newMin = min(data, d => d.low);
    const newMax = max(data, d => d.high);
    return oldYscale.domain([newMin!, newMax!]);
}

export default updateYscale;
