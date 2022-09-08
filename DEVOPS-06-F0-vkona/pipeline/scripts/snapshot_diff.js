#!/usr/bin/env node
const fs = require('fs');
const resemble = require("node-resemble-js");

const [, , ...args] = process.argv;

iteration = args[0];
urls = args[1].split(",");
let failedmutations=0;

(async () => {
  let names = urls.map(function (url) {
    return url.split("/").pop().split(".")[0];
  });
  let output_str = "";
  let flag=false;
  let urlslength=0;

  for await (let url of urls) {
    urlslength++;
    let name =url.split("/").pop().split(".")[0];
    let misMatch;
    let base_file = '/bakerx/pipeline/screenshots/' + name + '_baseline.png';
    let test_file = '/bakerx/pipeline/screenshots/' + name + "_" + iteration + ".png";
   
    if (fs.existsSync(test_file)) {
      output_str += name + "_" + iteration + ": ";
      misMatch=await compare(test_file,base_file);
      output_str += misMatch + " ";
      
        if(urlslength==urls.length){
          console.log(output_str);
        }
      if(misMatch>0){
        flag=true;
      }
    }
    else {
      flag=true;
      output_str += name + "_" + iteration + ": ";
      output_str += "File absent ";
      if(urlslength==urls.length){
        console.log(output_str);
      }
    }
    
    if(flag && urlslength==urls.length)
    {
      fs.appendFile('/bakerx/pipeline/failedMutations.txt',"iteration"+" "+iteration+" "+output_str+ "\n", (err) => {if (err) throw err;});
    }
   
  }
 

  
})().catch((error) => {
  console.error(error);
  console.log("Promise rejected");
  process.exit();
});

async function compare(test_file, base_file) {
  return new Promise(function (resolve, reject) {
      resemble(test_file)
      .compareTo(base_file)
      .onComplete(function (comparisonData) {

          resolve(comparisonData.misMatchPercentage);
          
      });
  });
}