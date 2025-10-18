<img src="https://readme-typing-svg.herokuapp.com?font=Lexend+Giga&size=25&pause=1000&color=6495ED&vCenter=true&width=435&height=25&lines=CRM%20Frontend" width="450"/>

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Status-Early%20Development-orange?style=for-the-badge" alt="Status" />
</p>

Modern frontend for CRM system built with Next.js 15, React 19, and TypeScript.

> **⚠️ Project Status**: Early development stage. UI components and features are being actively developed.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Turbopack** - Fast build tool



## Project Structure

```
app/
├── components/         # Reusable React components
├── login/             # Authentication pages
├── register/          # User registration
├── globals.css        # Global styles and CSS variables
└── layout.tsx         # Root layout component
```

## API Integration

Connects to CRM Backend API:
- `POST /api/user/login` - User authentication
- `POST /api/user/register` - User registration

Backend runs on `http://localhost:5555`


## License

This project is licensed under the MIT License.