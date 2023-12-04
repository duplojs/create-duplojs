import {execSync} from "child_process";
import {copyFileSync, mkdirSync, readdirSync, writeFileSync} from "fs";
import {resolve} from "path";

const templatePath = __dirname + "/../template";

for(const file of readdirSync(templatePath)){
	copyFileSync(resolve(templatePath, file), resolve(file));
}

mkdirSync(resolve("src/routes"), {recursive: true});
mkdirSync(resolve("src/checkers"), {recursive: true});
mkdirSync(resolve("src/security"), {recursive: true});

writeFileSync(
	resolve("src/checkers/isOdd.ts"),
	/* js */`import {duplo} from "../../main";
	
export const isOdd = duplo.createChecker(
	"isOdd",
	{
		handler(number: number, output){
			if(number % 2 === 0){
				return output("odd", number);
			}
			else {
				return output("notOdd", number);
			}
		},
		outputInfo: ["odd", "notOdd"]
	}
);

`
);


writeFileSync(
	resolve("src/routes/index.ts"),
	/* js */`import {zod} from "@duplojs/duplojs";
import {OkHttpException, BadRequestHttpException} from "@duplojs/http-exception";
import {duplo} from "../../main";
import {isOdd} from "../checkers/isOdd";
	
duplo
.declareRoute("GET", "/")
.extract(
	{
		query: {
			number: zod.coerce.number(),
		}
	},
	(response) => {
		throw new BadRequestHttpException("error", "Need query number !");
	}
)
.check(
	isOdd,
	{
		input: (pickup) => pickup("number"),
		result: "odd",
		catch: (response, info, data) => {
			throw new BadRequestHttpException(info, data + " is not odd !");
		},
		indexing: "result"
	}
)
.handler(({d: {result}}) => {
	throw new OkHttpException("success", result + " is odd !");
});

`
);

execSync("npm i", {stdio: "inherit"});
execSync("npm run dev", {stdio: "inherit"});
