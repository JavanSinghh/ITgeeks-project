"use client";

import React from "react";
import { Search, Filter, Calendar, User, X, Sparkles } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  searchType: "semantic" | "attributed" | "temporal";
  setSearchType: (type: "semantic" | "attributed" | "temporal") => void;
  senderFilter: string;
  setSenderFilter: (sender: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  participants: string[];
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchBar({
  query,
  setQuery,
  searchType,
  setSearchType,
  senderFilter,
  setSenderFilter,
  dateFilter,
  setDateFilter,
  participants,
  onSearch,
  onClear
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
      {/* Search Input Box */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b", width: "20px", height: "20px" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type any search query in Hinglish or English (e.g. 'when did we decide on the trip', '3bhk flat rent', 'Priya resume')..."
          style={{
            width: "100%",
            padding: "1rem 3rem 1rem 3rem",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
            color: "#f8fafc",
            fontSize: "1rem",
            outline: "none",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
          }}
        />
        {query && (
          <button
            onClick={onClear}
            style={{ position: "absolute", right: "5rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        )}
        <button
          onClick={onSearch}
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1.25rem",
            color: "#fff",
            fontWeight: "600",
            fontSize: "0.875rem",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(16, 185, 129, 0.3)"
          }}
        >
          Search
        </button>
      </div>

      {/* Controls & Filters Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Search Type Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", marginRight: "0.25rem" }}>SEARCH TYPE:</span>
          
          <button
            onClick={() => setSearchType("semantic")}
            className={`badge-semantic`}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              opacity: searchType === "semantic" ? 1 : 0.4,
              transform: searchType === "semantic" ? "scale(1.05)" : "scale(1)"
            }}
          >
            ✨ Semantic Intent
          </button>

          <button
            onClick={() => setSearchType("attributed")}
            className={`badge-attributed`}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              opacity: searchType === "attributed" ? 1 : 0.4,
              transform: searchType === "attributed" ? "scale(1.05)" : "scale(1)"
            }}
          >
            👤 Attributed (Sender)
          </button>

          <button
            onClick={() => setSearchType("temporal")}
            className={`badge-temporal`}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              opacity: searchType === "temporal" ? 1 : 0.4,
              transform: searchType === "temporal" ? "scale(1.05)" : "scale(1)"
            }}
          >
            📅 Temporal (Date)
          </button>
        </div>

        {/* Sender & Date Filter Inputs */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Sender Dropdown Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(15, 23, 42, 0.6)", padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <User style={{ width: "14px", height: "14px", color: "#8b5cf6" }} />
            <select
              value={senderFilter}
              onChange={(e) => setSenderFilter(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#f8fafc", fontSize: "0.8rem", outline: "none", cursor: "pointer" }}
            >
              <option value="" style={{ background: "#1e293b", color: "#f8fafc" }}>All Participants</option>
              {participants.map((p) => (
                <option key={p} value={p} style={{ background: "#1e293b", color: "#f8fafc" }}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter Input */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(15, 23, 42, 0.6)", padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Calendar style={{ width: "14px", height: "14px", color: "#f59e0b" }} />
            <input
              type="text"
              placeholder="YYYY-MM-DD or YYYY-MM"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#f8fafc", fontSize: "0.8rem", width: "140px", outline: "none" }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
