import Duplo, { zod, HttpMethods } from "@duplojs/duplojs";
import duploHttpException from "@duplojs/http-exception";
import duploRoutesDirectory, { matchScriptFile } from "@duplojs/routes-directory";
import duploSwagger from "@duplojs/swagger";
import duploWhatWasSent from "@duplojs/what-was-sent";
import { ZodAccelerator } from "@duplojs/zod-accelerator";
import duploTypeGenerator from "@duplojs/to/plugin";
import "./env";

declare global {
	const duplo: typeof import("./main.js")["duplo"];
	const zod: typeof import("./main.js")["zod"];
	type Methods = HttpMethods;
}

const duplo = Duplo({
	port: ENV.PORT,
	host: ENV.HOST,
	environment: ENV.ENVIRONMENT,
	globals: true,
});

export {
	duplo,
	zod
};

duplo.advancedUse(
	duploSwagger,
	{
		default: { globals: true, disabledDoc: true },
		DEV: { disabledDoc: false },
	}
);

duplo.advancedUse(
	duploWhatWasSent,
	{
		default: { globals: true, enabled: true },
		PROD: { enabled: false },
	}
);

duplo.use(duploHttpException, { globals: true });

duplo.use(
	ZodAccelerator.duplojs,
	{
		DEV: true,
		PROD: true
	}
);

duplo.use(duploTypeGenerator, { outputFile: "./EnrichedDuploTo.d.ts" });

duplo.use(
	duploRoutesDirectory,
	{
		path: "src/routes",
		matchs: [matchScriptFile]
	}
).then(() => {
	duplo.launch(() => {
		console.log(`Ready on ${ENV.ENVIRONMENT}:${ENV.HOST}:${ENV.PORT}`);
	});
});
