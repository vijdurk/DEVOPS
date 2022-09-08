const child = require("child_process");
const chalk = require("chalk");
const path = require("path");
const os = require("os");
const fs = require("fs");
const sshSync = require("../lib/ssh");
const { default: axios } = require("axios");
const prodInventory = process.cwd() + path.sep + 'pipeline' + path.sep + "inventory";
const envFile = process.cwd() + path.sep + ".env";

var config = {};
config.token = process.env.DO_TOKEN;

if( !config.token )
{
	console.log(chalk`{red.bold DO_TOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));


exports.command = "prod <command>";
exports.desc = "Provision cloud instances and control plane";

exports.builder = (yargs) => {
  yargs.options({});
};

exports.handler = async (argv) => {
  const { command } = argv;
  (async () => {
    if (command == "up") {
      await run();
    } else {
      console.log("Command not found");
    }
  })();
};

const headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

async function run() {
	let prodInventoryData = "";
	let envFileData = "";
    console.log(chalk.greenBright("Provisioning VMs"));

	let sv1_name = "blue";
	let sv2_name = "green";

    let sv1_id = await createDroplet(sv1_name);
    let sv1_ip = await dropletInfo(sv1_id);
	prodInventoryData += `[${sv1_name}]\n${sv1_ip} ansible_ssh_private_key_file=~/.ssh/devops_rsa ansible_user=root\n[${sv1_name}:vars]\nansible_ssh_common_args='-o StrictHostKeyChecking=no'\n`;
	envFileData +=`\n${sv1_name}=${sv1_ip}`;

	let sv2_id = await createDroplet(sv2_name);
    let sv2_ip = await dropletInfo(sv2_id);
	prodInventoryData += `[${sv2_name}]\n${sv2_ip} ansible_ssh_private_key_file=~/.ssh/devops_rsa ansible_user=root\n[${sv2_name}:vars]\nansible_ssh_common_args='-o StrictHostKeyChecking=no'`;
	envFileData +=`\n${sv2_name}=${sv2_ip}`;
	fs.writeFile( prodInventory, prodInventoryData, { flag: 'w' }, (err) => {if (err) throw err;});
	fs.writeFile( envFile, envFileData, {flag: 'a'}, (err)=> {if (err) throw err;});
};

async function createDroplet ( dropletName ) {

	// -------------------- Get RSA fingerprint helper code --------------------
    //let ssh_response = await axios.get("https://api.digitalocean.com/v2/account/keys", {headers:headers});
    //console.log(ssh_response.data.ssh_keys);
	// -------------------------------------------------------------------------

	var data = {
		"name": dropletName,
		"region":"nyc1",
		"size":"s-1vcpu-1gb",
		"image":"106421232",
		"ssh_keys":[process.env.RSA_FINGERPRINT],
		"backups":false,
		"ipv6":false,
		"user_data":null,
		"private_networking":null
	};

	// console.log("Creating server with configuration: "+ JSON.stringify(data) );

	let response = await axios.post("https://api.digitalocean.com/v2/droplets", data, {
		headers:headers,
	}).catch( err => 
		console.error(chalk.red(`createDroplet: ${err}`)) 
	);

	if( !response ) return;

	// console.log(response.status);
	// console.log(response.data);

	if(response.status == 202)
	{
		console.log(chalk.green(`Created droplet id ${response.data.droplet.id}`));
	}

    console.log(`Waiting for provisioning...`);

	/* As mentioned on the webpage 
	https://www.digitalocean.com/community/questions/network-details-not-returned-on-api-droplet-creation,
	""When you make a command to create a droplet the API needs to give you an immediate response, but actually
	provisioning of the Droplet (including associating i with IP addresses) might take up to 55 seconds.""
	Hence adding a delay of 60 seconds to enable provisioning and network properties. */

	await new Promise(r => setTimeout(r, 60000));

	console.log(`Provisioning complete. Droplet ready for use!`);
	console.log(``);

	return response.data.droplet.id;
};

async function dropletInfo (id) {
	if( typeof id != "number" ) {
		console.log( chalk.red("You must provide an integer id for your droplet!") );
		return;
	}

	let url = "https://api.digitalocean.com/v2/droplets/" + id;

	let response = await axios.get(url, {
		headers:headers,
	}).catch( err => 
		console.error(chalk.red(`fetchDropletIp: ${err}`)) 
	);

	if( !response ) return;

	if( response.data.droplet ) {
		let droplet = response.data.droplet;
		let ip = "";

		// console.log(droplet);
		
		for (var i = 0; i < droplet.networks.v4.length; i++) {
			console.log(`IP Address: ${droplet.networks.v4[i]['ip_address']}, Type: ${droplet.networks.v4[i]['type']}`);
			if (droplet.networks.v4[i]['type'] == "public") {
				ip = droplet.networks.v4[i]['ip_address'];
			}
		}

		return ip;
	}
};