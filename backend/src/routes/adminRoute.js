import express from "express";
import {
  getAllCandidates,
  updateCandidateStatus,
  updateCandidateAttendance,
  deleteCandidateById,
  markCandidateAttendance,
  getAttendanceStats,
  lockCandidateForm,
  individualUnlockCandidate,
  updateOwnDetails,
  getGlobalLockStatus,
  setGlobalLockStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/candidates", getAllCandidates);
router.patch("/candidates/:id/status", updateCandidateStatus);
router.patch("/candidates/:id/attendance", updateCandidateAttendance);
router.patch("/candidates/:id/lock", lockCandidateForm);
router.patch("/candidates/:id/individual-unlock", individualUnlockCandidate);
router.delete("/candidates/:id", deleteCandidateById);

router.post("/attendance", markCandidateAttendance);
router.get("/attendance/stats", getAttendanceStats);
router.patch("/candidate-details", updateOwnDetails);

// Global form lock
router.get("/global-lock", getGlobalLockStatus);
router.patch("/global-lock", setGlobalLockStatus);

export default router;
