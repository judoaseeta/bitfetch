import * as moment from "moment";

const timeParser = (time: string) =>  (dataTime: Date) => {
    if(time === 'live') {
        return moment(dataTime).format('A h:00-MMM,Do');
    } else if(time === '3d') {
        return moment(dataTime).format('A h:00-MMM,Do');
    } else if(time === '1m') {
        return moment(dataTime).format('Do,MMM,YYYY');
    }
};
export default timeParser;