# Portfolio Admin API Contract

Base URL: `http://localhost:4000/api`

## Health
- `GET /health`
- Response: `{ status, service, timestamp }`

## Public APIs

### Create lead
- `POST /leads`
- Body:
  - `name` string (required)
  - `email` string (required)
  - `phoneNumber` string (required)
  - `company` string (optional)
  - `service` string (required)
  - `message` string (optional)
- Success `201`:
  - `{ message: "Thank you we will get back to you", lead: { id, submittedAt } }`
- Duplicate `409`:
  - `{ error: "Request Already Submitted" }`

### Track visit
- `POST /analytics/visit`
- Body: `{ route?: string }`
- Success `201`: `{ ok: true }`

## Admin Auth

### Login
- `POST /admin/login`
- Body:
  - `username` string
  - `password` string
- Success `200`:
  - `{ token, admin: { id, username, displayName } }`
- Error `401`:
  - `{ error: "Invalid username or password" }`

Use returned token as:
`Authorization: Bearer <token>`

## Admin APIs (JWT required)

### Analytics
- `GET /admin/analytics?mode=day|month&year=YYYY&month=1..12`
- Day mode returns bar data by day (selected month/year).
- Month mode returns bar data by month (selected year).
- Success:
  - `{ totals: { totalVisits, totalLeads }, charts: { visits: [{label,value}], leads: [{label,value}] } }`

### List leads
- `GET /leads?range=all|today|last_week|last_month&reviewed=all|reviewed|not_reviewed&year=YYYY&month=1..12`
- Success:
  - `{ totalLeads, filteredCount, leads: Lead[] }`

### Mark reviewed
- `PATCH /leads/:id/review`
- Success:
  - `{ message: "Lead marked as reviewed", lead: { id, isReviewed, reviewedAt } }`
