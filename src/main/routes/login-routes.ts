import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSignupController } from "../factories/controllers/make-signup-controller";
import { makeLoginController } from "../factories/controllers/make-login-controller";

export default (router: Router) => {
	router.post("/signup", adaptRoute(makeSignupController()));
	router.post("/login", adaptRoute(makeLoginController()));
};
