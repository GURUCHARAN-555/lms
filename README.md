# LMS - Q&A Search

A responsive, browser-only learning resource for searching a Remote Sensing, GIS, and Image Processing question bank. It has no backend, database, external data request, or authentication requirement.

## Features

- Instant client-side question, answer, keyword, and category search
- Relevance-ranked results and safe search-term highlighting
- Category filters, answer expansion, copying, and shareable question links
- Light, dark, and system theme modes
- Responsive, accessible interface
- Bundled local question data and optional reference-PDF download

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run validate
npm run build
```

## Deploy to Vercel

Import this repository into Vercel, leave the detected Next.js defaults in place, and deploy. The application is fully frontend-only, so no environment variables or backend services are required.

## Add questions

Edit only `data/questions.ts`. Add an object to the `questions` array:

```ts
{
  id: 11,
  question: "What is COBIT?",
  answer: "COBIT is a framework for the governance and management of enterprise IT.",
  category: "Information Security",
  keywords: ["COBIT", "IT governance", "governance framework"]
}
```

Each `id` must be unique. Categories are generated automatically from the data. Search checks the question, answer, category, and keywords and ranks title matches first.

## Imported question bank

The supplied Remote Sensing, GIS & Image Processing question bank has been transcribed into `data/questions.ts`: 349 sequential Q&A entries, 0 invalid records, and 0 exact duplicate records. The original wording and answers are retained; only the PDF's display labels and question numbers were removed from the content fields. Category labels are assigned by the clearly identifiable topic sequences in the source.

The original source is also available to visitors at `/Questions_and_Answers_Remote_Sensing_GIS_FULL_WORDS.pdf` through the download link. The website never reads it at runtime; search uses the bundled TypeScript data only.

Run `npm run validate` to check IDs, empty fields, option-letter answers, and exact duplicate Q&A records.

## Share a question

Open a question and its URL updates to `?question=ID`. Sharing that link automatically opens the matching question.
