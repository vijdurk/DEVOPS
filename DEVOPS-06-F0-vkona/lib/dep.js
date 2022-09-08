const hasbin = require("hasbin");
const child  = require("child_process");
const chalk  = require("chalk")
const path   = require("path");

const envPath = path.join( path.dirname(require.main.filename), '.env');

const mustBin = (bin, hint) => {
    hint = hint || '';    
    if (!hasbin.sync(bin)) throw new Error(`You must have ${bin} installed to run a vm. ${hint}`);
}

const mustEnv = (env, hint) => {
    if( ! process.env.hasOwnProperty(env) ) {
        throw new Error(`You must have ${env} defined. ${hint}`);
    }
}

exports.check = async argv => {
    let cmd = argv._[0];

    let processor = "Intel/Amd64";

    try { 
        let output = child.execSync("uname -a").toString();
        if( output.match(/Darwin.*arm64/) ) {
            console.log( chalk.yellow("Mac M1 detected") );
            processor = "Arm64";
            mustBin("basicvm");
        } else {
            mustBin('VBoxManage');
        }

        let results = require('dotenv').config({path:envPath});

        if( results.error ) {
            console.log( chalk.red( "You should have a .env containing project specific environment variables" ));
            process.exit(1)        
        } else {
            console.log(chalk.blueBright("TEAM DEVOPS-06"));
            console.log(chalk.blueBright("----------------\n"));
            console.log( chalk.blueBright(`LOADED .env FILE\n`));
        }
        
    } catch ( err ) {
        console.log( chalk.red( err.message ));
        process.exit(1);
    }

    return {processor};
}
