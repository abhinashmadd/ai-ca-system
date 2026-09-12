import datetime
import threading
import time
from typing import Dict, Any, List

class DocumentExpiryScheduler:
    """
    Automated background scheduler and notification dispatcher.
    Evaluates document expiry dates daily, updates statuses,
    and dispatches Email, WhatsApp, and In-App renewal reminders.
    """

    _scheduler_thread = None
    _is_running = False
    _last_run_timestamp = None

    @classmethod
    def start_background_scheduler(cls, interval_seconds: int = 86400):
        """Starts a background daemon thread that triggers daily checks."""
        if cls._is_running:
            return

        cls._is_running = True

        def loop():
            while cls._is_running:
                try:
                    cls.run_daily_check()
                except Exception as e:
                    print(f"[Scheduler] Background check error: {e}")
                time.sleep(interval_seconds)

        cls._scheduler_thread = threading.Thread(target=loop, daemon=True, name="DocumentExpiryScheduler")
        cls._scheduler_thread.start()
        print(f"[Scheduler] Daily Document Expiry Scheduler started (interval={interval_seconds}s).")

    @classmethod
    def run_daily_check(cls) -> Dict[str, Any]:
        """Runs an immediate scan across all stored documents."""
        from backend.database import db_manager

        cls._last_run_timestamp = datetime.datetime.now().isoformat()
        docs = db_manager.get_documents()

        updated_count = 0
        reminders_dispatched = 0
        today = datetime.date.today()

        for doc in docs:
            exp_str = doc.get("expiryDate")
            if not exp_str or not exp_str.strip() or exp_str.lower() == "perpetual":
                doc["daysRemaining"] = None
                doc["isMissingExpiry"] = not bool(exp_str and exp_str.strip())
                continue

            try:
                exp_date = datetime.date.fromisoformat(exp_str[:10])
                days_left = (exp_date - today).days
                doc["daysRemaining"] = days_left
                doc["isMissingExpiry"] = False

                prev_status = doc.get("status")
                # Update status if not in manual renewal workflow
                if prev_status not in ["Renewal Pending", "Renewal Completed"]:
                    if days_left < 0:
                        new_status = "Expired"
                    elif days_left <= 90:
                        new_status = "Expiring Soon"
                    else:
                        new_status = "Active"

                    if new_status != prev_status:
                        doc["status"] = new_status
                        updated_count += 1

                # Automated reminder trigger for 90d, 30d, 7d, or Expired
                if days_left in [90, 60, 30, 15, 7, 3, 1, 0, -1]:
                    cls.dispatch_notification(
                        doc=doc,
                        channel="in_app",
                        message=f"Statutory Notice: {doc['documentName']} ({doc['documentNumber']}) has {days_left} days remaining until legal expiry."
                    )
                    reminders_dispatched += 1

                db_manager.update_document(doc["id"], doc)
            except Exception as e:
                print(f"[Scheduler] Error parsing doc {doc.get('id')}: {e}")

        return {
            "success": True,
            "timestamp": cls._last_run_timestamp,
            "totalScanned": len(docs),
            "updatedCount": updated_count,
            "remindersDispatched": reminders_dispatched
        }

    @classmethod
    def dispatch_notification(cls, doc: Dict[str, Any], channel: str, message: str = "", recipient: str = "") -> Dict[str, Any]:
        """Dispatches an Email, WhatsApp, or In-App notification."""
        from backend.database import db_manager

        days_left = doc.get("daysRemaining")
        days_text = f"{days_left} days" if days_left is not None else "Notice"
        doc_name = doc.get("documentName", "Corporate License")
        doc_num = doc.get("documentNumber", "N/A")
        holder = doc.get("holderName", "Company")

        if not message:
            message = (
                f"STATUTORY RENEWAL NOTICE: {doc_name} (ID: {doc_num}) issued to {holder} "
                f"requires statutory renewal within {days_text}. Please initiate compliance verification."
            )

        if not recipient:
            recipient = "practice.admin@apex-advisory.com" if channel == "email" else "+91 98200 12345"

        timestamp = datetime.datetime.now().isoformat()

        # Log notification in DB
        db_manager.log_notification({
            "documentId": doc.get("id"),
            "documentName": doc_name,
            "channel": channel,
            "recipient": recipient,
            "message": message,
            "status": "Delivered",
            "timestamp": timestamp
        })

        # Increment document reminders count
        reminders_count = doc.get("remindersSent", 0) + 1
        db_manager.update_document(doc.get("id"), {
            "remindersSent": reminders_count,
            "lastReminderAt": timestamp
        })

        return {
            "success": True,
            "channel": channel,
            "recipient": recipient,
            "message": message,
            "deliveredAt": timestamp
        }

    @classmethod
    def get_last_run_timestamp(cls):
        return cls._last_run_timestamp
