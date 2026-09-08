"use client";

import React from "react";
import { MessageSquare, Clock, User, Share2, Sparkles } from "lucide-react";

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
  targetMessage: ContextMessage;
  context: ContextMessage[];
}

export default function ThreadCard({ rank, score, targetMessage, context }: ThreadCardProps) {
  // Generate consistent color per sender
  const getSenderColor = (name: string) => {
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#3b82f6"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem", position: "relative" }}>
      {/* Card Top Rank & Relevance Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "700", fontSize: "0.8rem", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            Result #{rank}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Matched Target Message ID: <code style={{ color: "#94a3b8" }}>{targetMessage.id}</code></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#34d399", fontWeight: "600" }}>
          <Sparkles style={{ width: "14px", height: "14px" }} />
          <span>Relevance Score: {score}</span>
        </div>
      </div>

      {/* Surrounding Context Window Messages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {context.map((msg) => {
          const senderColor = getSenderColor(msg.sender_name);
          const isTarget = msg.is_target;

          return (
            <div
              key={msg.id}
              className={isTarget ? "target-message-glow" : ""}
              style={{
                padding: isTarget ? "1rem 1.25rem" : "0.75rem 1rem",
                borderRadius: "10px",
                background: isTarget ? undefined : "rgba(15, 23, 42, 0.4)",
                border: isTarget ? undefined : "1px solid rgba(255, 255, 255, 0.04)",
                transition: "all 0.2s"
              }}
            >
              {/* Message Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: "700", fontSize: "0.875rem", color: senderColor }}>
                    {msg.sender_name}
                  </span>
                  {msg.is_forwarded && (
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontStyle: "italic", background: "rgba(255,255,255,0.05)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                      Forwarded
                    </span>
                  )}
                  {isTarget && (
                    <span style={{ background: "#10b981", color: "#000", fontWeight: "800", fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "12px", textTransform: "uppercase" }}>
                      ★ Matching Target
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "#64748b" }}>
                  <Clock style={{ width: "12px", height: "12px" }} />
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {/* Message Body Content */}
              <div style={{ color: isTarget ? "#ffffff" : "#cbd5e1", fontSize: isTarget ? "0.95rem" : "0.875rem", fontWeight: isTarget ? "600" : "400", lineHeight: "1.4" }}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
