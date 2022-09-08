const chalk = require('chalk');
const path = require('path');
const os = require('os');

const got = require('got');
const http = require('http');
const httpProxy = require('http-proxy');

exports.command = 'serve';
exports.desc = 'Run traffic proxy.';
exports.builder = yargs => {};

exports.handler = async argv => {
    console.log( "hiii");
    const { } = argv;

    (async () => {

        await run( );

    })();

};

const BLUE  = "http://"+process.env.blue+":3000";
const GREEN = "http://"+process.env.green+":3000";
console.log(BLUE);
console.log(GREEN);
class Production
{
    constructor()
    {
        this.TARGET = GREEN;
        setInterval( this.healthCheck.bind(this), 5000 );
    }

    // TASK 1: 
    proxy()
    {
        let options = {};
        let proxy   = httpProxy.createProxyServer(options);
        let self = this;
        // Redirect requests to the active TARGET (BLUE or GREEN)
        let server  = http.createServer(function(req, res)
        {
            // callback for redirecting requests.
            proxy.web( req, res, {target: self.TARGET } );
        });
        server.listen(3090);
   }

   failover()
   {
      this.TARGET = BLUE;
   }

   async healthCheck()
   {
      try 
      {
         const response = await got(this.TARGET, {throwHttpErrors: false});
         let status = response.statusCode == 200 ? chalk.green(response.statusCode) : chalk.red(response.statusCode);
         if (this.TARGET == GREEN){console.log("Server Green");}
         if (this.TARGET == BLUE){console.log("Server Blue");}
         if (this.TARGET == GREEN && response.statusCode!=200){
             this.failover();
         }

         console.log( chalk`{grey Health check on ${this.TARGET}}: ${status}`);
      }
      catch (error) {
          this.failover();
      }
   }
   
}

async function run() {

    console.log(chalk.keyword('pink')('Starting proxy on localhost:3090'));

    let prod = new Production();
    prod.proxy();

}