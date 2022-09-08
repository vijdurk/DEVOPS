const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const sshSync = require("../lib/ssh");
const yaml = require('js-yaml');
const inventoryPath = "/bakerx/pipeline/inventory.ini";
const puppeteer = require('puppeteer');
const helper = require('../lib/helpers');
const fsExtra = require('fs-extra');
const failed_mutation_log = process.cwd()+path.sep+"pipeline"+path.sep+"failedMutations.txt";
const mutation_log = process.cwd()+path.sep+"pipeline"+path.sep+"diff.txt";
const screenshots_path = process.cwd()+path.sep+"pipeline"+path.sep+"screenshots";

exports.snapshot_urls = [];
exports.command = "build <job> <yamlfile>";
exports.desc = "Build job";


exports.builder = (yargs) => {
  yargs.options({});
};

exports.handler = async (argv) => {
  
  const { job,yamlfile } = argv;
  let filename = helper.get_filename(yamlfile);
  (async () => {
    if (filename) 
    {
      try {
        let fileContents = fs.readFileSync(filename, 'utf8');
        let data = yaml.load(fileContents);

        await run_setup(data);

        await run_job(data, job);
    
      } catch (e) {
        console.log(e);
    }
    } else {
      console.error("Job file doesn't exist");
    }
  })();
};

async function run_setup(data) {
  for (let i=0; i<data["setup"].length; i++) {
    let step = data["setup"][i];
    step = helper.generate_command(step);
    tag = helper.get_tag_for_step(step);
    if (tag != "package") {
      step = step.split("=").pop();
    }
   await run('build_files/setup', tag, step);
  }
}

async function run(job, tag, arg) {
  let GIT_TOKEN=process.env.GIT_TOKEN;
  let GIT_REPO=process.env.GIT_REPO;
  let MY_SQL_PASSWORD=process.env.MY_SQL_PASSWORD;
  let VM_USER=process.env.VM_USER;
  let VM_IP=process.env.VM_IP;
  let filePath = "/bakerx/pipeline/" + job + ".yml";
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
}

async function run_mutations(mutation_info) {
  let VM_USER=process.env.VM_USER;
  let VM_IP=process.env.VM_IP;
  let filePath = "/bakerx/pipeline/build_files/mutation.yml";
  let TAG = "mutation-baseline";
  let URLS = mutation_info["snapshots"].join(",");
  let ITERATION = 0;
  var DIR;
  let url = mutation_info["url"];
  let iterations = mutation_info["iterations"];
  let failedmutations=0;
  fs.closeSync(fs.openSync(failed_mutation_log, 'w'));
  fsExtra.emptyDirSync(screenshots_path);
  fs.closeSync(fs.openSync(mutation_log, 'w'));
  let names = URLS.split(",").map(function (url) {
    return url.split("/").pop().split(".")[0];
  });

  url = helper.generate_command(url);
  await run('build_files/setup', "repository", url);

  DIR = url.split("/").pop();
  
  result = sshSync(
    `/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${TAG} ${VM_USER} ${DIR} ${ITERATION} ${URLS}`, `${VM_USER}@${VM_IP}`
  );

  var content = "";
  fs.writeFile('/bakerx/pipeline/diff.txt', content, err => {})
        
  TAG = "mutation-test";
  for (let i = 1; i <= iterations; i++) {
    console.log(chalk.blueBright("-----------------------------"));
    console.log(chalk.blueBright("Running for ITERATION :"+i));
    console.log(chalk.blueBright("-----------------------------"));
    result = sshSync(
      `/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath} ${TAG} ${VM_USER} ${DIR} ${i} ${URLS}`, `${VM_USER}@${VM_IP}`
    );
  }
  var data=fs.readFileSync(failed_mutation_log);
  var res=data.toString().split('\n').length;
  failedmutations=res-1;
  let compilationerrors=0;
  var result=data.toString().split('\n');
  for(let i=0;i<result.length;i++){
    if(result[i].includes('absent')){
       compilationerrors++;
    }
  }
  console.log(chalk.blueBright("TOTAL ITERATIONS: "+iterations));
  console.log(chalk.blueBright("FAILED MUTATIONS: "+(failedmutations-compilationerrors)));
  console.log(chalk.blueBright("COMPILATION ERRORS: "+compilationerrors));  
  let mutation_coverage=((failedmutations-compilationerrors)/(iterations-compilationerrors))*100;
  console.log(chalk.blueBright("MUTATION COVERAGE (FAILED / (TOTAL - COMPILATION ERRORS)): "+mutation_coverage));
}

async function run_job(data, job) {
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
          await run('build_files/setup', "repository", url);
        }

        else if ("run" in step) {
          console.log("Running " + step["run"] + "\n");
          step = helper.generate_command(step["run"]);
          await run('build_files/setup', "shell", step);
        }

        else if ("mutation" in step) {
          console.log("Running mutations on " + step["mutation"]["url"]);
          await run_mutations(step["mutation"]);
        }
      }
      break;
    }
  }
}
