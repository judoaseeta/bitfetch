export const emailRegex = /[\w.]+@[\w.]+\.\w+/;
export const pwRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const pwRegexWithUpperCase = /[A-Z]/;
const pwRegexWithNumber = /\d/;
export const validatePw = (pw: string) => {
    if(!pwRegexWithUpperCase.test(pw)) {
        return 'it should have at least one uppercase letter';
    } else if(!pwRegexWithNumber.test(pw)) {
        return 'it should have at least one number';
    } else if(pw.length > 4 && pw.length < 8) {
        return "it should have at least 8 characters";
    }
    return '';
};
console.log(validatePw('a1eAs$'));