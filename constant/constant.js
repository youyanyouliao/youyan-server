var constant = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'root',
    DATABASE: 'youyan',
    getCurrentDateTime:()=>{
        var date = new Date();
		var nowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +date.getHours()+ ":" + date.getMinutes()+":"+date.getSeconds();
		return nowDate;
    }
}
module.exports = constant;