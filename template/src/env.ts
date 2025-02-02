import { config as importEnvFile } from "dotenv";
import { expand as expandEnv } from "dotenv-expand";
import { zod } from "@duplojs/duplojs";

declare global {
    const ENV: typeof import("./env")["default"];
}


for(const pathEnv of [".env.local", ".env"]){
	expandEnv(
		importEnvFile({ path: pathEnv })
	);
}

//@ts-expect-error var 'global' cause type error.
export default global.ENV = zod
	.object({
		PORT: zod.coerce.number().default(1506),
		HOST: zod.string().default("localhost"),
		ENVIRONMENT: zod.enum(["DEV", "PROD"]).default("DEV"),
	})
	.readonly()
	.parse(process.env);
