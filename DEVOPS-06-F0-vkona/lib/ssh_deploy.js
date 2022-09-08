const path = require('path');
const fs   = require('fs');
const os   = require('os');

const child = require('child_process');

//let identifyFile = path.join(os.homedir(), '.bakerx', 'insecure_private_key');
let identityFile=process.cwd()+path.sep+"devops_rsa";
console.log(identityFile);
module.exports = function(cmd, host) {

    if(process.platform=='win32'){
        cmd = `"${cmd}"`;
    }else{
        cmd = `'${cmd}'`;
    }

    let sshArgs = [];
    sshArgs.push(`-i`);
    sshArgs.push(`"${identityFile}"`);
    sshArgs.push(`-o`);
    sshArgs.push(`StrictHostKeyChecking=no`);
    sshArgs.push(`-o`);
    sshArgs.push(`UserKnownHostsFile=/dev/null`);
    sshArgs.push(host);
    sshArgs.push(cmd);

    return child.spawnSync(`ssh`, sshArgs, {stdio: 'inherit', shell: true});
}