import { supabaseAdmin } from "../config/supabase.js";

export async function fetchAllCandidates() {
  const { data, error } = await supabaseAdmin
    .from("candidate_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateStatus(id, status) {
  const { data, error } = await supabaseAdmin
    .from("candidate_profiles")
    .update({ application_status: status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAttendance(id, present) {
  const updatePayload = {
    quiz_attended: present,
    quiz_attended_at: present ? new Date().toISOString() : null,
  };

  const { data, error } = await supabaseAdmin
    .from("candidate_profiles")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCandidate(id) {
  const { error } = await supabaseAdmin
    .from("candidate_profiles")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function markQuizAttendance(qrToken) {
  const { data: candidate, error: candidateError } = await supabaseAdmin
    .from("candidate_profiles")
    .select("*")
    .eq("qr_token", qrToken)
    .single();

  if (candidateError || !candidate) {
    throw new Error("Candidate not found");
  }

  if (candidate.quiz_attended) {
    return { alreadyPresent: true, candidate };
  }

  const { data: updatedCandidate, error: updateError } = await supabaseAdmin
    .from("candidate_profiles")
    .update({
      quiz_attended: true,
      quiz_attended_at: new Date().toISOString(),
    })
    .eq("id", candidate.id)
    .select()
    .single();

  if (updateError) throw updateError;

  return { alreadyPresent: false, candidate: updatedCandidate };
}

export async function getAttendanceStatsService() {
  const { count: totalCandidates, error: totalError } = await supabaseAdmin
    .from("candidate_profiles")
    .select("*", { count: "exact", head: true });

  if (totalError) throw totalError;

  const { count: presentCandidates, error: presentError } = await supabaseAdmin
    .from("candidate_profiles")
    .select("*", { count: "exact", head: true })
    .eq("quiz_attended", true);

  if (presentError) throw presentError;

  return { totalCandidates, presentCandidates };
}

// ── Form lock ──────────────────────────────────────────────────────────────

export async function toggleFormLock(id, locked) {
  // When unlocking an individual candidate, also clear the individual_unlock
  // override so it starts fresh. When locking, clear the override too (no
  // point keeping it if the admin explicitly locks them individually).
  const { data, error } = await supabaseAdmin
    .from("candidate_profiles")
    .update({ form_locked: locked, individual_unlock: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── Individual unlock override (used when global lock is active) ───────────

export async function setIndividualUnlock(id, unlocked) {
  // individual_unlock = true means "exempt this candidate from the global lock"
  // We also clear form_locked when granting the override so the form opens.
  const updatePayload = unlocked
    ? { individual_unlock: true, form_locked: false }
    : { individual_unlock: false };

  const { data, error } = await supabaseAdmin
    .from("candidate_profiles")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── Global form lock ───────────────────────────────────────────────────────

export async function getGlobalLock() {
  const { data, error } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", "global_form_locked")
    .maybeSingle();

  if (error) throw error;
  return data?.value === "true";
}

export async function setGlobalLock(locked) {
  const { error } = await supabaseAdmin
    .from("app_settings")
    .upsert(
      { key: "global_form_locked", value: String(locked) },
      { onConflict: "key" }
    );

  if (error) throw error;
  return locked;
}

// ── Candidate self-edit ────────────────────────────────────────────────────

const EDITABLE_FIELDS = [
  "full_name",
  "date_of_birth",
  "attendance",
  "join_reason",
  "primary_department",
  "secondary_department",
  "other_societies",
  "recruit_reason",
];

export async function updateCandidateDetails(userId, body) {
  // Fetch the candidate profile. individual_unlock may not exist yet if the
  // DB migration hasn't run — handle that gracefully with a fallback query.
  let existing = null;

  const { data: profileData, error: fetchError } = await supabaseAdmin
    .from("candidate_profiles")
    .select("id, form_locked, individual_unlock")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    // If the error is about the individual_unlock column not existing yet,
    // fall back to a query without it so existing installs keep working.
    const msg = (fetchError.message || "").toLowerCase();
    const isColumnMissing =
      msg.includes("individual_unlock") ||
      fetchError.code === "42703";

    if (!isColumnMissing) throw new Error("Failed to fetch candidate profile.");

    const { data: fallback, error: fallbackError } = await supabaseAdmin
      .from("candidate_profiles")
      .select("id, form_locked")
      .eq("user_id", userId)
      .maybeSingle();

    if (fallbackError) throw new Error("Failed to fetch candidate profile.");
    existing = fallback ? { ...fallback, individual_unlock: false } : null;
  } else {
    existing = profileData;
  }

  if (!existing) throw new Error("Candidate profile not found.");

  // Check global lock first — but respect individual_unlock override
  const globallyLocked = await getGlobalLock();
  if (globallyLocked && !existing.individual_unlock)
    throw new Error(
      "Registrations are closed. No further changes can be made.",
    );

  if (existing.form_locked)
    throw new Error(
      "Your form has been locked by the admin. No further changes can be made.",
    );

  // Build a safe update payload — only allowed fields
  const payload = {};
  for (const field of EDITABLE_FIELDS) {
    if (
      body[field] !== undefined &&
      body[field] !== null &&
      String(body[field]).trim() !== ""
    ) {
      payload[field] = String(body[field]).trim();
    }
  }

  if (!Object.keys(payload).length) {
    throw new Error("No valid fields provided for update.");
  }

  const { data, error } = await supabaseAdmin
    .from("candidate_profiles")
    .update(payload)
    .eq("id", existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
