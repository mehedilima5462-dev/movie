# MovieHub BD - Modern Movie Discovery & Authorized Streaming Platform

MovieHub BD is a modern, premium, fully responsive movie discovery and authorized streaming platform inspired by Bangladeshi cinema catalog UX patterns. It provides multi-resolution bitrates (480P, 720P, 1080P, 4K), rich metadata, responsive horizontal carousels, full search & multi-attribute filtering, favorites, watch history, and a protected administration console.

> **Legal & Copyright Notice:** This platform supports only authorized, publisher-licensed, creator-authorized, or public-domain titles. It does not provide or link to pirated media, unauthorized torrents, or DRM bypass tools.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Firebase Setup](#2-firebase-setup)
3. [Environment Variables](#3-environment-variables)
4. [Firestore Collections](#4-firestore-collections)
5. [Firebase Security Rules](#5-firebase-security-rules)
6. [Admin Setup](#6-admin-setup)
7. [Local Development](#7-local-development)
8. [Production Build](#8-production-build)
9. [Hosting.com Shared Hosting Deployment](#9-hostingcom-shared-hosting-deployment)
10. [Troubleshooting & FAQs](#10-troubleshooting--faqs)
11. [Advertisement Management System](#11-advertisement-management-system)

---

## 1. Project Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
Clone or open the project folder in your terminal, then install dependencies:

```bash
npm install
```

---

## 2. Firebase Setup

MovieHub BD uses **Firebase Authentication** and **Cloud Firestore** for cloud storage, while providing an offline/local-storage fallback mode so the application runs immediately even before cloud credentials are added.

### Steps to configure Firebase:
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Create a project** (e.g. `moviehub-bd`).
3. Enable **Authentication**:
   - Go to **Build** > **Authentication** > **Sign-in method**.
   - Enable **Email/Password**.
   - (Optional) Enable **Google**.
4. Enable **Firestore Database**:
   - Go to **Build** > **Firestore Database** > **Create database**.
   - Start in Production mode or test mode.
5. In **Project settings** > **General**, scroll down to **Your apps**, click the Web icon (`</>`), and register a Web App.
6. Copy the Firebase configuration parameters into your `.env` file (see below).

---

## 3. Environment Variables

Create a `.env` file in the root of the project (refer to `.env.example`):

```bash
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="moviehub-bd.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="moviehub-bd"
VITE_FIREBASE_STORAGE_BUCKET="moviehub-bd.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef..."

# Custom site URL for canonical SEO
VITE_SITE_URL="https://moviehubbd.com"
```

*Note: Vite embeds variables starting with `VITE_` into the static frontend bundle at build time.*

---

## 4. Firestore Collections

The database is structured into the following collections:

| Collection | Description | Document Example Fields |
|---|---|---|
| `movies` | Published and draft titles | `title, slug, posterUrl, backdropUrl, trailerUrl, description, releaseYear, language, country, duration, genres, director, cast, rating, featured, trending, status, qualities, views, createdAt, updatedAt` |
| `users` | User profile records and roles | `uid, email, displayName, role ('user' \| 'admin'), createdAt` |
| `favorites` | User saved favorite titles | `id, userId, movieId, movieTitle, posterUrl, releaseYear, rating, language, addedAt` |
| `watchHistory` | User stream and watch records | `id, userId, movieId, movieTitle, posterUrl, quality, progressPercentage, timestamp` |
| `genres` | Active movie categories | `id, name, slug` |
| `languages` | Supported spoken languages | `id, name, slug` |
| `settings` | Platform metadata | `platformName, contactEmail, bannerAnnouncement` |

---

## 5. Firebase Security Rules

Deploy the included `firestore.rules` file to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }
    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.role == 'admin' ||
        request.auth.token.email == 'admin@moviehubbd.com' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }

    match /movies/{movieId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow create, update, delete: if isAdmin();
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['views']);
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if (isOwner(userId) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) || isAdmin();
      allow delete: if isAdmin();
    }

    match /favorites/{favoriteId} {
      allow read, write: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid);
    }

    match /watchHistory/{historyId} {
      allow read, write: if isAuthenticated() && (resource == null || resource.data.userId == request.auth.uid);
    }
  }
}
```

---

## 6. Admin Setup

### Designating an Admin:
1. In Firestore, create or edit a document in the `users` collection matching the user's `uid`, setting `"role": "admin"`.
2. Any user authenticated with `admin@moviehubbd.com` is granted administrative access by default.
3. For immediate local testing, you can click **"Toggle Admin Demo"** directly in the top right user menu or admin login prompt to test adding, editing, and deleting movies.

---

## 7. Local Development

Run the Vite development server on port 3000:

```bash
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 8. Production Build

To generate the production-ready static assets:

```bash
npm run build
```

This compiles all React components, Tailwind CSS styles, and public assets into the `dist/` folder.

---

## 9. Hosting.com Shared Hosting Deployment

MovieHub BD compiles to pure static HTML, JavaScript, and CSS. It **does NOT require Node.js** to run continuously on your production server.

### Deployment Instructions:
1. Run `npm install` and ensure your `.env` variables are configured.
2. Run `npm run build`.
3. Locate the generated `dist/` directory.
4. Verify that `dist/.htaccess` is present (it is automatically copied from `public/.htaccess`).
5. Open your Hosting.com cPanel **File Manager** (or connect via SFTP/FileZilla).
6. Navigate to `public_html/`.
7. Upload the **contents** of `dist/` directly into `public_html/`.
8. Ensure `.htaccess` is uploaded (enable "Show Hidden Files" in cPanel File Manager).

### The `.htaccess` SPA Rewrite Rule:
```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```
This ensures refreshing deep routes like `/movie/dhaka-noir-crimson-rain` or `/category/bangla` loads `index.html` instead of a server 404 error.

---

## 10. Troubleshooting & FAQs

### Q: Why do I get a 404 error when refreshing a movie details page on Hosting.com?
**A:** Ensure your `.htaccess` file was uploaded to `public_html/`. In cPanel File Manager, click **Settings** (top right) and check **"Show Hidden Files (dotfiles)"**.

### Q: Can the site work without setting up Firebase immediately?
**A:** Yes. The application includes a self-healing fallback layer. It loads 20+ seed movies, stores user changes in local browser storage, and allows full test drive of the admin panel. When you add Firebase credentials, it syncs seamlessly with Firestore.

### Q: How do I seed the database with initial demo movies?
**A:** Navigate to `/admin` and click **"Seed / Reset Data"**. It will write the 20 pre-configured fictional titles with 480P, 720P, 1080P, and 4K stream qualities.

---

## 11. Advertisement Management System

MovieHub BD includes a built-in, administrator-controlled advertising engine (`/admin/ads`).

### Features:
- **Campaign Controls**: Create, edit, delete, and enable/disable advertisements.
- **Analytics & CTR**: Live verified tracking of impressions, clicks, and CTR calculation (`(clicks / impressions) * 100`).
- **Device Targeting**: Target `all`, `desktop`, or `mobile` devices specifically.
- **Scheduling & Caps**: Set start dates, expiration end dates, and impression ceilings.
- **Responsive Placements**:
  - `homepage_top` (728×90 / 970×250)
  - `homepage_between` (970×250 / 728×90)
  - `homepage_bottom` (728×90 / 300×250)
  - `details_below_info` (Native Card)
  - `details_before_watch` (728×90 / 970×250)
  - `details_below_trailer` (728×90 / 300×250)
  - `details_bottom` (728×90)
  - `category_top` (728×90 / 970×250)
  - `watch_interstitial` (Watch Flow Countdown Modal)
- **Watch Flow Interstitial**:
  - When users initiate an authorized stream, an interstitial displays a short 5-second countdown with sponsor presentation and a "Continue to Stream" button that safely routes to the authorized video player.
  - If no ad is active for the placement, the component collapses completely with **zero empty space**.

