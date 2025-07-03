# Group Links

A modern, full-stack group chat application for sharing, discovering, and discussing links in real time.

## Features
- **Group Chat:** Real-time messaging in public or private groups
- **Admin-Only Chat:** Restrict chat to group admins
- **Link Previews:** Automatic rich previews for shared links (Open Graph)
- **Join/Create/Delete Groups:** Users can join, create, and delete groups
- **Modern UI:** Responsive, mobile-friendly, and visually appealing (Tailwind CSS)
- **User Authentication:** Secure login and registration
- **Message Deletion:** Only message owner or admin can delete messages
- **Search & Filter:** Quickly find your groups
- **Sidebar Navigation:** Easy access to all features

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io
- **Other:** Open Graph Scraper for link previews

## Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- pnpm (or npm/yarn)

### Backend
```bash
cd backend
pnpm install
# Set up your .env with MONGO_URI and allowed origins
pnpm start
```

### Frontend
```bash
cd frontend
pnpm install
# Set up your .env with VITE_API_URL (e.g. http://localhost:5000)
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to use the app.

## Maintainers
- [Prakash Dass R](https://www.rprakashdass.in)
- [Siranjeevi K](https://siranjeevik.vercel.app)

---

For more details, see the code and comments, or contact the maintainers via their portfolios above.