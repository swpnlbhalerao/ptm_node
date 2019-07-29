array =['a','b','c'];
var min=40; 
var max=100;  
data=[]
array.forEach((element,index) => {
    newArray=[];
    newArray.push(element);
    newArray.push(Math.floor(Math.random() * (+max - +min)) + +min);
    data.push(newArray);
});

console.log(data);

