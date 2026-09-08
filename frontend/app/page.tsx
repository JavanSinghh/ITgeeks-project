"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ThreadCard from "@/components/ThreadCard";
import UploadModal from "@/components/UploadModal";
import BenchmarkDashboard from "@/components/BenchmarkDashboard";
import { MessageSquare, Sparkles, AlertCircle, Database, Zap, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"search" | "benchmark">("search");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"semantic" | "attributed" | "temporal">("semantic");
  const [senderFilter, setSenderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searchTimeMs, setSearchTimeMs] = useState<number | null>(null);
  
  const [stats, setStats] = useState({
    total_messages: 4378,
    participants_count: 8,
    total_test_queries: 40,
    participants: ["Amit Patel", "Ananya Roy", "Neha Joshi", "Priya Verma", "Rahul Sharma", "Rohan Mehta", "Sneha Gupta", "Vikram Singh"]
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats({
          total_messages: data.total_messages || 4378,
          participants_count: (data.participants || []).length,
          total_test_queries: data.total_test_queries || 40,
          participants: data.participants || stats.participants
        });
      }
    } catch (e) {
      console.log("Using default dataset stats");
    }
  };

  const handleSearch = async (overrideQuery?: string, overrideSearchType?: "semantic" | "attributed" | "temporal") => {
    const qToUse = overrideQuery !== undefined ? overrideQuery : query;
    const typeToUse = overrideSearchType !== undefined ? overrideSearchType : searchType;

    if (!qToUse.trim() && !senderFilter && !dateFilter) return;

    setLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetch("http://localhost:8000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: qToUse.trim() || "all messages",
          search_type: typeToUse,
          sender_filter: senderFilter || null,
          date_filter: dateFilter || null,
          top_k: (typeToUse === "attributed" || typeToUse === "temporal") ? 100 : 5,
          context_window: 10
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setSearchTimeMs(Math.round(performance.now() - startTime));
      }
    } catch (err) {
      console.error("Search API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSenderFilter("");
    setDateFilter("");
    setResults([]);
    setSearchTimeMs(null);
  };

  const primaryMatch = results.length > 0 ? results[0] : null;
  const otherMessages = results.length > 1 ? results.slice(1) : [];

  return (
    <main style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        stats={stats}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        {activeTab === "search" ? (
          <>
            {/* Search Controls Panel */}
            <SearchBar
              query={query}
              setQuery={setQuery}
              searchType={searchType}
              setSearchType={setSearchType}
              senderFilter={senderFilter}
              setSenderFilter={setSenderFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              participants={stats.participants}
              onSearch={() => handleSearch()}
              onClear={handleClear}
            />

            {/* Empty State / Interactive Sample Chips */}
            {results.length === 0 && !loading && (
              <div className="glass-panel" style={{ padding: "3rem 2rem", textAlign: "center", maxWidth: "850px", margin: "2.5rem auto 0 auto", position: "relative", zIndex: 10 }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  <Sparkles style={{ width: "28px", height: "28px", color: "#34d399" }} />
                </div>

                <h3 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#f8fafc" }}>
                  Search Group Chat Decisions & Hinglish Messages
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.75rem", lineHeight: "1.5" }}>
                  Perform intent-based semantic searches over messy Hinglish chats. Try clicking any sample query below to test:
                </p>

                {/* Sample Query Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", justifyContent: "center" }}>
                  {[
                    { label: "when did we decide on the trip", type: "semantic" },
                    { label: "what did we discuss on March 21 regarding vacation", type: "temporal" },
                    { label: "what flat discussions took place on May 15", type: "temporal" },
                    { label: "what birthday plans were discussed on July 18", type: "temporal" },
                    { label: "who paid the initial advance money for the apartment", type: "semantic" },
                    { label: "what did Priya say about resume", type: "attributed" },
                    { label: "what did we talk about in March 2026 about budget", type: "temporal" },
                    { label: "what tickets did Amit book for Sunday", type: "attributed" }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => {
                        setQuery(chip.label);
                        setSearchType(chip.type as any);
                        handleSearch(chip.label, chip.type as any);
                      }}
                      style={{
                        background: "rgba(31, 41, 61, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        padding: "0.6rem 1.1rem",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        color: "#cbd5e1",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                        e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                        e.currentTarget.style.background = "rgba(31, 41, 61, 0.7)";
                        e.currentTarget.style.color = "#cbd5e1";
                      }}
                    >
                      <span>💡 "{chip.label}"</span>
                      <ArrowRight style={{ width: "14px", height: "14px", color: "#34d399" }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <div style={{ display: "inline-block", width: "42px", height: "42px", border: "4px solid rgba(16, 185, 129, 0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p style={{ fontSize: "0.95rem", color: "#94a3b8", marginTop: "1.25rem", fontWeight: "500" }}>
                  Searching chat index with Hinglish embeddings...
                </p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Search Results Summary & Thread Cards */}
            {results.length > 0 && !loading && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", background: "rgba(17, 24, 39, 0.5)", padding: "0.75rem 1.25rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#f8fafc" }}>
                      {searchType === "attributed"
                        ? `Attributed Search Results for ${primaryMatch?.target_message?.sender_name || "Participant"}`
                        : searchType === "temporal"
                        ? `All Messages From Selected Date (${results.length})`
                        : `Matched Search Threads (${results.length})`}
                    </h3>
                    {searchTimeMs !== null && (
                      <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "0.2rem 0.6rem", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Zap style={{ width: "12px", height: "12px" }} />
                        {searchTimeMs} ms
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: "600" }}>
                    💡 Click any message to view 20-message surrounding context window!
                  </span>
                </div>

                {/* Attributed Mode: Primary Matched Message + Other Messages by Member */}
                {searchType === "attributed" ? (
                  <div>
                    {/* Primary Matched Message */}
                    {primaryMatch && (
                      <div style={{ marginBottom: "2rem" }}>
                        <div style={{ fontSize: "0.85rem", color: "#34d399", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Sparkles style={{ width: "16px", height: "16px" }} />
                          Primary Matched Message (Description Match)
                        </div>
                        <ThreadCard
                          rank={1}
                          score={primaryMatch.score}
                          searchType={searchType}
                          isPrimaryMatch={true}
                          targetMessage={primaryMatch.target_message}
                          context={primaryMatch.context}
                        />
                      </div>
                    )}

                    {/* Other Messages by this Member */}
                    {otherMessages.length > 0 && (
                      <div>
                        <div style={{ fontSize: "0.85rem", color: "#a78bfa", fontWeight: "800", textTransform: "uppercase", marginBottom: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <UserCheck style={{ width: "16px", height: "16px" }} />
                          Other Messages by {primaryMatch?.target_message?.sender_name} in Chat ({otherMessages.length})
                        </div>

                        {otherMessages.map((res, idx) => (
                          <ThreadCard
                            key={idx}
                            rank={idx + 2}
                            score={res.score}
                            searchType={searchType}
                            isPrimaryMatch={false}
                            targetMessage={res.target_message}
                            context={res.context}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Semantic & Temporal Modes */
                  <div>
                    {results.map((res, idx) => (
                      <ThreadCard
                        key={idx}
                        rank={idx + 1}
                        score={res.score}
                        searchType={searchType}
                        isPrimaryMatch={res.is_primary_match}
                        targetMessage={res.target_message}
                        context={res.context}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Benchmark Dashboard Tab */
          <BenchmarkDashboard />
        )}

      </div>

      {/* Upload Custom Chat Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(data) => {
          setStats((prev) => ({
            ...prev,
            total_messages: data.messages_count,
            participants_count: data.participants.length,
            participants: data.participants
          }));
          alert(`Successfully uploaded ${data.filename}! Loaded ${data.messages_count} messages across ${data.participants.length} participants.`);
        }}
      />
    </main>
  );
}
