import re

BLOCKED_PROMPT_MESSAGE = "Sorry, I cannot help with your problem."

_LEET_MAP = str.maketrans(
    {
        "0": "o",
        "1": "i",
        "3": "e",
        "4": "a",
        "5": "s",
        "7": "t",
        "@": "a",
        "$": "s",
    }
)

_SEX_TERMS = (
    r"(?:s[\W_]*e[\W_]*x|f[\W_]*u[\W_]*c[\W_]*k(?:ing|ed|s)?|hook\s*up|hookup|"
    r"escort|prostitut\w*|brothel|strip\s*club|porn\w*|nudes?|get\s+laid|orgy)"
)

_ROBBERY_TERMS = (
    r"(?:rob(?:bed|ber|bery|bing|s)?|steal(?:ing|s)?|stole|stolen|shoplift\w*|"
    r"burglar\w*|break\s+into|mug(?:ged|ging|s)?|pickpocket\w*|hijack\w*|"
    r"smuggl\w*|scam(?:ming|med|s)?|fraud|launder\w*)"
)

_VIOLENCE_TERMS = (
    r"(?:kill(?:ing|ed|s)?|murder\w*|attack(?:ing|ed|s)?|shoot(?:ing|s)?|"
    r"stab(?:bing|bed|s)?|kidnap\w*|assault\w*|hurt\s+(?:someone|somebody|people))"
)

_DRUG_TERMS = r"(?:(?:buy|sell|get|score)\s+(?:some\s+)?drugs?)"

_PARTNER_TERMS = (
    r"(?:lover|girlfriends?|boyfriends?|hook\s*up|hookup|soulmate|escort|"
    r"prostitut\w*|sugar\s+(?:daddy|mommy)|one[-\s]?night\s+stand|date|"
    r"girls?|boys?|women|men)"
)

_UNSAFE_PATTERNS: list[re.Pattern[str]] = [
    re.compile(
        rf"\b(?:places?|spots?)\s+(?:to|for)\s+(?:have\s+)?"
        rf"(?:{_SEX_TERMS}|{_ROBBERY_TERMS}|{_VIOLENCE_TERMS}|{_DRUG_TERMS})\b",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\bwhere\s+(?:to|can|could|do|should)\s+(?:i\s+)?"
        rf"(?:find|get|have|buy|sell|meet|go\s+for|score)?\s*"
        rf"(?:{_SEX_TERMS}|{_ROBBERY_TERMS}|{_VIOLENCE_TERMS}|{_DRUG_TERMS})\b",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\b(?:find|search(?:ing)?\s+for|look(?:ing)?\s+for)\s+"
        rf"(?:a\s+|an\s+|some\s+)?(?:place|spot|someone|somebody|people)\s+"
        rf"(?:to|where)\s+(?:{_SEX_TERMS}|{_ROBBERY_TERMS}|{_VIOLENCE_TERMS})\b",
        re.IGNORECASE,
    ),
    re.compile(
        r"\bi\s+(?:want|need|wanna|would\s+like)\s+(?:to\s+)?(?:have\s+)?"
        r"(?:sex|fuck|get\s+laid|hook\s*up)\b",
        re.IGNORECASE,
    ),
    re.compile(
        r"\bi\s+(?:want|need|wanna|plan|intend|gonna|going|will)\s+(?:to\s+)?"
        rf"(?:{_ROBBERY_TERMS})\b",
        re.IGNORECASE,
    ),
    re.compile(
        r"\b(?:find|get|search(?:ing)?\s+for|look(?:ing)?\s+for|"
        r"where\s+(?:to|can|could|do|should)\s+(?:i\s+)?find)\b"
        rf"[\s\S]{{0,30}}\b(?:a\s+|an\s+|some\s+|myself\s+)?{_PARTNER_TERMS}\b",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\bi\s+(?:want|need|wanna)\s+(?:a\s+|an\s+|some\s+)?{_PARTNER_TERMS}\b",
        re.IGNORECASE,
    ),
]


def _normalize(text: str) -> str:
    return " ".join(text.lower().translate(_LEET_MAP).split())


def get_blocked_message(raw_text: str) -> str | None:
    """Return the policy message when a prompt is not safe or appropriate."""
    text = _normalize(raw_text)
    if any(pattern.search(text) for pattern in _UNSAFE_PATTERNS):
        return BLOCKED_PROMPT_MESSAGE
    return None
