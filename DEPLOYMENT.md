# 🚀 DEPLOYMENT NA VERCEL + RAILWAY

## KROK 1: Backend na Railway

### 1.1 Utwórz konto na Railway
- Wejdź na https://railway.app
- Zaloguj się GitHub account

### 1.2 Utwórz nowy projekt
```bash
# Opcja A: Via CLI
npm i -g @railway/cli
railway login
cd /Users/radekd/Desktop/refactori
railway init

# Opcja B: Via Dashboard
# Klikaj: New Project → Deploy from GitHub → Select refactori repo
```

### 1.3 Konfiguracja Railway
- **Select directory**: `backend/`
- **Add Environment Variables**:
```
GROQ_API_KEY = [klucz z Groq]
SUPABASE_URL = https://dlhpckafqrckoizpuvof.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [klucz z Supabase]
BACKEND_API_SECRET = [losowy string]
PORT = ${{PORT}} (automatyczne)
```

### 1.4 Deploy
```bash
railway deploy
# Railway powinien znaleźć railway.toml i wdrożyć
```

**Po deployment'u Railway da Ci URL**, np:
```
https://refactori-production.up.railway.app
```

---

## KROK 2: Frontend na Vercel

### 2.1 Deploy frontendu
```bash
cd /Users/radekd/Desktop/refactori/frontend
vercel
# Lub: Wejdź na https://vercel.com/new → Select refactori repo → /frontend
```

### 2.2 Environment Variables w Vercel
```
NEXT_PUBLIC_SUPABASE_URL=https://dlhpckafqrckoizpuvof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key_z_supabase]
NEXT_PUBLIC_BACKEND_URL=https://refactori-production.up.railway.app
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 2.3 Konfiguracja CORS w Railway
W kodzie backendu (`app/main.py`) CORS jest już skonfigurowany:
```python
allow_origins=settings.allowed_origins
```

Musimy dodać frontend URL do allowed_origins w Railway. 
**W Railway Dashboard**:
- Project Settings → Environment Variables
- Dodaj: `FRONTEND_URL=https://your-vercel-domain.vercel.app`

Lub zmień kod:
```python
# app/core/config.py
allowed_origins: list[str] = [
    "http://localhost:3000",
    "http://localhost:8000",
    os.getenv("FRONTEND_URL", ""),  # Railway
]
```

---

## KROK 3: Zaktualizuj frontend na komunikację z backendem

### 3.1 Plik: `frontend/src/lib/api.ts`
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function refactorResume(content: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/refactor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resume_content: content }),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}
```

---

## KROK 4: Testowanie

### Lokalnie:
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev

# Testuj: http://localhost:3000
```

### Production:
- Frontend: `https://your-vercel-domain.vercel.app`
- Backend: `https://refactori-production.up.railway.app`

---

## 🆘 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest at 'https://...' blocked by CORS policy
```
**Rozwiązanie:**
- Sprawdź `allowed_origins` w Railway env vars
- Upewnij się, że frontend URL jest na białej liście

### 502 Bad Gateway
- Sprawdź Railway logs
- Upewnij się, że `PORT` env var jest ustawiony
- Sprawdź `startCommand` w railway.toml

### Backend nie odpowiada
```bash
# Test connectivity
curl https://refactori-production.up.railway.app/health
```

---

## Zmienne środowiskowe — CHECKLIST

- [ ] Zmienić klucze API (na nowe!)
- [ ] GROQ_API_KEY na Railway
- [ ] SUPABASE_SERVICE_ROLE_KEY na Railway
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel
- [ ] NEXT_PUBLIC_BACKEND_URL na Vercel
- [ ] Frontend URL w Railway (dla CORS)
