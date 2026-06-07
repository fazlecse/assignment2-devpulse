import { Router } from "express";
import { issueController } from "./issues.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();
// Create issues
router.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issueController.createIssue,
);
// Get all issues
router.get("/", issueController.getAllIssues);
// Get single issue
router.get("/:id", issueController.getSingleIssue);
// Update issue
router.put(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issueController.updateIssue,
);
// Delete issue
router.delete("/:id", auth(USER_ROLE.maintainer), issueController.deleteIssue);
export const issuesRoute = router;
