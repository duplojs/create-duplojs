import Duplo from "@duplojs/duplojs";
import duploDestructFloor from "@duplojs/destruct-floor";
import duploHttpException from "@duplojs/http-exception";
// import duploMultipart from "@duplojs/multipart";
// import duploCors from "@duplojs/cors";
// import duploSwagger from "@duplojs/swagger";
// import duploCookie from "@duplojs/cookie";
// import duploStatic from "@duplojs/static";
import duploRoutesDirectory, {matchScriptFile} from "@duplojs/routes-directory";

export const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});

duplo.use(duploDestructFloor);
duplo.use(duploHttpException);
// export const multipartProcess = duplo.use(duploMultipart, {uploadFolder: "./upload"});
// duplo.use(duploCors, {allowOrigin: "localhost"});
// duplo.use(duploSwagger, {});
// duplo.use(duploCookie);
// duplo.use(duploStatic, {staticFolder: "./public", prefix: "public"});
duplo.use(
	duploRoutesDirectory, 
	{
		path: "./src/routes",
		matchs: [matchScriptFile(p => import(p))]
	}
).then(() => duplo.launch());
