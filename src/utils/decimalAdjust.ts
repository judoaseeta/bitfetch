/*
 Inspired by, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
 */
type AdjustType = 'round' | 'floor' | 'ceil';
function decimalAdjust (type: AdjustType, value: number, exp: number) {
    if(exp ===0) return Math[type](value);
    const splitedValue = value.toString().split('e');
    const shiftedValue = Math[type](+(splitedValue[0] + 'e' + (splitedValue[1] ? (+splitedValue[1] - exp) : -exp)));
    // Shift back
    const shiftBacked = shiftedValue.toString().split('e');
    return +(shiftBacked[0] + 'e' + (shiftBacked[1] ? (+shiftBacked[1] + exp) : exp));
}

export default decimalAdjust;

