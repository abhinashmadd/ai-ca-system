import os
import json
import uuid
import datetime
from typing import Dict, Any, List, Optional
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "ca_platform_db")
BACKUP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
BACKUP_FILE = os.path.join(BACKUP_DIR, "mongodb_data.json")

class DatabaseManager:
    def __init__(self):
        self.is_connected = False
        self.client = None
        self.db = None
        self.users_col = None
        self.otps_col = None
        self.docs_col = None
        self.notifs_col = None
        self.fallback_data = {"users": [], "otps": [], "documents": [], "notifications": []}
        
        self._init_connection()

    def _init_connection(self):
        os.makedirs(BACKUP_DIR, exist_ok=True)
        self._load_fallback_file()
        
        try:
            self.client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=1500)
            # Test connection
            self.client.admin.command("ping")
            self.db = self.client[DB_NAME]
            self.users_col = self.db["users"]
            self.otps_col = self.db["otps"]
            self.docs_col = self.db["documents"]
            self.notifs_col = self.db["notifications"]
            self.is_connected = True
            print(f"[MongoDB] Successfully connected to live MongoDB at {MONGO_URI} (DB: {DB_NAME})")
            self._seed_default_users()
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            self.is_connected = False
            print(f"[MongoDB] Live MongoDB not reachable ({e}). Using persistent embedded document store at {BACKUP_FILE}.")
            self._seed_default_users()

    def _load_fallback_file(self):
        if os.path.exists(BACKUP_FILE):
            try:
                with open(BACKUP_FILE, "r", encoding="utf-8") as f:
                    self.fallback_data = json.load(f)
            except Exception:
                self.fallback_data = {"users": [], "otps": []}
        else:
            self.fallback_data = {"users": [], "otps": []}

    def _save_fallback_file(self):
        try:
            with open(BACKUP_FILE, "w", encoding="utf-8") as f:
                json.dump(self.fallback_data, f, indent=2, default=str)
        except Exception as e:
            print(f"[DatabaseManager] Failed to write fallback file: {e}")

    def _seed_default_users(self):
        seed_users = [
            {
                "id": "USR-7701",
                "username": "ashish vaiswani",
                "password": "12345678",
                "name": "CA. Ashish Vaiswani, FCA",
                "role": "Senior Partner CA",
                "email": "aditya.tripathi@tripathi-ca.com",
                "firm": "Tripathi & Associates Chartered Accountants",
                "frn": "FRN-012938N",
                "cop": "COP-88192",
                "membershipId": "CA-ADITYA-7701",
                "dscStatus": "Class 3 DSC Active (Nov 2027)",
                "status": "Active",
                "created_at": "2026-08-15T09:30:00"
            },
            {
                "id": "USR-7702",
                "username": "finance@apexcorp.com",
                "password": "clientPass2026",
                "name": "Alex Mercer (CFO)",
                "role": "Enterprise CFO",
                "email": "alex.mercer@apexcorp.com",
                "firm": "Apex Global Technologies Corp",
                "frn": "FRN-CORP-4491",
                "cop": "COP-CLIENT-01",
                "membershipId": "CLIENT-APEX-901",
                "dscStatus": "Corporate e-Sign Verified",
                "status": "Active",
                "created_at": "2026-08-20T11:15:00"
            },
            {
                "id": "USR-7703",
                "username": "AUD-IN-88902",
                "password": "auditSecure99",
                "name": "Audit Director (Ernst & Young LLP)",
                "role": "Statutory Lead Auditor",
                "email": "statutory.audit@ey-firm.com",
                "firm": "Ernst & Young Statutory Audit & Assurance LLP",
                "frn": "FRN-001928A",
                "cop": "COP-AUD-882",
                "membershipId": "AUD-IN-88902",
                "dscStatus": "Peer Review Certified Tier-1",
                "status": "Active",
                "created_at": "2026-08-22T14:40:00"
            }
        ]

        if self.is_connected:
            for u in seed_users:
                if not self.users_col.find_one({"username": u["username"]}):
                    self.users_col.insert_one(u)
        else:
            existing_usernames = {x["username"].lower() for x in self.fallback_data.get("users", [])}
            for u in seed_users:
                if u["username"].lower() not in existing_usernames:
                    self.fallback_data["users"].append(u)
            self._save_fallback_file()

    # --- User Operations ---
    def get_user_by_username_or_email(self, identifier: str) -> Optional[Dict[str, Any]]:
        ident = identifier.strip().lower()
        if self.is_connected:
            doc = self.users_col.find_one({
                "$or": [
                    {"username": {"$regex": f"^{ident}$", "$options": "i"}},
                    {"email": {"$regex": f"^{ident}$", "$options": "i"}},
                    {"membershipId": {"$regex": f"^{ident}$", "$options": "i"}}
                ]
            })
            if doc and "_id" in doc:
                doc["_id"] = str(doc["_id"])
            return doc
        else:
            for u in self.fallback_data.get("users", []):
                if (u.get("username", "").lower() == ident or 
                    u.get("email", "").lower() == ident or 
                    u.get("membershipId", "").lower() == ident):
                    return dict(u)
            return None

    def get_all_users(self) -> List[Dict[str, Any]]:
        if self.is_connected:
            cursor = self.users_col.find({})
            users = []
            for doc in cursor:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                # mask or keep password
                users.append(doc)
            return users
        else:
            return list(self.fallback_data.get("users", []))

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in user_data or not user_data["id"]:
            user_data["id"] = f"USR-{uuid.uuid4().hex[:6].upper()}"
        if "created_at" not in user_data or not user_data["created_at"]:
            user_data["created_at"] = datetime.datetime.now().isoformat()
        if "status" not in user_data:
            user_data["status"] = "Active"

        if self.is_connected:
            self.users_col.insert_one(dict(user_data))
            user_copy = dict(user_data)
            if "_id" in user_copy:
                user_copy["_id"] = str(user_copy["_id"])
            return user_copy
        else:
            self.fallback_data["users"].append(user_data)
            self._save_fallback_file()
            return user_data

    def update_user(self, identifier: str, update_fields: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        ident = identifier.strip().lower()
        if self.is_connected:
            self.users_col.update_one(
                {"$or": [{"id": identifier}, {"username": {"$regex": f"^{ident}$", "$options": "i"}}]},
                {"$set": update_fields}
            )
            return self.get_user_by_username_or_email(identifier)
        else:
            for i, u in enumerate(self.fallback_data.get("users", [])):
                if u.get("id") == identifier or u.get("username", "").lower() == ident:
                    self.fallback_data["users"][i].update(update_fields)
                    self._save_fallback_file()
                    return self.fallback_data["users"][i]
            return None

    def delete_user(self, identifier: str) -> bool:
        ident = identifier.strip().lower()
        if self.is_connected:
            result = self.users_col.delete_one(
                {"$or": [{"id": identifier}, {"username": {"$regex": f"^{ident}$", "$options": "i"}}]}
            )
            return result.deleted_count > 0
        else:
            initial_len = len(self.fallback_data.get("users", []))
            self.fallback_data["users"] = [
                u for u in self.fallback_data.get("users", [])
                if u.get("id") != identifier and u.get("username", "").lower() != ident
            ]
            if len(self.fallback_data["users"]) < initial_len:
                self._save_fallback_file()
                return True
            return False

    # --- OTP Operations ---
    def save_otp(self, identifier: str, otp_code: str, expires_minutes: int = 10) -> Dict[str, Any]:
        ident = identifier.strip().lower()
        expiry = (datetime.datetime.now() + datetime.timedelta(minutes=expires_minutes)).isoformat()
        otp_record = {
            "identifier": ident,
            "otp": otp_code,
            "expires_at": expiry,
            "verified": False,
            "created_at": datetime.datetime.now().isoformat()
        }

        if self.is_connected:
            self.otps_col.delete_many({"identifier": ident})
            self.otps_col.insert_one(otp_record)
        else:
            self.fallback_data["otps"] = [
                o for o in self.fallback_data.get("otps", []) if o.get("identifier") != ident
            ]
            self.fallback_data["otps"].append(otp_record)
            self._save_fallback_file()
            
        return otp_record

    def verify_otp(self, identifier: str, otp_code: str) -> bool:
        ident = identifier.strip().lower()
        now_str = datetime.datetime.now().isoformat()

        if self.is_connected:
            record = self.otps_col.find_one({
                "identifier": ident,
                "otp": otp_code.strip(),
                "expires_at": {"$gt": now_str}
            })
            if record:
                self.otps_col.update_one({"_id": record["_id"]}, {"$set": {"verified": True}})
                return True
            return False
        else:
            for o in self.fallback_data.get("otps", []):
                if (o.get("identifier") == ident and 
                    o.get("otp") == otp_code.strip() and 
                    o.get("expires_at", "") > now_str):
                    o["verified"] = True
                    self._save_fallback_file()
                    return True
            return False

    def clear_otp(self, identifier: str):
        ident = identifier.strip().lower()
        if self.is_connected:
            self.otps_col.delete_many({"identifier": ident})
        else:
            self.fallback_data["otps"] = [
                o for o in self.fallback_data.get("otps", []) if o.get("identifier") != ident
            ]
            self._save_fallback_file()

    # --- Document Operations ---
    def get_documents(self, filter_dict: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if self.is_connected and self.docs_col is not None:
            query = filter_dict or {}
            cursor = self.docs_col.find(query)
            docs = []
            for doc in cursor:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
                docs.append(doc)
            return docs
        else:
            docs = self.fallback_data.get("documents", [])
            if not filter_dict:
                return list(docs)
            result = []
            for d in docs:
                match = True
                for k, v in filter_dict.items():
                    if d.get(k) != v:
                        match = False
                        break
                if match:
                    result.append(d)
            return result

    def get_document_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        if self.is_connected and self.docs_col is not None:
            doc = self.docs_col.find_one({"id": doc_id})
            if doc and "_id" in doc:
                doc["_id"] = str(doc["_id"])
            return doc
        else:
            for d in self.fallback_data.get("documents", []):
                if d.get("id") == doc_id:
                    return dict(d)
            return None

    def create_document(self, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in doc_data or not doc_data["id"]:
            doc_data["id"] = f"DOC-{datetime.date.today().year}-{uuid.uuid4().hex[:6].upper()}"
        if "created_at" not in doc_data or not doc_data["created_at"]:
            doc_data["created_at"] = datetime.datetime.now().isoformat()

        if self.is_connected and self.docs_col is not None:
            self.docs_col.insert_one(dict(doc_data))
            doc_copy = dict(doc_data)
            if "_id" in doc_copy:
                doc_copy["_id"] = str(doc_copy["_id"])
            return doc_copy
        else:
            if "documents" not in self.fallback_data:
                self.fallback_data["documents"] = []
            self.fallback_data["documents"].append(doc_data)
            self._save_fallback_file()
            return doc_data

    def update_document(self, doc_id: str, update_fields: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        update_fields["updated_at"] = datetime.datetime.now().isoformat()
        if self.is_connected and self.docs_col is not None:
            self.docs_col.update_one({"id": doc_id}, {"$set": update_fields})
            return self.get_document_by_id(doc_id)
        else:
            for i, d in enumerate(self.fallback_data.get("documents", [])):
                if d.get("id") == doc_id:
                    self.fallback_data["documents"][i].update(update_fields)
                    self._save_fallback_file()
                    return self.fallback_data["documents"][i]
            return None

    def delete_document(self, doc_id: str) -> bool:
        if self.is_connected and self.docs_col is not None:
            result = self.docs_col.delete_one({"id": doc_id})
            return result.deleted_count > 0
        else:
            initial_len = len(self.fallback_data.get("documents", []))
            self.fallback_data["documents"] = [
                d for d in self.fallback_data.get("documents", []) if d.get("id") != doc_id
            ]
            if len(self.fallback_data["documents"]) < initial_len:
                self._save_fallback_file()
                return True
            return False

    # --- Notification Logs ---
    def get_notifications(self, limit: int = 50) -> List[Dict[str, Any]]:
        if self.is_connected and self.notifs_col is not None:
            cursor = self.notifs_col.find({}).sort("timestamp", -1).limit(limit)
            notifs = []
            for n in cursor:
                if "_id" in n:
                    n["_id"] = str(n["_id"])
                notifs.append(n)
            return notifs
        else:
            notifs = list(self.fallback_data.get("notifications", []))
            notifs.reverse()
            return notifs[:limit]

    def save_notification(self, notif_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in notif_data:
            notif_data["id"] = f"NOTIF-{uuid.uuid4().hex[:8].upper()}"
        if "timestamp" not in notif_data:
            notif_data["timestamp"] = datetime.datetime.now().isoformat()

        if self.is_connected and self.notifs_col is not None:
            self.notifs_col.insert_one(dict(notif_data))
            n_copy = dict(notif_data)
            if "_id" in n_copy:
                n_copy["_id"] = str(n_copy["_id"])
            return n_copy
        else:
            if "notifications" not in self.fallback_data:
                self.fallback_data["notifications"] = []
            self.fallback_data["notifications"].append(notif_data)
            self._save_fallback_file()
            return notif_data

# Global database instance
db = DatabaseManager()
db_manager = db
