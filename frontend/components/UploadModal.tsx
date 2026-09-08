"use client";

import React, { useState } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (data: { filename: string; messages_count: number; participants: string[] }) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a .txt or .json WhatsApp chat export file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to upload and parse chat file.");
      }

      const data = await res.json();
      onUploadSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: "500px", padding: "2rem", position: "relative" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Upload style={{ color: "#06b6d4", width: "22px", height: "22px" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#f8fafc" }}>Upload WhatsApp Chat</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
            <X style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "1.5rem", lineHeight: "1.4" }}>
          Upload any <strong>WhatsApp export file (.txt)</strong> or <strong>JSON dataset (.json)</strong> from your PC to search its messages instantly!
        </p>

        {/* File Dropzone */}
        <div style={{ border: "2px dashed rgba(255, 255, 255, 0.15)", borderRadius: "12px", padding: "2rem", textAlign: "center", background: "rgba(15, 23, 42, 0.5)", marginBottom: "1.5rem" }}>
          <FileText style={{ width: "40px", height: "40px", color: "#34d399", margin: "0 auto 1rem auto" }} />
          <input type="file" accept=".txt,.json" onChange={handleFileChange} style={{ display: "none" }} id="chat-file-input" />
          <label htmlFor="chat-file-input" style={{ cursor: "pointer", color: "#34d399", fontWeight: "600", fontSize: "0.95rem" }}>
            {file ? file.name : "Click to select .txt or .json file"}
          </label>
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>Supports WhatsApp text exports & custom JSON format</p>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "0.75rem", borderRadius: "8px", color: "#fca5a5", fontSize: "0.85rem", marginBottom: "1rem" }}>
            <AlertCircle style={{ width: "16px", height: "16px" }} />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", background: "transparent", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{ padding: "0.6rem 1.5rem", borderRadius: "8px", background: "linear-gradient(135deg, #10b981, #06b6d4)", border: "none", color: "#fff", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Parsing Chat..." : "Upload & Parse"}
          </button>
        </div>

      </div>
    </div>
  );
}
