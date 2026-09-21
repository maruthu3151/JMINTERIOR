# JM INTERIOR — Premium Interior Design & Custom Woodwork
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
