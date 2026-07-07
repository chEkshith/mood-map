from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class UserDocument:
    """Reference shape for a document in the `users` MongoDB collection.

    Motor works with raw dicts, so this dataclass is documentation/reference
    only — it is not used as an ORM model.
    """

    _id: object  # ObjectId
    email: str
    hashed_password: str
    display_name: str
    avatar_url: str | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_login: datetime | None = None
    mood_streak: int = 0
    total_entries: int = 0
