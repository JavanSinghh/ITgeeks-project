import json
import random
from datetime import datetime, timedelta

def generate_dataset():
    random.seed(42)  # Deterministic generation
    
    participants = [
        {"id": "p1", "name": "Rahul Sharma", "handle": "Rahul"},
        {"id": "p2", "name": "Priya Verma", "handle": "Priya"},
        {"id": "p3", "name": "Amit Patel", "handle": "Amit"},
        {"id": "p4", "name": "Sneha Gupta", "handle": "Sneha"},
        {"id": "p5", "name": "Rohan Mehta", "handle": "Rohan"},
        {"id": "p6", "name": "Ananya Roy", "handle": "Ananya"},
        {"id": "p7", "name": "Vikram Singh", "handle": "Vikram"},
        {"id": "p8", "name": "Neha Joshi", "handle": "Neha"},
    ]
    
    start_date = datetime(2026, 3, 1, 9, 0, 0)
    total_days = 180  # 6 months
    
    messages = []
    msg_id_counter = 1
    
    # Track specific target messages for ground-truth benchmark queries
    targets = {}
    
    # -------------------------------------------------------------
    # Helper to insert message with timestamp
    # -------------------------------------------------------------
    def add_msg(sender, text, dt, is_forwarded=False, thread_id=None):
        nonlocal msg_id_counter
        mid = f"msg_{msg_id_counter:04d}"
        msg_id_counter += 1
        msg = {
            "id": mid,
            "sender_id": sender["id"],
            "sender_name": sender["name"],
            "timestamp": dt.strftime("%Y-%m-%d %H:%M:%S"),
            "content": f"Forwarded: {text}" if is_forwarded else text,
            "is_forwarded": is_forwarded,
            "thread_id": thread_id
        }
        messages.append(msg)
        return mid
    
    # -------------------------------------------------------------
    # Filler messages & casual Hinglish patterns
    # -------------------------------------------------------------
    hinglish_fillers = [
        "haaa bhai", "ok done", "cool cool", "accha thik hai", "bhai kya chal raha hai",
        "sahi hai yaar", "bilkul", "hnmm", "haan bhai sahi bola", "wfh hai kya aaj?",
        "office kaun ja raha hai?", "traffic bohot zyada hai aaj", "chai pine chale?",
        "bc itna kaam kaun deta hai", "haha true", "lol xD", "nice one bro",
        "baat toh sahi hai", "kya scene hai shaam ka?", "gadi me jagah hai?",
        "ping me when reach", "chalo milte hain 8 baje", "arrey yaar typo ho gaya",
        "reels bhejna band kar", "bhai link bhejo", "screenshot bhejna jara",
        "meeting me hu abhi", "free ho ke call karta hu", "haaa bilkul", "thx bro"
    ]
    
    curr_dt = start_date
    
    # We will build 4,000+ messages over 180 days.
    # We embed 3 main decision threads and specific attributed/temporal event threads.
    
    # Decision Thread 1: Manali Trip (around Day 20 - March 21)
    # Decision Thread 2: Flat Rent & Deposit (around Day 75 - May 15)
    # Decision Thread 3: Sneha's Birthday Gift (around Day 140 - July 18)
    
    for day in range(total_days):
        day_dt = start_date + timedelta(days=day)
        
        # Decide number of messages today (20 to 30 messages/day to reach ~4200)
        daily_msg_count = random.randint(20, 28)
        
        # Check if today has a special decision thread
        if day == 20:  # March 21, 2026 - Manali Trip Decision
            t_dt = datetime(2026, 3, 21, 14, 15, 0)
            add_msg(participants[0], "guys summer me kidhar ghumne chale?", t_dt, thread_id="t_manali")
            add_msg(participants[1], "Goa or Himachal?", t_dt + timedelta(minutes=2), thread_id="t_manali")
            add_msg(participants[2], "Goa bohot hot hoga march-april me", t_dt + timedelta(minutes=5), thread_id="t_manali")
            add_msg(participants[4], "chalo Manali fix hai", t_dt + timedelta(minutes=8), thread_id="t_manali") # TARGET Z1
            targets["z1_manali_decision"] = messages[-1]["id"]
            add_msg(participants[3], "dates kya hongi? 15 to 20 April?", t_dt + timedelta(minutes=10), thread_id="t_manali")
            add_msg(participants[0], "budget approx 8500 per head aayega hotel and travel mila ke", t_dt + timedelta(minutes=14), thread_id="t_manali") # TARGET S1
            targets["s1_manali_budget"] = messages[-1]["id"]
            add_msg(participants[6], "nice! train se chalenge ya flight?", t_dt + timedelta(minutes=16), thread_id="t_manali")
            add_msg(participants[5], "Volvo bus from Delhi is best option", t_dt + timedelta(minutes=20), thread_id="t_manali")
            
        elif day == 75:  # May 15, 2026 - Flat Rent Decision
            t_dt = datetime(2026, 5, 15, 18, 30, 0)
            add_msg(participants[1], "bhai Indiranagar me 3BHK flat mila hai final", t_dt, thread_id="t_flat")
            add_msg(participants[2], "rent kitna mang raha hai broker?", t_dt + timedelta(minutes=3), thread_id="t_flat")
            add_msg(participants[1], "monthly rent 45000 hai aur electricity bill equal split hoga", t_dt + timedelta(minutes=6), thread_id="t_flat") # TARGET S2
            targets["s2_flat_rent"] = messages[-1]["id"]
            add_msg(participants[4], "deposit money Priya ne already pay kar diya advance me", t_dt + timedelta(minutes=11), thread_id="t_flat") # TARGET Z2 / A1
            targets["z2_flat_deposit"] = messages[-1]["id"]
            add_msg(participants[7], "great job Priya! hum sab kal transfer kar denge tujhe", t_dt + timedelta(minutes=15), thread_id="t_flat")
            add_msg(participants[3], "lock-in period 6 months ka rakha hai owner ne", t_dt + timedelta(minutes=18), thread_id="t_flat")
            
        elif day == 140:  # July 18, 2026 - Sneha's Birthday Gift
            t_dt = datetime(2026, 7, 18, 21, 10, 0)
            add_msg(participants[0], "guys Sneha ka bday aane wala hai next week silent raho is group pe", t_dt, thread_id="t_bday")
            add_msg(participants[2], "kya dene ka plan hai?", t_dt + timedelta(minutes=2), thread_id="t_bday")
            add_msg(participants[5], "usne bola tha she needs a new tablet for digital art", t_dt + timedelta(minutes=5), thread_id="t_bday")
            add_msg(participants[4], "iPad Air 5th gen final karte hain blue color wala", t_dt + timedelta(minutes=9), thread_id="t_bday") # TARGET Z3
            targets["z3_bday_gift"] = messages[-1]["id"]
            add_msg(participants[6], "per head contribution 3500 rupe banega", t_dt + timedelta(minutes=12), thread_id="t_bday") # TARGET S3
            targets["s3_gift_budget"] = messages[-1]["id"]
            add_msg(participants[7], "secret WhatsApp subgroup bana liya hai wahan discuss karte hain", t_dt + timedelta(minutes=16), thread_id="t_bday")
            
        # Add random daily background conversations
        minute_offset = 0
        for m in range(daily_msg_count):
            sender = random.choice(participants)
            text = random.choice(hinglish_fillers)
            msg_dt = day_dt + timedelta(hours=random.randint(9, 22), minutes=random.randint(0, 59))
            
            # Occasionally add specific attributed or keyword content
            if day == 10 and m == 5:
                sender = participants[1] # Priya
                text = "Priya here: maine resume clean up kar diya hai review kar lo"
                targets["a2_priya_resume"] = f"msg_{msg_id_counter:04d}"
            elif day == 45 and m == 8:
                sender = participants[0] # Rahul
                text = "Rahul: presentation deck Google Drive link access given to everyone"
                targets["a3_rahul_deck"] = f"msg_{msg_id_counter:04d}"
            elif day == 90 and m == 12:
                sender = participants[3] # Sneha
                text = "Sneha: guys laptop charger office me choot gaya mera"
                targets["a4_sneha_charger"] = f"msg_{msg_id_counter:04d}"
            elif day == 110 and m == 3:
                sender = participants[2] # Amit
                text = "Amit: cricket match tickets booked for Sunday evening stadium seat section B"
                targets["a5_amit_tickets"] = f"msg_{msg_id_counter:04d}"
            elif day == 130 and m == 7:
                sender = participants[4] # Rohan
                text = "Rohan: car mechanics ne bill 4200 rupees ka diya clutch replacement ka"
                targets["a6_rohan_car"] = f"msg_{msg_id_counter:04d}"
            elif day == 160 and m == 2:
                sender = participants[5] # Ananya
                text = "Ananya: badam milk shake and pizza party at my place tonight"
                targets["a7_ananya_party"] = f"msg_{msg_id_counter:04d}"
            elif day == 170 and m == 4:
                sender = participants[6] # Vikram
                text = "Vikram: gym membership renewal offer is valid till month end"
                targets["a8_vikram_gym"] = f"msg_{msg_id_counter:04d}"
            elif day == 175 and m == 10:
                sender = participants[7] # Neha
                text = "Neha: flight ticket to Mumbai confirmed for next Friday morning"
                targets["a9_neha_flight"] = f"msg_{msg_id_counter:04d}"
                
            add_msg(sender, text, msg_dt, is_forwarded=(random.random() < 0.05))

    print(f"Total messages generated: {len(messages)}")
    
    # Save dataset to backend/dataset/group_chat.json
    with open("backend/dataset/group_chat.json", "w", encoding="utf-8") as f:
        json.dump(messages, f, indent=2, ensure_ascii=False)
        
    # Generate 40 benchmark queries (including 10 Zero-Keyword overlap queries)
    queries = [
        # --- ZERO KEYWORD OVERLAP QUERIES (At least 8 required) ---
        {
            "id": "q01",
            "query": "when did we decide on the trip",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["z1_manali_decision"],
            "explanation": "Query asks about 'trip decision', target message is 'chalo Manali fix hai' (zero words in common)."
        },
        {
            "id": "q02",
            "query": "who paid the initial advance money for the apartment",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["z2_flat_deposit"],
            "explanation": "Query asks about 'initial advance money apartment', target message is 'deposit money Priya ne already pay kar diya advance me'."
        },
        {
            "id": "q03",
            "query": "what electronic gadget did we finalize for Sneha",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["z3_bday_gift"],
            "explanation": "Query asks about 'electronic gadget', target is 'iPad Air 5th gen final karte hain blue color wala'."
        },
        {
            "id": "q04",
            "query": "what destination was selected for vacation",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["z1_manali_decision"],
            "explanation": "Query asks 'destination vacation', target is 'chalo Manali fix hai'."
        },
        {
            "id": "q05",
            "query": "how much does each person need to contribute for the birthday surprise",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["s3_gift_budget"],
            "explanation": "Query asks 'each person contribution birthday surprise', target is 'per head contribution 3500 rupe banega'."
        },
        {
            "id": "q06",
            "query": "what is the cost per head for hill station tour",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["s1_manali_budget"],
            "explanation": "Query asks 'cost per head hill station tour', target is 'budget approx 8500 per head aayega hotel and travel mila ke'."
        },
        {
            "id": "q07",
            "query": "what was agreed regarding electricity bills for the 3BHK",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": targets["s2_flat_rent"],
            "explanation": "Query asks 'electricity bills 3BHK', target is 'monthly rent 45000 hai aur electricity bill equal split hoga'."
        },
        {
            "id": "q08",
            "query": "where are we planning to chat secretly about the gift",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z3_bday_gift"])) + 2]["id"],
            "explanation": "Query asks 'secretly chat gift', target is 'secret WhatsApp subgroup bana liya hai wahan discuss karte hain'."
        },
        {
            "id": "q09",
            "query": "how are we traveling from Delhi to mountains",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z1_manali_decision"])) + 5]["id"],
            "explanation": "Query asks 'traveling Delhi mountains', target is 'Volvo bus from Delhi is best option'."
        },
        {
            "id": "q10",
            "query": "what was the duration of the apartment owner lock in clause",
            "type": "semantic",
            "is_zero_keyword_overlap": True,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z2_flat_deposit"])) + 2]["id"],
            "explanation": "Query asks 'duration lock in clause', target is 'lock-in period 6 months ka rakha hai owner ne'."
        },
        
        # --- ATTRIBUTED QUERIES (Sender specific) ---
        {
            "id": "q11",
            "query": "what did Priya say about resume",
            "type": "attributed",
            "sender_filter": "Priya Verma",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a2_priya_resume"],
            "explanation": "Attributed search for Priya Verma mentioning resume."
        },
        {
            "id": "q12",
            "query": "what link did Rahul share for presentation",
            "type": "attributed",
            "sender_filter": "Rahul Sharma",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a3_rahul_deck"],
            "explanation": "Attributed search for Rahul Sharma mentioning presentation deck."
        },
        {
            "id": "q13",
            "query": "what did Sneha forget at office",
            "type": "attributed",
            "sender_filter": "Sneha Gupta",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a4_sneha_charger"],
            "explanation": "Attributed search for Sneha Gupta mentioning charger."
        },
        {
            "id": "q14",
            "query": "what tickets did Amit book for Sunday",
            "type": "attributed",
            "sender_filter": "Amit Patel",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a5_amit_tickets"],
            "explanation": "Attributed search for Amit Patel mentioning cricket tickets."
        },
        {
            "id": "q15",
            "query": "what repair expense did Rohan mention for his vehicle",
            "type": "attributed",
            "sender_filter": "Rohan Mehta",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a6_rohan_car"],
            "explanation": "Attributed search for Rohan Mehta mentioning repair bill."
        },
        {
            "id": "q16",
            "query": "what party menu did Ananya propose",
            "type": "attributed",
            "sender_filter": "Ananya Roy",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a7_ananya_party"],
            "explanation": "Attributed search for Ananya Roy mentioning pizza party."
        },
        {
            "id": "q17",
            "query": "what offer did Vikram post about gym",
            "type": "attributed",
            "sender_filter": "Vikram Singh",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a8_vikram_gym"],
            "explanation": "Attributed search for Vikram Singh mentioning gym membership."
        },
        {
            "id": "q18",
            "query": "where is Neha flying next Friday",
            "type": "attributed",
            "sender_filter": "Neha Joshi",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a9_neha_flight"],
            "explanation": "Attributed search for Neha Joshi mentioning flight ticket."
        },
        {
            "id": "q19",
            "query": "what did Priya say about Indiranagar flat rent",
            "type": "attributed",
            "sender_filter": "Priya Verma",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["s2_flat_rent"],
            "explanation": "Attributed search for Priya Verma mentioning monthly rent 45000."
        },
        {
            "id": "q20",
            "query": "what dates did Sneha propose for summer trip",
            "type": "attributed",
            "sender_filter": "Sneha Gupta",
            "is_zero_keyword_overlap": False,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z1_manali_decision"])) + 1]["id"],
            "explanation": "Attributed search for Sneha Gupta proposing dates 15 to 20 April."
        },
        
        # --- TEMPORAL QUERIES (Time & Date specific) ---
        {
            "id": "q21",
            "query": "what did we discuss on March 21 regarding vacation",
            "type": "temporal",
            "date_filter": "2026-03-21",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["z1_manali_decision"],
            "explanation": "Temporal search for messages on 2026-03-21."
        },
        {
            "id": "q22",
            "query": "what flat discussions took place on May 15",
            "type": "temporal",
            "date_filter": "2026-05-15",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["s2_flat_rent"],
            "explanation": "Temporal search for messages on 2026-05-15."
        },
        {
            "id": "q23",
            "query": "what birthday plans were discussed on July 18",
            "type": "temporal",
            "date_filter": "2026-07-18",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["z3_bday_gift"],
            "explanation": "Temporal search for messages on 2026-07-18."
        },
        {
            "id": "q24",
            "query": "what did we talk about in March 2026 about budget",
            "type": "temporal",
            "date_filter": "2026-03",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["s1_manali_budget"],
            "explanation": "Temporal search for March 2026 trip budget."
        },
        {
            "id": "q25",
            "query": "what happened in May 2026 regarding apartment deposit",
            "type": "temporal",
            "date_filter": "2026-05",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["z2_flat_deposit"],
            "explanation": "Temporal search for May 2026 deposit."
        },
        
        # --- ADDITIONAL SEMANTIC & MIXED QUERIES (q26 to q40) ---
        {
            "id": "q26",
            "query": "manali hotel travel budget per person",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["s1_manali_budget"],
            "explanation": "Semantic search for Manali budget."
        },
        {
            "id": "q27",
            "query": "3BHK Indiranagar monthly rent cost",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["s2_flat_rent"],
            "explanation": "Semantic search for 3BHK rent."
        },
        {
            "id": "q28",
            "query": "iPad Air gift per head share",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["s3_gift_budget"],
            "explanation": "Semantic search for gift contribution."
        },
        {
            "id": "q29",
            "query": "who suggested Volvo bus for Delhi journey",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z1_manali_decision"])) + 5]["id"],
            "explanation": "Semantic search for bus suggestion."
        },
        {
            "id": "q30",
            "query": "what is the rental period lock-in requirement",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z2_flat_deposit"])) + 2]["id"],
            "explanation": "Semantic search for rental lock-in."
        },
        {
            "id": "q31",
            "query": "cricket match weekend tickets booking",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a5_amit_tickets"],
            "explanation": "Semantic search for cricket match tickets."
        },
        {
            "id": "q32",
            "query": "car repair mechanics invoice amount",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a6_rohan_car"],
            "explanation": "Semantic search for car repair bill."
        },
        {
            "id": "q33",
            "query": "pizza party and badam shake invitation",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a7_ananya_party"],
            "explanation": "Semantic search for party invitation."
        },
        {
            "id": "q34",
            "query": "gym membership extension deal",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a8_vikram_gym"],
            "explanation": "Semantic search for gym offer."
        },
        {
            "id": "q35",
            "query": "flight booking confirmation to Mumbai",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a9_neha_flight"],
            "explanation": "Semantic search for Mumbai flight."
        },
        {
            "id": "q36",
            "query": "what did Rahul ask about summer vacation spot",
            "type": "attributed",
            "sender_filter": "Rahul Sharma",
            "is_zero_keyword_overlap": False,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z1_manali_decision"])) - 3]["id"],
            "explanation": "Attributed search for Rahul's question on summer trip."
        },
        {
            "id": "q37",
            "query": "what alternative destination did Priya mention besides Himachal",
            "type": "attributed",
            "sender_filter": "Priya Verma",
            "is_zero_keyword_overlap": False,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z1_manali_decision"])) - 2]["id"],
            "explanation": "Attributed search for Priya mentioning Goa."
        },
        {
            "id": "q38",
            "query": "who noted that Goa would be too hot in March April",
            "type": "attributed",
            "sender_filter": "Amit Patel",
            "is_zero_keyword_overlap": False,
            "expected_message_id": messages[messages.index(next(m for m in messages if m["id"] == targets["z1_manali_decision"])) - 1]["id"],
            "explanation": "Attributed search for Amit's comment on weather."
        },
        {
            "id": "q39",
            "query": "what color iPad was chosen for Sneha",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["z3_bday_gift"],
            "explanation": "Semantic search for iPad color."
        },
        {
            "id": "q40",
            "query": "resume review request from Priya",
            "type": "semantic",
            "is_zero_keyword_overlap": False,
            "expected_message_id": targets["a2_priya_resume"],
            "explanation": "Semantic search for resume review."
        }
    ]
    
    with open("backend/dataset/test_queries.json", "w", encoding="utf-8") as f:
        json.dump(queries, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved 40 evaluation queries to backend/dataset/test_queries.json")

if __name__ == "__main__":
    generate_dataset()
