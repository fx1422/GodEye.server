module.exports = {
    handleTime: (timestamps) => {
        const timestamp = Date.parse(timestamps)
        const oDate = new Date();
        oDate.setTime(timestamp);
        return oDate.getFullYear() + '-' + fill0(oDate.getMonth() + 1) + '-' + fill0(oDate.getDate()) + ' ' + fill0(oDate.getHours()) + ':' + fill0(oDate.getMinutes())
            + ':' + fill0(oDate.getSeconds())
    },
    randomNoteCode:()=>{
        return  Math.floor(Math.random()*9000)+1000
    }
};

function fill0(num) {
    return num < 10 ? '0' + num : '' + num
}