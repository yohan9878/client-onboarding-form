# Client Onboarding Form [ Next.js + RHF + Zod ]

## Setup

npm install
npm run dev

## Test

npm run test

## env

NEXT_PUBLIC_ONBOARD_URL=https://example.com/api/onboard

## Onboarding Form with React Hook Form & Zod

I developed a type-safe onboarding form using Next.js, React Hook Form (RHF), and Zod. The form collects user details such as full name, email, company name, services of interest, budget, project start date, and terms acceptance.

* Validation is handled with Zod schemas, ensuring strong runtime validation and type safety.

* React Hook Form efficiently manages form state, validation errors, and submission.

* Integrated zodResolver to connect Zod validation directly into RHF.

* Implemented service selection with checkboxes using type-safe enums.

* Added real-time preview panel to display submitted form data.

* Included URL param pre-fill logic (e.g., pre-selecting a service from query string).

* Form submission sends data to a backend API (NEXT_PUBLIC_ONBOARD_URL) with proper error  handling.
