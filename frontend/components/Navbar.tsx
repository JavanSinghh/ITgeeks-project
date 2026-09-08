"use client";

import React from "react";
import { Search, Upload, CheckCircle2, MessageSquare, Sparkles, Database } from "lucide-react";

interface NavbarProps {
  activeTab: "search" | "benchmark";
  setActiveTab: (tab: "search" | "benchmark") => void;
  onOpenUpload: () => void;
  stats: {
    total_messages: number;
    participants_count: number;
    total_test_queries: number;
  };
}

export default function Navbar({ activeTab, setActiveTab, onOpenUpload, stats }: NavbarProps) {
  return (
    <header style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(11, 15, 25, 0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 40, padding: "1rem 2rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Brand Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)" }}>
            <MessageSquare style={{ color: "#fff", width: "22px", height: "22px" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "700", background: "linear-gradient(to right, #f8fafc, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Hinglish Chat Search
            </h1>
            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Semantic RAG & Group Chat Search Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", background: "rgba(31, 41, 61, 0.6)", padding: "4px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <button
            onClick={() => setActiveTab("search")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "search" ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
              color: activeTab === "search" ? "#fff" : "#94a3b8"
            }}
          >
            <Search style={{ width: "16px", height: "16px" }} />
            Search Chat
          </button>
          
          <button
            onClick={() => setActiveTab("benchmark")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "benchmark" ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "transparent",
              color: activeTab === "benchmark" ? "#fff" : "#94a3b8"
            }}
          >
            <CheckCircle2 style={{ width: "16px", height: "16px" }} />
            40 Query Benchmark
          </button>
        </div>

        {/* Dataset Stats & Upload Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(31, 41, 61, 0.5)", padding: "0.4rem 0.8rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)", fontSize: "0.8rem", color: "#94a3b8" }}>
            <Database style={{ width: "14px", height: "14px", color: "#34d399" }} />
            <span>{stats.total_messages.toLocaleString()} msgs</span>
          </div>

          <button
            onClick={onOpenUpload}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "600",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
          >
            <Upload style={{ width: "16px", height: "16px", color: "#06b6d4" }} />
            Upload Chat Export
          </button>
        </div>

      </div>
    </header>
  );
}
