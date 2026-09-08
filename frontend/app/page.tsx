"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ThreadCard from "@/components/ThreadCard";
import UploadModal from "@/components/UploadModal";
import BenchmarkDashboard from "@/components/BenchmarkDashboard";
import { MessageSquare, Sparkles, AlertCircle, Database } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"search" | "benchmark">("search");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"semantic" | "attributed" | "temporal">("semantic");
  const [senderFilter, setSenderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_messages: 4378,
    participants_count: 8,
    total_test_queries: 40,
    participants: ["Amit Patel", "Ananya Roy", "Neha Joshi", "Priya Verma", "Rahul Sharma", "Rohan Mehta", "Sneha Gupta", "Vikram Singh"]
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Fetch API stats on mount
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

  const handleSearch = async () => {
    if (!query.trim() && !senderFilter && !dateFilter) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim() || "all messages",
          search_type: searchType,
          sender_filter: senderFilter || null,
          date_filter: dateFilter || null,
          top_k: 5,
          context_window: 3
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
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
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        stats={stats}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        
        {activeTab === "search" ? (
          <>
            {/* Search Input Bar */}
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
              onSearch={handleSearch}
              onClear={handleClear}
            />

            {/* Initial Empty State / Quick Suggestion Pills */}
            {results.length === 0 && !loading && (
              <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
                <Sparkles style={{ width: "40px", height: "40px", color: "#34d399", margin: "0 auto 1rem auto" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Search Any Group Chat Decision or Message</h3>
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                  Try typing queries in Hinglish or English. Matches return the target message along with its surrounding conversation context!
                </p>

                {/* Sample Query Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
                  {[
                    "when did we decide on the trip",
                    "who paid the initial advance money for the apartment",
                    "what electronic gadget did we finalize for Sneha",
                    "what did Priya say about resume",
                    "3BHK Indiranagar monthly rent cost",
                    "what tickets did Amit book for Sunday"
                  ].map((qText) => (
                    <button
                      key={qText}
                      onClick={() => {
                        setQuery(qText);
                        setTimeout(() => handleSearch(), 100);
                      }}
                      style={{
                        background: "rgba(31, 41, 61, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        color: "#cbd5e1",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)")}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)")}
                    >
                      💡 "{qText}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid rgba(16, 185, 129, 0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "1rem" }}>Searching chat index with Hinglish embeddings...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Results List */}
            {results.length > 0 && !loading && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#f8fafc" }}>
                    Search Results ({results.length} Threads Matched)
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Showing target + surrounding 3 messages context</span>
                </div>

                {results.map((res, idx) => (
                  <ThreadCard
                    key={idx}
                    rank={idx + 1}
                    score={res.score}
                    targetMessage={res.target_message}
                    context={res.context}
                  />
                ))}
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
          alert(`Successfully uploaded ${data.filename}! Parsed ${data.messages_count} messages.`);
        }}
      />
    </main>
  );
}
