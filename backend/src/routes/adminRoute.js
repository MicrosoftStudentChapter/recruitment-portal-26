import express from "express";
import {
  getAllCandidates,
  updateCandidateStatus,
  updateCandidateAttendance,
  deleteCandidateById,
  markCandidateAttendance,
  getAttendanceStats,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/candidates", getAllCandidates);
router.patch("/candidates/:id/status", updateCandidateStatus);
router.patch("/candidates/:id/attendance", updateCandidateAttendance);
router.delete("/candidates/:id", deleteCandidateById);

router.post("/attendance", markCandidateAttendance);
router.get("/attendance/stats", getAttendanceStats);

export default router;
