const checkUpdateCall = (target: Date) => {
    const min = target.getMinutes();
    let returned: number;
    if(min < 20) {
        returned = (21 - min) * 60000;
    }
    returned = (60 - min) * 60000;
    return returned;
};