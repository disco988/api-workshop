# REST API Workshop

Interaktywna aplikacja do nauki REST API — z dokumentacją, ćwiczeniami i placem zabaw.

## Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **State**: TanStack Query (server state) + Redux Toolkit (progress)
- **API**: Vercel Serverless Functions (mock API)
- **Deploy**: Vercel

---

## Deploy na Vercel (5 minut)

### Opcja A — przez GitHub (zalecane)

1. Wrzuć ten folder na GitHub jako nowe repo
2. Wejdź na [vercel.com](https://vercel.com) → **Add New Project**
3. Zaimportuj repo
4. Vercel wykryje `vercel.json` automatycznie
5. Kliknij **Deploy** — gotowe!

### Opcja B — przez Vercel CLI

```bash
npm install -g vercel
cd workshop-app
vercel
```

---

## Lokalne uruchomienie

### Frontend + mock API razem (przez Vercel CLI)

```bash
npm install -g vercel
cd workshop-app
vercel dev
```

Aplikacja będzie dostępna na `http://localhost:3000`.

### Sam frontend (bez prawdziwego API)

```bash
cd workshop-app/frontend
npm install
npm run dev
```

> ⚠️ Bez backendu requesty z ćwiczeń trafią w próżnię. Użyj `vercel dev` dla pełnego doświadczenia.

---

## Struktura projektu

```
workshop-app/
├── vercel.json              # routing: /api/* → functions, reszta → frontend
├── package.json
│
├── api/                     # Vercel Serverless Functions
│   ├── produkty.ts          # GET /api/produkty
│   └── produkty/
│       ├── index.ts         # POST /api/produkty
│       └── [id].ts          # GET /api/produkty/:id, PUT /api/produkty/:id
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CodeBlock.tsx       # blok kodu z podświetlaniem
    │   │   ├── MethodBadge.tsx     # GET/POST/PUT/DELETE badge
    │   │   ├── RequestBuilder.tsx  # builder requestu + textarea body
    │   │   └── ResponsePanel.tsx   # wyświetlanie odpowiedzi
    │   ├── pages/
    │   │   ├── DocsPage.tsx        # dokumentacja API
    │   │   ├── ExercisesPage.tsx   # ćwiczenia z walidacją
    │   │   └── PlaygroundPage.tsx  # wolny plac zabaw
    │   ├── store/
    │   │   ├── index.ts
    │   │   └── progressSlice.ts    # progress ćwiczeń (localStorage)
    │   ├── lib/
    │   │   ├── api.ts              # TanStack Query hooks
    │   │   └── exercises.ts        # definicje ćwiczeń + walidatory
    │   └── types/index.ts
    └── ...config files
```

---

## Dodawanie ćwiczeń

Edytuj `frontend/src/lib/exercises.ts` — dodaj nowy obiekt do tablicy `EXERCISES`:

```ts
{
  id: 'ex5',
  number: 5,
  title: 'Twoje ćwiczenie',
  description: 'Opis co ma zrobić użytkownik',
  hint: 'Wskazówka widoczna po kliknięciu',
  method: 'GET',
  expectedStatus: 200,
  validate(result) {
    if (!result.ok) return { passed: false, message: `Błąd: ${result.status}` }
    return { passed: true, message: 'Świetnie!' }
  },
}
```

## Rozszerzanie API

Dodaj nowy plik w `api/` — Vercel automatycznie tworzy z niego endpoint:

- `api/kategorie.ts` → `GET /api/kategorie`
- `api/zamowienia/[id].ts` → `GET/PUT /api/zamowienia/:id`
