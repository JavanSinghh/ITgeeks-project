"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Calendar, Users, X, Sparkles, ChevronDown, UserCheck } from "lucide-react";

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
  const [showParticipantsList, setShowParticipantsList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowParticipantsList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const getSenderColor = (name: string) => {
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem", position: "relative", zIndex: 30 }}>
      {/* Search Input Box */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b", width: "20px", height: "20px" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            searchType === "temporal"
              ? "Select a date from the calendar below or type a date/event query (e.g. '2026-03-21', 'March trip')..."
              : searchType === "attributed"
              ? "Search messages by person (e.g. 'Priya resume', 'Rahul deck', 'Amit tickets')..."
              : "Type any semantic query in Hinglish or English (e.g. 'when did we decide on the trip', '3bhk flat rent')..."
          }
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
            style={{ position: "absolute", right: "5.5rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
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
            className="badge-semantic"
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
            className="badge-attributed"
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
            className="badge-temporal"
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
            📅 Temporal (Calendar Date)
          </button>
        </div>

        {/* Dynamic Controls Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", position: "relative" }}>
          
          {/* Interactive Clickable View Participants Button & High zIndex Popover */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowParticipantsList(!showParticipantsList)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                padding: "0.45rem 0.85rem",
                borderRadius: "8px",
                color: "#a78bfa",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Users style={{ width: "14px", height: "14px", color: "#a78bfa" }} />
              <span>View Participants ({participants.length})</span>
              <ChevronDown style={{ width: "14px", height: "14px", transform: showParticipantsList ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>

            {/* High z-Index Popover Card */}
            {showParticipantsList && (
              <div
                className="glass-panel"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "125%",
                  width: "250px",
                  padding: "0.85rem",
                  zIndex: 100,
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.7)",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  background: "#111827"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: "700", textTransform: "uppercase", paddingBottom: "0.5rem", marginBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <UserCheck style={{ width: "14px", height: "14px", color: "#a78bfa" }} />
                  Group Members List ({participants.length})
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "260px", overflowY: "auto" }}>
                  {participants.map((name) => {
                    const color = getSenderColor(name);
                    return (
                      <div
                        key={name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.4rem 0.6rem",
                          borderRadius: "6px",
                          background: "rgba(31, 41, 61, 0.7)",
                          fontSize: "0.85rem",
                          color: "#f8fafc",
                          border: "1px solid rgba(255,255,255,0.04)"
                        }}
                      >
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
                        <span style={{ fontWeight: "500" }}>{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Calendar Date Picker in Temporal Mode */}
          {searchType === "temporal" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "0.4rem 0.85rem", borderRadius: "8px" }}>
              <Calendar style={{ width: "15px", height: "15px", color: "#fbbf24" }} />
              <span style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: "600" }}>Pick Date:</span>
              <input
                type="date"
                value={dateFilter}
                min="2026-03-01"
                max="2026-08-31"
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setQuery(e.target.value);
                  onSearch();
                }}
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "6px",
                  color: "#f8fafc",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                  colorScheme: "dark"
                }}
              />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
