# src/lib — Utilities and API Client

## Structure
- `api/client.ts` — fetch wrapper. Handles auth headers, response envelope unwrapping, error normalization.
- `api/types.ts` — ApiResponse<T>, ApiError, PaginatedResponse<T> types
- `utils/` — Pure utility functions (date formatting, cn() class merger, etc.)
- `validators/` — Zod schemas for form validation

## API Client Rules
- All requests go through client.ts — never raw fetch in components or hooks
- Access token comes from auth store — never from localStorage
- Error responses always throw with machine-readable error code
- organizationId is NOT sent from client — backend derives from session

## Environment Variables
- `NEXT_PUBLIC_API_URL` — backend base URL
- `NEXT_PUBLIC_WS_URL` — WebSocket URL
