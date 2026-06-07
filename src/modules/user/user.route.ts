import { Router, type Request, type Response } from "express";
import { userController } from "./userController";

const router = Router();

// create users
router.post("/signup", userController.creteUser);
// get all users
// router.get("/", userController.getAllUsers);

export const userRoute = router;
