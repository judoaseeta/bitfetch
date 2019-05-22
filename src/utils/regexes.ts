export const emailRegex = (value: string) => {
    return value.match(/[\w.]+@[\w.]+\.\w+/);
}
export const pwRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const pwRegexWithUpperCase = /[A-Z]/;
const pwRegexWithNumber = /\d/;
const pwRegexWithSpecial = /(?=.*[!@#$%^&*])/;
export const validatePw = (pw: string) => {
    if (pw.length === 0 ) return '';
    else if(!pwRegexWithUpperCase.test(pw)) {
        return 'at least one uppercase letter needed.';
    } else if(!pwRegexWithNumber.test(pw)) {
        return 'at least one number needed.';
    } else if(pw.length > 4 && pw.length < 8) {
        return "at least 8 characters needed.";
    } else if(!pwRegexWithSpecial.test(pw)) {
        return 'at least one special character needed';
    }
    return '';
};