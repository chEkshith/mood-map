import json
import re

from groq import AsyncGroq

from app.config import settings
from app.logger import get_logger
from app.schemas.mood import MoodEnum

logger = get_logger("classifier")

SYSTEM_PROMPT = (
    "You are a mood classifier. Analyze the user's text and respond "
    "with ONLY a valid JSON object, no markdown, no explanation.\n"
    'Format: {"mood": "<value>", "confidence": <float>}\n'
    "mood must be exactly one of: stressed, anxious, bored, "
    "exhausted, happy, melancholic.\n"
    "confidence must be between 0.0 and 1.0.\n"
    "Consider full context: metaphors, situations, and emotions."
)

_KEYWORD_MAP: list[tuple[re.Pattern, MoodEnum, float]] = [
    (re.compile(r"tired|exhausted|sleepy|drained", re.I), MoodEnum.exhausted, 0.70),
    (re.compile(r"stress|overwhelm|pressure|deadline|burnout", re.I), MoodEnum.stressed, 0.70),
    (re.compile(r"bored|nothing|dull|empty|pointless", re.I), MoodEnum.bored, 0.65),
    (re.compile(r"anxious|worry|nervous|panic|scared", re.I), MoodEnum.anxious, 0.70),
    (re.compile(r"happy|great|excited|joyful|wonderful", re.I), MoodEnum.happy, 0.70),
    (re.compile(r"sad|lonely|miss|grief|melancholy", re.I), MoodEnum.melancholic, 0.65),
]


class MoodClassifier:
    def __init__(self) -> None:
        self._client = AsyncGroq(api_key=settings.groq_api_key)

    async def classify(self, raw_text: str) -> tuple[MoodEnum, float]:
        text = " ".join(raw_text.strip().split())

        try:
            response = await self._client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": text},
                ],
                temperature=0.2,
                max_tokens=100,
            )
            content = response.choices[0].message.content or ""
            content = content.strip()
            if content.startswith("```"):
                content = re.sub(r"^```(json)?|```$", "", content, flags=re.M).strip()

            data = json.loads(content)
            mood = MoodEnum(data["mood"])
            confidence = float(data["confidence"])

            if confidence < 0.55:
                mood = MoodEnum.bored
                confidence = 0.50

            logger.info(f"Classified mood={mood.value} confidence={confidence}")
            return mood, confidence

        except Exception as exc:  # noqa: BLE001
            logger.error(f"Groq classification failed, using fallback: {exc}")
            mood, confidence = self._keyword_fallback(text)
            logger.info(f"Fallback mood={mood.value} confidence={confidence}")
            return mood, confidence

    def _keyword_fallback(self, text: str) -> tuple[MoodEnum, float]:
        for pattern, mood, confidence in _KEYWORD_MAP:
            if pattern.search(text):
                return mood, confidence
        return MoodEnum.bored, 0.50
