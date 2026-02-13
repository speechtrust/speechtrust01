import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { finishAssessment, startAssessment, Submitanswer } from "../controllers/assessment.controller.js";

const router = Router();

router.route("/start").post(verifyJWT, startAssessment);
router.route("/answer").post(verifyJWT, Submitanswer);
router.route("/finish").post(verifyJWT, finishAssessment);

export default router;