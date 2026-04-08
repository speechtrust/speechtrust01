import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { finishAssessment, getHistory, getSessionDetails, startAssessment, submitAnswer } from "../controllers/assessment.controller.js";

const router = Router();

router.route("/start").post(verifyJWT, startAssessment);
router.route("/answer").post(verifyJWT,upload.single("audio"), submitAnswer);
router.route("/finish").post(verifyJWT, finishAssessment);
router.route("/history").get(verifyJWT, getHistory);
router.route("/result/:sessionId").get(verifyJWT, getSessionDetails);

export default router;