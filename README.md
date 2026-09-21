# JM INTERIOR — Premium Interior Design & Custom Woodwork

A complete, production-ready website built from scratch for **JM INTERIOR** (Chennai, Tamil Nadu, India; Directed by Master Craftsman **K. Selvam**).

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, and backed by **Google Firebase** (Firebase Authentication, Cloud Firestore, Firebase Storage) and configured for **Vercel** deployment.

---

## 🌟 Key Features

* **Global Real-Time CMS**: Content edits (projects, services, gallery, timber catalog, logo, phone, WhatsApp) made in `/admin` persist directly to Firebase Cloud Firestore and appear immediately for visitors on any device.
* **Firebase Cloud Storage**: Cover photos, gallery items, and website logos are uploaded directly to Firebase Storage with automatic size/type validation. Zero images stored in GitHub.
* **Discreet Admin Access**: Public visitors browse a clean portfolio. Admin logs in via `/admin/login` using **Username** and **Password** (`SELVAM` / `SELVAM@7401279764`).
* **Complete Admin Modules (Full CRUD)**:
  * **Projects Portfolio**: Create, edit, delete, publish/draft, mark featured, upload cover & gallery photos, before/after slider photos, materials, budget, and slug generation.
  * **Visual Gallery**: Photo uploads, category filtering, title, and lightbox full-screen view.
  * **Services**: Comprehensive service list with bullet deliverables, starting estimates, and order management.
  * **Materials Catalog**: Authentic wood & ply specs (BWP marine ply, natural veneers, acrylics, solid teak).
  * **Appointments System**: Review booking inquiries, update status (`pending`, `approved`, `completed`, `rejected`), and maintain private staff notes.
  * **Client Inquiries**: View contact messages, mark read/contacted, and reply via WhatsApp.
  * **Reviews / Testimonials**: Manage client ratings and reviews.
  * **Website Site Settings**: Live branding (PNG logo upload), company details, hero section text, about story, and contact numbers.
  * **Admin Security**: Change username or update password safely through Firebase Auth without editing code.
* **Interactive UI**:
  * Smooth touch-friendly **Before / After** comparison slider.
  * Full-screen **Lightbox** with keyboard arrow controls (`←`, `→`, `ESC`).
  * Instant **Floating WhatsApp** direct messaging for Chennai clients.
  * Responsive mobile drawer navigation.

---

## 🛠 Main Technology Stack

* **Frontend**: React 19, TypeScript, Vite, React Router DOM, Tailwind CSS, Framer Motion, Lucide React
* **Backend & Cloud Storage**: Google Firebase Modular SDK v10 (Authentication, Cloud Firestore, Cloud Storage)
* **Version Control**: Git & GitHub
* **Deployment Target**: Vercel (`vercel.json` SPA routing configured)

---

## 🚀 Quick Start Guide

### 1. Installation
In Windows PowerShell (or your terminal):
```powershell
npm.cmd install
```

### 2. Configure Firebase
Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```
*(For complete step-by-step setup instructions, please read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)).*

### 3. Run Locally in Development Mode
```powershell
npm.cmd run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```powershell
npm.cmd run build
```

---

## 🔐 Administrative Access

* **Login URL**: `/admin/login`
* **Initial Username**: `SELVAM`
* **Initial Password**: `SELVAM@7401279764`

### How to Change Admin Credentials
1. Log in to the Admin Dashboard.
2. Click **Admin Security** in the sidebar.
3. Update your Username or Password. The changes take effect immediately across Firebase.

---

## 🌐 Vercel Deployment

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New** > **Project** and import your GitHub repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add the 6 `VITE_FIREBASE_*` keys.
5. Click **Deploy**.
6. The included `vercel.json` file ensures that direct URLs (`/projects`, `/about`, `/admin`, etc.) work seamlessly without 404 errors.

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg          # Custom JM monogram icon
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminLayout.tsx    # Protected admin layout with sidebar
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Responsive header with dynamic logo
│   │   │   ├── Footer.tsx         # Responsive footer with contact info
│   │   │   └── PublicLayout.tsx   # Public wrapper with WhatsApp button
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── ImageUploader.tsx  # Universal Firebase Storage uploader
│   │       ├── BeforeAfterSlider.tsx # Interactive comparison slider
│   │       ├── Lightbox.tsx       # Fullscreen photo viewer
│   │       ├── Skeleton.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx  # Prevents blank screen crashes
│   ├── context/
│   │   ├── AuthContext.tsx        # Firebase session & admin profile
│   │   ├── SettingsContext.tsx    # Live site settings provider
│   │   └── ToastContext.tsx       # Animated toast notifications
│   ├── lib/
│   │   └── firebase.ts            # Central Firebase modular client
│   ├── pages/
│   │   ├── admin/                 # All 10 admin management views
│   │   └── public/                # All 9 public website pages
│   ├── services/                  # Modular data layer for Firestore & Storage
│   ├── types/                     # TypeScript data interfaces
│   ├── utils/
│   │   ├── defaults.ts            # Fallbacks and realistic Chennai data
│   │   └── initAdmin.ts           # First-time admin setup utility
│   ├── App.tsx                    # Top-level routing
│   ├── main.tsx
│   └── index.css                  # Tailwind styles and custom typography
├── firestore.rules                # Production Firestore security rules
├── storage.rules                  # Production Cloud Storage security rules
├── vercel.json                    # SPA routing rewrite configuration
├── FIREBASE_SETUP.md              # Beginner's Firebase guide
└── README.md
```

---

## 🛡 Security Rules

* Public visitors can read published projects, gallery photos, services, materials, reviews, and site settings.
* Public visitors can submit contact inquiries (`/messages`) and consultation bookings (`/appointments`).
* Only authenticated administrators can create, update, or delete content, or upload media to Firebase Storage.
