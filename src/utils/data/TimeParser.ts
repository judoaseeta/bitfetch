import * as moment from "moment";
// entity
import { HistoType } from '../../core/lib/entities/histoData';

const timeParser = (time: string) =>  (dataTime: Date) => {
    if(time === HistoType.live) {
        return moment(dataTime).format('A h:00-MMM,Do');
    } else if(time === HistoType.threeDay) {
        return moment(dataTime).format('A h:00-MMM,Do');
    } else  {
        return moment(dataTime).format('Do,MMM,YYYY');
    }
};
export default timeParser;