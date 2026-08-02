"use client";

import React, { useEffect, useState } from "react";
import { classesApi } from "@/lib/api/academic";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function ClassesPage() {
  const [classesList, setClassesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Fetch real data from backend
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await classesApi.getAll();
      setClassesList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      setClassesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Filter real data based on search input
  const filteredClasses = classesList.filter((item) => {
    const query = searchQuery.toLowerCase();
    const className = (item.className || item.name || "").toLowerCase();
    const section = (item.section || "").toLowerCase();
    const id = String(item.code || item.id || "").toLowerCase();

    return className.includes(query) || section.includes(query) || id.includes(query);
  });

  // Checkbox Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredClasses.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
          <nav className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span>Dashboard</span>
            <span>/</span>
            <span>Academic</span>
            <span>/</span>
            <span className="text-slate-600">Classes</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Button */}
          <button
            onClick={fetchClasses}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-sm"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-sm"
            title="Print"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>

          {/* Add Class Button */}
          <Button className="bg-[#5b51ef] hover:bg-[#4b41df] text-white flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm">
            <span className="text-base font-bold">+</span> Add Class
          </Button>
        </div>
      </div>

      {/* 2. Main Card Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Card Header Filter Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">Class List</h2>

          <div className="flex items-center gap-3 flex-wrap">
            <Select className="w-auto py-1.5 text-xs text-slate-700 font-semibold" defaultValue="A-Z">
              <option value="A-Z">Sort By A-Z</option>
              <option value="Z-A">Sort By Z-A</option>
            </Select>
          </div>
        </div>

        {/* Entries Control & Search Input */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Row Per Page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-2.5 py-1 rounded-md border border-slate-300 text-slate-700 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5b51ef]"
            />
          </div>
        </div>

        {/* 3. Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#f8fafc] text-slate-700 font-bold border-y border-slate-200">
              <tr>
                <th className="px-6 py-3.5 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedIds.length === filteredClasses.length &&
                      filteredClasses.length > 0
                    }
                    className="rounded border-slate-300 text-[#5b51ef] focus:ring-[#5b51ef]"
                  />
                </th>
                <th className="px-6 py-3.5">ID / Code</th>
                <th className="px-6 py-3.5">Class Name</th>
                <th className="px-6 py-3.5">Section</th>
                <th className="px-6 py-3.5">No of Students</th>
                <th className="px-6 py-3.5">No of Subjects</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    Loading class records...
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No classes found.
                  </td>
                </tr>
              ) : (
                filteredClasses.slice(0, rowsPerPage).map((c) => {
                  const classId = c.id;
                  const displayCode = c.code || `C${c.id}`;
                  const className = c.className || c.name || "N/A";
                  const section = c.section || "A";
                  const noOfStudents = c.noOfStudents ?? c.studentCount ?? 0;
                  const noOfSubjects = c.noOfSubjects ?? c.subjectCount ?? 0;
                  const isActive = c.status !== "Inactive" && c.active !== false;
                  const isSelected = selectedIds.includes(classId);

                  return (
                    <tr
                      key={classId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-slate-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(classId)}
                          className="rounded border-slate-300 text-[#5b51ef] focus:ring-[#5b51ef]"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#5b51ef]">
                        {displayCode}
                      </td>
                      <td className="px-6 py-4 text-slate-800">{className}</td>
                      <td className="px-6 py-4 text-slate-800">{section}</td>
                      <td className="px-6 py-4 text-slate-700">{noOfStudents}</td>
                      <td className="px-6 py-4 text-slate-700">
                        {String(noOfSubjects).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                            • Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700">
                            • Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === classId ? null : classId)
                          }
                          className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>

                        {activeMenuId === classId && (
                          <div className="absolute right-6 top-10 w-32 bg-white rounded-lg shadow-lg border border-slate-200 z-10 py-1 text-left text-xs">
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Total Records: {filteredClasses.length}</span>
        </div>
      </div>
    </div>
  );
}