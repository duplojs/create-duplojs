export const hasRoleSecurity = duplo
	.declareAbstractRoute("hasRole")
	.options<{ role?: "admin" | "user" }>({})
	.extract({
		headers: {
			role: zod.enum(["admin", "user"]).default("user").ignore()
		},
	})
	.cut(
		({ pickup }) => {
			if (pickup("role") !== pickup("options").role) {
				throw new UnauthorizedHttpException("role.wrong");
			}

			return {};
		},
		undefined,
		new IHaveSentThis(UnauthorizedHttpException.code, "role.wrong")
	)
	.build();
