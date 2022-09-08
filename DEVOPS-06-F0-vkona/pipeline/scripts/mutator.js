const esprima = require("esprima");
const escodegen = require("escodegen");
const options = {tokens:true, tolerant: true, loc: true, range: true };
const fs = require("fs");
const chalk = require('chalk');
const path = require ('path');
const sshSync = require("../../lib/ssh");

const { randomInt } = require("crypto");
const e = require("express");

let operations = [ ConditionalBoundaryMutations, IncrementalMutations, NegateConditionals, ControlFlow, ConditionalExpression, CloneReturn, NonEmptyString, ConstantReplacement]

function rewrite( filepath, newPath ) {

    var buf = fs.readFileSync(filepath, "utf8");
    var ast = esprima.parse(buf, options);    

    let op = operations[getRandomInt(operations.length)];
    //let op = operations[5];

    op(ast);

    let code = escodegen.generate(ast);
    fs.writeFileSync( newPath, code);
}

function ConditionalBoundaryMutations(ast) {

    let candidates = 0;
    const swap_conditional = { ">" : ">=" , "<" :"<=", "<=" : "<", ">=": ">"};
    let random_operator = getRandomInt(Object.keys(swap_conditional).length);
    traverseWithParents(ast, (node) => {
        if( node.type === "BinaryExpression" &&  node.operator === Object.keys(swap_conditional)[random_operator] ) {
            candidates++;
        }
    })
    if (candidates == 0){
            console.log(chalk.blueBright('No matching conditon!'));
            return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "BinaryExpression" && node.operator === Object.keys(swap_conditional)[random_operator] ) {
            if( current === mutateTarget ) {
                node.operator = swap_conditional[Object.keys(swap_conditional)[random_operator]];
                //console.log(chalk.blueBright(swap_conditional[Object.keys(swap_conditional)[random_operator]]));
                console.log( chalk.blueBright(`Replacing conditional boundary from ${Object.keys(swap_conditional)[random_operator] } to ${swap_conditional[Object.keys(swap_conditional)[random_operator]]} on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}

function IncrementalMutations(ast) {

    let candidates = 0;
    const swap_incremental = { "++" : "--" , "--" : "++" };
    let random_operator = getRandomInt(Object.keys(swap_incremental).length);
    //console.log(Object.keys(swap_incremental)[random_operator]);
    traverseWithParents(ast, (node) => {
        if( node.type === "UpdateExpression" &&  node.operator === Object.keys(swap_incremental)[random_operator]) {
            candidates++;
        }
    })
    if (candidates == 0){
        console.log(chalk.blueBright('No matching conditon!'));
        return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "UpdateExpression" && node.operator === Object.keys(swap_incremental)[random_operator]) {
            if( current === mutateTarget ){
                if (node.prefix === true){
                    node.prefix = false;
                    //node.operator = swap_incremental[Object.keys(swap_incremental)[random_operator]];
                    //console.log(swap_incremental[Object.keys(swap_incremental)[random_operator]]);
                    console.log( chalk.blueBright(`Replacing Incremental conditionals from ${Object.keys(swap_incremental)[random_operator] } ${node.argument.name}  to  ${node.argument.name} ${swap_incremental[Object.keys(swap_incremental)[random_operator]]} on line ${node.loc.start.line}` ));
                }
                else if ( node.prefix === false)
                {
                    if ( node.operator === "++"){
                        node.operator = "--";
                        //console.log(swap_incremental[Object.keys(swap_incremental)[random_operator]]);
                        console.log( chalk.blueBright(`Replacing Incremental conditionals from ${Object.keys(swap_incremental)[random_operator] } ${node.argument.name} to ${node.argument.name} ${swap_incremental[Object.keys(swap_incremental)[random_operator]]} on line ${node.loc.start.line}` ));
                    }
                    else{
                        node.operator = "++";
                        //console.log(swap_incremental[Object.keys(swap_incremental)[random_operator]]);
                        console.log( chalk.blueBright(`Replacing Incremental conditionals from ${Object.keys(swap_incremental)[random_operator] } ${node.argument.name} to ${node.argument.name} ${swap_incremental[Object.keys(swap_incremental)[random_operator]]} on line ${node.loc.start.line}` ));
                    }
                }
                else
                {
                    node.operator = swap_incremental[Object.keys(swap_incremental)[random_operator]];
                    //console.log(swap_incremental[Object.keys(swap_incremental)[random_operator]]);
                    console.log( chalk.blueBright(`Replacing Incremental conditionals from ${Object.keys(swap_incremental)[random_operator] } to ${swap_incremental[Object.keys(swap_incremental)[random_operator]]} on line ${node.loc.start.line}` ));
                }
            }
            current++;
        }
    })
}

function NegateConditionals(ast) {

    let candidates = 0;
    const swap_negate = { "==" : "!=" , ">" :"<", "!=" : "==", "<=" : ">", ">=": "<", "<": ">=", ">": "<="};
    let random_operator = getRandomInt(Object.keys(swap_negate).length);
    //console.log(Object.keys(swap_negate)[random_operator]);

    traverseWithParents(ast, (node) => {
        if( node.type === "BinaryExpression" &&  node.operator === Object.keys(swap_negate)[random_operator] ) {
            candidates++;
        }
    })
    if (candidates == 0){
        console.log(chalk.blueBright('No matching conditon!'));
        return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "BinaryExpression" && node.operator === Object.keys(swap_negate)[random_operator] ) {
            if( current === mutateTarget ) {
                node.operator = swap_negate[Object.keys(swap_negate)[random_operator]];
                //console.log(swap_negate[Object.keys(swap_negate)[random_operator]]);
                console.log( chalk.blueBright(`Replacing Negate conditionals from ${Object.keys(swap_negate)[random_operator] } to ${swap_negate[Object.keys(swap_negate)[random_operator]]} on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}

function ControlFlow(ast) {

    let  prev_node = null;
    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if (node.type === "IfStatement" && prev_node && prev_node.parent.parent.type === "IfStatement" && (!prev_node.parent.parent.alternate || prev_node.parent.parent.alternate.type === "IfStatement")) {
            candidates++;
        }        
        prev_node = node;
    })
    if (candidates == 0)
    {
        console.log(chalk.red('No matching condition!'));
        return 0;
    }

    let random_candidate = getRandomInt(candidates);
    prev_node = null;
    let current = 0;
    traverseWithParents(ast, (node) => {
        
        if (node.type === "IfStatement" && prev_node && prev_node.parent.parent.type === "IfStatement" && (!prev_node.parent.parent.alternate || prev_node.parent.parent.alternate.type === "IfStatement")) {
            if(current===random_candidate){
            
                let cur_node = prev_node.parent.parent;
                while (cur_node.alternate && cur_node.alternate.type === "IfStatement") {
                    cur_node = cur_node.alternate;
                }
                cur_node.alternate = node;
                let cur_index = node.parent.indexOf(node);
                node.parent.splice(cur_index,childrenLength(node));
                
                console.log( chalk.blueBright(`Replacing Control Flow(if-> else if) on line ${node.loc.start.line}` ));
            }
            current++;
        }
        prev_node = node;
    })

}

function ConditionalExpression(ast) {

    let candidates = 0;
    const swap_condexpression = { "&&" : "||" , "||" : "&&"};
    let random_operator = getRandomInt(Object.keys(swap_condexpression).length);
    //console.log(Object.keys(swap_condexpression)[random_operator]);

    traverseWithParents(ast, (node) => {
        if( node.type === "LogicalExpression" &&  node.operator === Object.keys(swap_condexpression)[random_operator] ) {
            candidates++;
        }
    })

    if (candidates == 0){
        console.log(chalk.blueBright('No matching conditon!'));
        return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "LogicalExpression" && node.operator === Object.keys(swap_condexpression)[random_operator] ) {
            if( current === mutateTarget ) {
                node.operator = swap_condexpression[Object.keys(swap_condexpression)[random_operator]];
                //console.log(swap_condexpression[Object.keys(swap_condexpression)[random_operator]]);
                console.log( chalk.blueBright(`Replacing conditional expression from ${Object.keys(swap_condexpression)[random_operator] } to ${swap_condexpression[Object.keys(swap_condexpression)[random_operator]]} on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}

function CloneReturn(ast) {
    let candidates = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "ReturnStatement" &&  node.argument.name === "embeddedHtml" ) {
            candidates++;
        }
    })
    if (candidates == 0){
        console.log(chalk.blueBright('No matching conditon!'));
        return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "ReturnStatement" || (node.type === "FunctionDeclaration" &&  node.id.name === "processInnerText") ) {
            if( current === mutateTarget ) {
                //node.type = "ReturnStatement";
                //node.argument.name = "embeddedHtml";
                let index_ptr = node.parent.indexOf(node);
                node.parent.splice(getRandomInt(index_ptr-1),0,node);
                console.log( chalk.blueBright(`Changing Clone Return for "retun ${node.argument.name}" from line number ${node.loc.start.line} to a random location of the function ( before declarataion )` ));
            }
            current++;
        }
    })

}

function NonEmptyString(ast) {

    let candidates = 0;
    const swap_nonempty = { "" : "<div>Bug</div>"};
    let random_operator = getRandomInt(Object.keys(swap_nonempty).length);
    //console.log(Object.keys(swap_nonempty)[random_operator]);

    traverseWithParents(ast, (node) => {
        if( node.type === "Literal" &&  node.value === Object.keys(swap_nonempty)[random_operator] ) {
            candidates++;
        }
    })
    if (candidates == 0){
        console.log(chalk.blueBright('No matching conditon!'));
        return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "Literal" && node.value === Object.keys(swap_nonempty)[random_operator] ) {
            if( current === mutateTarget ) {
                node.value = swap_nonempty[Object.keys(swap_nonempty)[random_operator]];
                //console.log(swap_nonempty[Object.keys(swap_nonempty)[random_operator]]);
                console.log( chalk.blueBright(`Replacing non empty strigs from ${Object.keys(swap_nonempty)[random_operator] } to ${swap_nonempty[Object.keys(swap_nonempty)[random_operator]]} on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}

function ConstantReplacement(ast) {

    let candidates = 0;
    const swap_constr = { "3" : "0" , "0" :"3" , "5": "2", "2" : "5"};
    let random_operator = getRandomInt(Object.keys(swap_constr).length);
    //console.log(Object.keys(swap_constr)[random_operator]);

    traverseWithParents(ast, (node) => {
        if( node.type === "Numeric" &&  node.value === Object.keys(swap_constr)[random_operator] ) {
            candidates++;
        }
    })
    if (candidates == 0){
        console.log(chalk.blueBright('No matching conditon!'));
        return 0;
    }
    let mutateTarget = getRandomInt(candidates);
    let current = 0;
    traverseWithParents(ast, (node) => {
        if( node.type === "Numeric" && node.value === Object.keys(swap_constr)[random_operator] ) {
            if( current === mutateTarget ) {
                node.operator = swap_constr[Object.keys(swap_constr)[random_operator]];
                //console.log(swap_constr[Object.keys(swap_constr)[random_operator]]);
                console.log( chalk.blueBright(`Replacing constants from ${Object.keys(swap_constr)[random_operator] } to ${swap_constr[Object.keys(swap_constr)[random_operator]]} on line ${node.loc.start.line}` ));
            }
            current++;
        }
    })

}

rewrite("/home/vagrant/checkbox.io-micro-preview/marqdown.js",
"/home/vagrant/checkbox.io-micro-preview/marqdown-mod.js")
//rewrite(process.cwd()+path.sep+"marqdown.js", 
//process.cwd()+path.sep+"marqdown-mod.js")

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}


// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}