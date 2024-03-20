import {execSync} from "child_process";
import {cpSync} from "fs";

const templatePath = __dirname + "/../template";

cpSync(templatePath, process.cwd(), {recursive: true});

execSync("npm i", {stdio: "inherit"});
