import re
import json
from datetime import datetime

def parse_whatsapp_txt(text_content: str):
    """
    Parses standard WhatsApp export txt formats:
    Example 1: [15/05/26, 18:30:12] Priya Verma: monthly rent 45000 hai
    Example 2: 15/05/2026, 6:30 pm - Priya Verma: monthly rent 45000 hai
    """
    lines = text_content.splitlines()
    messages = []
    msg_id = 1
    
    # Regex patterns for common WhatsApp export formats
    # Pattern 1: [15/05/26, 18:30:12] Sender: Message
    pattern1 = re.compile(r"^\[(\d{1,2}/\d{1,2}/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]\.?m\.?)?)\]\s+([^:]+):\s+(.*)$", re.IGNORECASE)
    # Pattern 2: 15/05/2026, 18:30 - Sender: Message
    pattern2 = re.compile(r"^(\d{1,2}/\d{1,2}/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]\.?m\.?)?)\s+-\s+([^:]+):\s+(.*)$", re.IGNORECASE)
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        m1 = pattern1.match(line)
        m2 = pattern2.match(line)
        match = m1 or m2
        
        if match:
            date_str, time_str, sender, content = match.groups()
            
            # Normalize timestamp string
            ts_str = f"{date_str} {time_str}"
            try:
                # Attempt flexible parsing
                clean_ts = re.sub(r'[\.\[\]]', '', ts_str).strip()
                dt = None
                for fmt in ("%d/%m/%Y %H:%M:%S", "%d/%m/%y %H:%M:%S", "%d/%m/%Y %I:%M %p", "%d/%m/%y %I:%M %p", "%d/%m/%Y %H:%M", "%d/%m/%y %H:%M"):
                    try:
                        dt = datetime.strptime(clean_ts, fmt)
                        break
                    except ValueError:
                        pass
                
                timestamp = dt.strftime("%Y-%m-%d %H:%M:%S") if dt else f"2026-01-01 {time_str}"
            except Exception:
                timestamp = "2026-01-01 12:00:00"
                
            messages.append({
                "id": f"msg_u_{msg_id:04d}",
                "sender_id": re.sub(r'\s+', '_', sender.lower()),
                "sender_name": sender.strip(),
                "timestamp": timestamp,
                "content": content.strip(),
                "is_forwarded": content.strip().startswith("Forwarded:"),
                "thread_id": None
            })
            msg_id += 1
        elif messages:
            # Multi-line message continuation
            messages[-1]["content"] += f"\n{line}"
            
    return messages

def parse_chat_file(file_content: bytes, filename: str):
    """
    Parses either .json or .txt WhatsApp chat export
    """
    if filename.endswith(".json"):
        data = json.loads(file_content.decode("utf-8"))
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and "messages" in data:
            return data["messages"]
        else:
            raise ValueError("Invalid JSON format. Expected list of messages or object with 'messages' key.")
    else:
        text_content = file_content.decode("utf-8", errors="ignore")
        return parse_whatsapp_txt(text_content)
