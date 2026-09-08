"use client";

import React, { useState } from "react";
import { Clock, Eye, Sparkles, MessageSquare, X, CheckCircle2 } from "lucide-react";

interface ContextMessage {
  id: string;
  sender_name: string;
  timestamp: string;
  content: string;
  is_target: boolean;
  is_forwarded?: boolean;
}

interface ThreadCardProps {
  rank: number;
  score: number;
  searchType?: "semantic" | "attributed" | "temporal";
  isPrimaryMatch?: boolean;
  targetMessage: ContextMessage;
  context: ContextMessage[];
}

export default function ThreadCard({ rank, score, searchType = "semantic", isPrimaryMatch = false, targetMessage, context }: ThreadCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSenderColor = (name: string) => {
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  const senderColor = getSenderColor(targetMessage.sender_name);

  return (
    <>
      {/* Search Result Card */}
      <div
        className={`glass-panel ${isPrimaryMatch && searchType === "attributed" ? "target-message-glow" : ""}`}
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "1.25rem 1.5rem",
          marginBottom: "1.25rem",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out"
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)")}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = isPrimaryMatch ? "rgba(16, 185, 129, 0.5)" : "rgba(255, 255, 255, 0.08)")}
      >
        {/* Card Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {isPrimaryMatch && searchType === "attributed" ? (
              <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", color: "#000", padding: "0.25rem 0.75rem", borderRadius: "20px", fontWeight: "800", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <CheckCircle2 style={{ width: "14px", height: "14px" }} />
                ★ Primary Matched Message
              </span>
            ) : (
              <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                Message #{rank}
              </span>
            )}
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>ID: <code style={{ color: "#94a3b8" }}>{targetMessage.id}</code></span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                color: "#a78bfa",
                padding: "0.3rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <Eye style={{ width: "13px", height: "13px" }} />
              View 20-Msg Context
            </button>
          </div>
        </div>

        {/* Attributed & Temporal Modes: Display individual message card cleanly */}
        {searchType === "attributed" || searchType === "temporal" ? (
          <div style={{ padding: "0.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <span style={{ fontWeight: "700", fontSize: "0.95rem", color: senderColor }}>
                {targetMessage.sender_name}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b" }}>
                <Clock style={{ width: "12px", height: "12px" }} />
                <span>{targetMessage.timestamp}</span>
              </div>
            </div>
            <div style={{ color: "#f8fafc", fontSize: "0.95rem", fontWeight: isPrimaryMatch ? "600" : "400", lineHeight: "1.4" }}>
              {targetMessage.content}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.5rem", fontStyle: "italic" }}>
              💡 Click message to open 20-message surrounding context window (10 before + 10 after)
            </div>
          </div>
        ) : (
          /* Semantic Mode: Display context window preview */
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {context.map((msg) => {
              const isTarget = msg.is_target;
              const msgSenderColor = getSenderColor(msg.sender_name);

              return (
                <div
                  key={msg.id}
                  className={isTarget ? "target-message-glow" : ""}
                  style={{
                    padding: isTarget ? "0.85rem 1rem" : "0.6rem 0.85rem",
                    borderRadius: "8px",
                    background: isTarget ? undefined : "rgba(15, 23, 42, 0.4)",
                    border: isTarget ? undefined : "1px solid rgba(255, 255, 255, 0.04)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontWeight: "700", fontSize: "0.85rem", color: msgSenderColor }}>
                        {msg.sender_name}
                      </span>
                      {isTarget && (
                        <span style={{ background: "#10b981", color: "#000", fontWeight: "800", fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "8px" }}>
                          ★ Target Match
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{msg.timestamp}</span>
                  </div>
                  <div style={{ color: isTarget ? "#ffffff" : "#cbd5e1", fontSize: "0.875rem" }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 20-Message Context Modal Drawer */}
      {isModalOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 60, display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem" }}
        >
          <div className="glass-panel" style={{ width: "100%", maxWidth: "850px", height: "85vh", display: "flex", flexDirection: "column", padding: "1.75rem" }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontWeight: "700", fontSize: "1.1rem", color: senderColor }}>
                  {targetMessage.sender_name}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Message ID: <code style={{ color: "#94a3b8" }}>{targetMessage.id}</code>
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X style={{ width: "22px", height: "22px" }} />
              </button>
            </div>

            {/* Context Notice */}
            <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", color: "#34d399", marginBottom: "1rem" }}>
              <strong>Surrounding Conversation Context:</strong> Showing 10 messages before + target message + 10 messages after from the main group chat.
            </div>

            {/* 21 Messages Context Scroll Area */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {context.map((msg) => {
                const isTarget = msg.is_target;
                const msgSenderColor = getSenderColor(msg.sender_name);

                return (
                  <div
                    key={msg.id}
                    className={isTarget ? "target-message-glow" : ""}
                    style={{
                      padding: isTarget ? "1rem 1.25rem" : "0.75rem 1rem",
                      borderRadius: "10px",
                      background: isTarget ? undefined : "rgba(15, 23, 42, 0.6)",
                      border: isTarget ? undefined : "1px solid rgba(255, 255, 255, 0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: "700", fontSize: "0.85rem", color: msgSenderColor }}>
                          {msg.sender_name}
                        </span>
                        {isTarget && (
                          <span style={{ background: "#10b981", color: "#000", fontWeight: "800", fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "8px" }}>
                            ★ Selected Message Match ({msg.id})
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{msg.timestamp}</span>
                    </div>

                    <div style={{ color: isTarget ? "#ffffff" : "#cbd5e1", fontSize: "0.9rem", fontWeight: isTarget ? "600" : "400" }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "1rem", textAlign: "right", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.75rem" }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ padding: "0.5rem 1.25rem", borderRadius: "8px", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}
              >
                Close Context
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
