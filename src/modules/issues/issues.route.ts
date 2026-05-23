import { Router } from "express";
import auth from "../../middleware/auth.js";
import { issueController } from "./issues.controller.js";

const router = Router();

router.post("/", auth("contributor", "maintainer"), issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch("/:id", auth("contributor", "maintainer"), issueController.updateIssue);
router.patch("/:id/status", auth("maintainer"), issueController.updateIssueStatus);
router.delete("/:id", auth("maintainer"), issueController.deleteIssue);

export const issueRoute = router;
