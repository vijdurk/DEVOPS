const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');

const inventoryPath = process.cwd() + path.sep + 'pipeline' + path.sep + 'inventory.ini';
const filePath = '/bakerx/pipeline/build.yml';

exports.command = 'init';
exports.desc = 'Prepare the tool to provision and configure the configuration server';
exports.builder = yargs => {
    yargs.options({
        privateKey: {
            describe: 'Install the provided private key on the configuration server',
            type: 'string'
        }
    });
};

exports.handler = async argv => {
    const { privateKey} = argv;
    console.log(chalk.blueBright("\nPREPARING COMPUTING ENVIRONMENT"));
    console.log(chalk.blueBright("-------------------------------\n"));

    (async () => {

       await run (privateKey);

    })();

};

async function run(privateKey){
    let VM_IP=process.env.VM_IP;
    let VM_USER = process.env.VM_USER;

    console.log(chalk.blueBright('\nINSTALLING CONFIG SERVER'));
    console.log(chalk.blueBright('------------------------\n'));
    console.log(chalk.blueBright('\nPROVISIONING CONFIG SERVER'));
    console.log(chalk.blueBright('--------------------------\n'));
    let result = child.spawnSync(`bakerx`, `run project-vm focal --ip ${VM_IP} --sync --memory 3072`.split(' '), {shell:true, stdio: 'inherit'} );
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('\nInstalling privateKey on configuration server'));
    console.log(chalk.blueBright('---------------------------------------------\n'));
    let identifyFile = privateKey || path.join(os.homedir(), '.bakerx', 'insecure_private_key');
    result = scpSync (identifyFile, `${VM_USER}@${VM_IP}:/home/${VM_USER}/.ssh/baker_rsa`);
    let prod_inv=process.cwd()+path.sep+"devops_rsa";
    result1 = scpSync (prod_inv, `${VM_USER}@${VM_IP}:/home/${VM_USER}/.ssh/devops_rsa`);
    if( result.error ) { console.log(result); process.exit( result.status );}
    if( result1.error ) { console.log(result1); process.exit( result1.status );}

    console.log(chalk.blueBright('\nRunning init script'));
    console.log(chalk.blueBright('-------------------\n'));
    result = sshSync('chmod +x /bakerx/pipeline/server-init.sh', `${VM_USER}@${VM_IP}`);
    if( result.error ) { console.log(result.error); process.exit( result.status ); }
    result = sshSync('/bakerx/pipeline/server-init.sh', `${VM_USER}@${VM_IP}`);
    if( result.error ) { console.log(result.error); process.exit( result.status ); }

    console.log(chalk.blueBright('\nRunning ansible script'));
    console.log(chalk.blueBright('----------------------\n'));
    result = sshSync('chmod +x /bakerx/pipeline/run-ansible.sh', `${VM_USER}@${VM_IP}`);
    if( result.error ) { console.log(result.error); process.exit( result.status ); }
    if( result.error ) { process.exit( result.status ); } 

    let data = `[project]\n${VM_IP} ansible_ssh_private_key_file=~/.ssh/baker_rsa ansible_user=${VM_USER}\n[project:vars]\nansible_ssh_common_args='-o StrictHostKeyChecking=no'`;
    console.log(chalk.blueBright(`\nBasic user information about connecting to the VM`));
    console.log(chalk.blueBright('-------------------------------------------------\n'));
    console.log(chalk.blueBright(`Information stored in ${inventoryPath} on local machine\n`));
    console.log(data);
    fs.writeFile( inventoryPath, data, { flag: 'w' }, (err) => {if (err) throw err;});
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}