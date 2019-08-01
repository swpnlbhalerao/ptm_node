monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',];
defaultValueArray = [];

/* for(var i=0;i<12;i++){
    dataArray=[];
    dataArray.push(monthArray[i]);
    dataArray.push(0); 
    defaultValueArray.push(dataArray);
}
console.log(defaultValueArray);
    dataArr=[{
	"totalAmount" : 1215,
	"month" : 3
     }]
 
     dataArr.forEach(element => {
       defaultValueArray[(element.month)-1][1]=element.totalAmount; 
     });
     console.log(defaultValueArray);
 */

function convert(str) {
  try {
    if (str) {
      var date = new Date(str),

        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      //return [date.getFullYear(), mnth, day].join("-");

      hours = ("0" + date.getHours()).slice(-2);
      minutes = ("0" + date.getMinutes()).slice(-2);
      seconds = ("0" + date.getSeconds()).slice(-2);

      var mySQLDate = [date.getFullYear(), mnth, day].join("-");
      var mySQLTime = [hours, minutes, seconds].join(":");
      return [mySQLDate, mySQLTime].join(" ");

    } else {
      return "";
    }
  } catch (error) {
    return '';
  }
}
console.log(convert("Mon Jul 22 2019 11:41:52 GMT+0530 (India Standard Time)"))




/* var min=40;
var max=100;
data=[]
array.forEach((element,index) => {
    dataArray=[];
    dataArray.push(element);
    dataArray.push(Math.floor(Math.random() * (+max - +min)) + +min);
    data.push(dataArray);
});
 */
//console.log(data);

