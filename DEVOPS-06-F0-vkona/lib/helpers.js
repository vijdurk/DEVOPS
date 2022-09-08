const fs = require("fs");
const path = require("path");
const resemble = require("node-resemble-js");


exports.get_filename = function get_filename(yamlfile) {
    console.log(process.cwd());
    if (fs.existsSync(path.resolve(process.cwd() + path.sep + yamlfile))) {
      return path.resolve(process.cwd() + path.sep + yamlfile)
    }
    else if (fs.existsSync(yamlfile)) {
      return yamlfile
    }
    else {
      return false
    }
  }
  
  exports.get_tag_for_step = function get_tag_for_step(step) {
    step = new String(step);
    if (step.startsWith("URL=")) {
      return "repository"
    }
    else if (step.startsWith("CMD=")) {
        return "shell"
    }
    else if (step.startsWith("REMOVE=")) {
      return "remove"
  }
    else {
      return "package"
    }
  }

  exports.generate_command = function generate_command(step) {
    for (var token in process.env) {
      if (step.includes("{{ " + token + " }}")) {
        var value = eval(`process.env.${token}`);
        step = step.replace("{{ " + token + " }}", value);
      }
    }
    return step;
  }