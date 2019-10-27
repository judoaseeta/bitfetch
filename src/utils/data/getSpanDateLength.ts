import * as moment from 'moment';

function diff() {
    const date = moment().subtract(1095, 'days');
// get first day of that date
    const firstDate = date.startOf('month');
    const now = moment();
// get how many days between now and firstdate since cryptocompare.com api doesn't provide way to do this.
    return now.diff(firstDate, 'days');
}
export default diff;

