# Refactori 🚀

> **"Automated resume refactoring for tech professionals."**

Niszowa aplikacja webowa do automatycznego dopasowywania CV kandydatów IT (Programiści, DevOps, QA, Data Scientists, PM) do konkretnych ofert pracy — z optymalizacją ATS i formułą osiągnięć Google X-Y-Z.

---

## Stack Techniczny

| Warstwa | Technologia |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, shadcn/ui |
| Backend | Python 3.12, FastAPI, Groq SDK |
| AI Model | `llama-3.3-70b-versatile` via Groq API |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Dev | Docker Compose |

---

## Struktura Monorepo

```
refactori/
├── frontend/    # Next.js 14 App
├── backend/     # FastAPI + Groq
└── supabase/    # SQL migrations
```

---

## Quickstart

### 1. Klonowanie i konfiguracja

```bash
git clone https://github.com/your-org/refactori.git
cd refactori
cp .env.example .env
# Uzupełnij .env: GROQ_API_KEY, NEXT_PUBLIC_SUPABASE_URL, itd.
```

### 2. Supabase — migracje

```bash
# Przez Supabase CLI lub wklej ręcznie przez Dashboard > SQL Editor
supabase db push
```

### 3. Dev (Docker)

```bash
docker-compose up
```

Lub osobno:

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

Frontend: http://localhost:3000  
Backend API docs: http://localhost:8000/docs

---

## Kluczowe funkcje

- 🔍 **Analiza oferty pracy** — scraping URL lub manual paste
- ⚙️ **Refaktoryzacja AI** — llama-3.3-70b przez Groq (ultra-fast inference)
- 📊 **Match Report** — procent dopasowania + brakujące słowa kluczowe + rady
- ✏️ **Live Editor** — pełna edycja na żywo przed pobraniem PDF
- 📄 **ATS-Clean PDF** — tekst wektorowy przez natywny print przeglądarki
- 📁 **Historia deployów** — wszystkie CV powiązane z kontem użytkownika

---

## Licencja

MIT
