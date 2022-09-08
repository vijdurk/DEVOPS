const resemble = require("node-resemble-js");
const fs = require("fs");
let file = "/home/prithvish/NCSU/Semester_2/CSC519_DevOps/Project/DEVOPS-06/pipeline/screenshots/long_0.png";
let file2 = "/home/prithvish/NCSU/Semester_2/CSC519_DevOps/Project/DEVOPS-06/pipeline/screenshots/long_4.png";

var diff = resemble(file).compareTo(file2).onComplete(function(comparisonData){
    console.log(comparisonData);
    comparisonData.getDiffImage().pack().pipe(fs.createWriteStream('diff.png'));
});
