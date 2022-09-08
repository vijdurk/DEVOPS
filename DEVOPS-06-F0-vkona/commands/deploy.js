const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const sshSync = require("../lib/ssh");
const sshDeploy = require("../lib/ssh_deploy");
const yaml = require('js-yaml');
const puppeteer = require('puppeteer');
const helper = require('../lib/helpers');
const inv = process.cwd() + path.sep + "pipeline" + path.sep + "inventory";
const envPath = path.join( path.dirname(require.main.filename), '.env');


exports.command = "deploy <inventory> <job> <yamlfile>";
exports.desc = "Deploy job";
let results = require('dotenv').config({path:envPath});


exports.builder = (yargs) => {
  yargs.options({});
};

exports.handler = async (argv) => {
  
  const { inventory,job,yamlfile } = argv;
  let filename = helper.get_filename(yamlfile);
  //let inventoryPath=helper.get_inventory(inventory);
  console.log(inventory);
  
  console.log(job);
  console.log(filename);
  (async () => {
    if (filename) 
    {
      try {
        let fileContents = fs.readFileSync(filename, 'utf8');
        let data = yaml.load(fileContents);

        await run_setup(data,inventory);

        await run_job(data, job,inventory);
    
      } catch (e) {
        console.log(e);
    }
    } else {
      console.error("Job file doesn't exist");
    }
  })();
};

async function run_setup(data,inventory) {
  for (let i=0; i<data["setup"].length; i++) {
    let step = data["setup"][i];
    step = helper.generate_command(step);
    tag = helper.get_tag_for_step(step);
    if (tag != "package") {
      step = step.split("=").pop();
    }
   await run('build_files/setup', tag, step,inventory);
  }
}

async function run(job, tag, arg,inventory) {
  let GIT_TOKEN=process.env.GIT_TOKEN;
  let GIT_REPO=process.env.GIT_REPO;
  let MY_SQL_PASSWORD=process.env.MY_SQL_PASSWORD;
  let VM_USER=process.env.VM_USER;
  let VM_IP=process.env.VM_IP;
  let filePath = "/bakerx/pipeline/" + job + ".yml";
  let inventoryPath="/bakerx/pipeline/"+inventory;
  console.log("------------");
  console.log(inventoryPath);
  let TAG=tag;
  let ARG=arg;
  var DIR, result;

  console.log(chalk.blueBright("\n----------------------------"));
  console.log(chalk.blueBright("RUNNING BUILD ENVIRONMENT"));
  console.log(chalk.blueBright("----------------------------\n"));

  if (TAG == "package" || TAG == "remove") {
    
    result = sshSync(
      `/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${TAG} ${ARG}`, `${VM_USER}@${VM_IP}`
    );
  }

  if (TAG == "repository") {
    
    DIR = ARG.split("/").pop();
    result = sshSync(
      `/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${TAG} ${ARG} ${DIR} ${VM_USER}`, `${VM_USER}@${VM_IP}`
    );
  }

  if (TAG == "shell") {
    result = sshSync(`${ARG}`, `${VM_USER}@${VM_IP}`);
    if (result.error) {
      process.exit(result.status);
    }
  }

  if (TAG == "deploy") {

    var data=fs.readFileSync(inv);
    var result=data.toString().split('\n');
    //console.log("IPs");
    let count=0;
    let ip1,ip2;
    for(let i=0;i<result.length;i++){
    if (result[i].match(/^\d/)){
      count++;
      if(count==1){
        ip1=result[i].split(" ")[0];}
       if(count==2){
         ip2=result[i].split(" ")[0];}
      }
    }
    result = sshDeploy(`${ARG}`, `root@${ip1}`);
    if (result.error) {
      process.exit(result.status);
    }
    result1 = sshDeploy(`${ARG}`, `root@${ip2}`);
    if (result1.error) {
      process.exit(result.status);
    }
    if (ARG.includes("shutdown")) {
      await new Promise(r => setTimeout(r, 60000));
    }
  }
}

async function run_job(data, job,inventory) {
  var to_do, step;
  for (let i = 0; i < data["jobs"].length; i++) {
    to_do = data["jobs"][i];

    if (to_do["name"] == job) {
      console.log(to_do["name"] + "\n");

      for (let j = 0; j < to_do["steps"].length; j++) {
        step = to_do["steps"][j];
        console.log(step["name"]);

        if ("url" in step) {
          let url = step["url"];
          console.log(url);
          url = helper.generate_command(url);
          await run('build_files/setup', "repository", url,inventory);
        }

        else if ("runserver" in step) {
          console.log("Running " + step["runserver"] + "\n");
          step = helper.generate_command(step["runserver"]);
          await run('build_files/setup', "deploy", step,inventory);
        }

        else if ("run" in step) {
          console.log("Running " + step["run"] + "\n");
          step = helper.generate_command(step["run"]);
          await run('build_files/setup', "shell", step,inventory);
        }

        else if ("mutation" in step) {
          console.log("Running mutations on " + step["mutation"]["url"]);
          //await run_mutations(step["mutation"]);
        }
      }
      break;
    }
  }
}
