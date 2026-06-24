import { useMemo, useState } from "react";

const DEPT_ORDER = ["Tech", "Design", "Marketing", "Content", "Media"];

export function useCandidateFilters(candidates) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptSort, setDeptSort] = useState("All");

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch = `${candidate.full_name}
        ${candidate.email}
        ${candidate.application_number}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || candidate.application_status === statusFilter;

      const matchesDept =
        deptSort === "All" ||
        candidate.primary_department === deptSort ||
        candidate.secondary_department === deptSort;

      return matchesSearch && matchesStatus && matchesDept;
    });

    // Sort alphabetically within the filtered set, grouped by department order
    if (deptSort === "All") {
      filtered.sort((a, b) => {
        const ai = DEPT_ORDER.indexOf(a.primary_department);
        const bi = DEPT_ORDER.indexOf(b.primary_department);
        const deptDiff = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        if (deptDiff !== 0) return deptDiff;
        return (a.full_name ?? "").localeCompare(b.full_name ?? "");
      });
    } else {
      // Primary department matches come before secondary matches, then alphabetically
      filtered.sort((a, b) => {
        const aPrimary = a.primary_department === deptSort ? 0 : 1;
        const bPrimary = b.primary_department === deptSort ? 0 : 1;
        if (aPrimary !== bPrimary) return aPrimary - bPrimary;
        return (a.full_name ?? "").localeCompare(b.full_name ?? "");
      });
    }

    return filtered;
  }, [candidates, search, statusFilter, deptSort]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    deptSort,
    setDeptSort,
    filteredCandidates,
  };
}
