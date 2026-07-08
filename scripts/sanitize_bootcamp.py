"""One-off: sanitize grok-api-bootcamp for public Materials Factory."""
from pathlib import Path

SRC = Path(r"D:\GrokBuild\Experiments\grok-api-bootcamp\index.html")
OUT = Path(
    r"D:\GrokBuild\nwb-vending\2nd-pages\materials-factory\training\llm-api-bootcamp\full\index.html"
)

REPLACEMENTS = [
    ("xAI Grok API Bootcamp", "LLM API Bootcamp (xAI Grok)"),
    ("Grok API Bootcamp", "LLM API Bootcamp"),
    ("Your credits: $50+ unused", "Prepaid API credits (example: $50)"),
    ("Your API credits ($50.72)", "Your API credits (example balance)"),
    ("$50.72", "$50"),
    ("Welcome, Kelly · xAI Console", "Welcome, [your account] · xAI Console"),
    ("Built an app (that she doesn't use)", "Built a client app for a non-technical user"),
    ("an app button for your mom", "an app button for a family member"),
    (
        "processing all grandpa-book chapters overnight",
        "processing long-form manuscript chapters overnight",
    ),
    (
        "cover art or scene images for a thriller",
        "cover art or scene images for a fiction project",
    ),
    (
        'Separate from "I built an app for mom."',
        "Separate from one-off personal app projects.",
    ),
    ("grok-api-bootcamp-v1", "llm-api-bootcamp-v1"),
    ("(50.72 / monthly)", "(50 / monthly)"),
]


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUT} ({len(text)} chars)")


if __name__ == "__main__":
    main()