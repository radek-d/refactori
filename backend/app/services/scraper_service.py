"""
CV File Parser & Job Posting Scraper

Handles:
1. Job URL scraping (BeautifulSoup + httpx)
2. CV text extraction from PDF (pdfminer.six)
3. CV text extraction from DOCX (python-docx)
"""

import io
import logging
from typing import Optional

import httpx
from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text as pdf_extract_text
from docx import Document as DocxDocument
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

# Headers to mimic a real browser for job boards
_SCRAPE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9,pl;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Selectors to strip noise from job pages
_NOISE_TAGS = [
    "script", "style", "nav", "footer", "header",
    "aside", "form", "noscript", "iframe", "ads",
]

# Job-content CSS selectors (tried in order — first match wins)
_JOB_CONTENT_SELECTORS = [
    "[data-testid='job-description']",   # LinkedIn
    ".job-description",
    ".description__text",                # LinkedIn alt
    ".jobDescriptionContent",            # Indeed
    "#job-description",
    "[class*='jobDescription']",
    "[class*='job-description']",
    "article",
    "main",
]


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=4))
async def scrape_job_url(url: str) -> Optional[str]:
    """
    Fetches and parses a job posting URL.
    Returns cleaned plain-text description or None if scraping fails.
    """
    try:
        async with httpx.AsyncClient(
            headers=_SCRAPE_HEADERS,
            follow_redirects=True,
            timeout=15.0,
        ) as client:
            resp = await client.get(url)
            resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "lxml")

        # Strip noise elements
        for tag in soup(_NOISE_TAGS):
            tag.decompose()

        # Try targeted selectors first
        for selector in _JOB_CONTENT_SELECTORS:
            el = soup.select_one(selector)
            if el:
                text = el.get_text(separator="\n", strip=True)
                if len(text) > 200:
                    logger.info("Scraped job via selector '%s' (%d chars)", selector, len(text))
                    return _clean_text(text)

        # Fallback: full body text
        body = soup.find("body")
        if body:
            text = body.get_text(separator="\n", strip=True)
            logger.info("Scraped job via body fallback (%d chars)", len(text))
            return _clean_text(text)

        return None

    except Exception as exc:
        logger.warning("Job scraping failed for %s: %s", url, exc)
        return None


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts plain text from a PDF file using pdfminer.six.
    Preserves reading order; suitable for ATS-style CVs.
    """
    try:
        text = pdf_extract_text(io.BytesIO(file_bytes))
        return _clean_text(text)
    except Exception as exc:
        logger.error("PDF extraction failed: %s", exc)
        raise ValueError(f"Could not extract text from PDF: {exc}") from exc


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extracts plain text from a DOCX file using python-docx.
    Preserves paragraph order.
    """
    try:
        doc = DocxDocument(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return _clean_text("\n".join(paragraphs))
    except Exception as exc:
        logger.error("DOCX extraction failed: %s", exc)
        raise ValueError(f"Could not extract text from DOCX: {exc}") from exc


def _clean_text(text: str) -> str:
    """Normalizes whitespace and removes excessive blank lines."""
    lines = [line.strip() for line in text.splitlines()]
    cleaned = "\n".join(line for line in lines if line)
    # Collapse 3+ consecutive newlines into 2
    import re
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()
