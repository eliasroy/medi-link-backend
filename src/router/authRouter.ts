import { Router } from "express";
import { login } from "../controller/authController";
import { changePasswordByEmail } from "../controller/passwordChangeController";

const router = Router();

router.post("/login", login);
router.post("/change-password", changePasswordByEmail);

export default router;
