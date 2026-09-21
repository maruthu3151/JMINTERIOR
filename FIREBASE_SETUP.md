# JM INTERIOR — Firebase Setup Guide

Step-by-step instructions for setting up Google Firebase for **JM INTERIOR**. Written for beginners — no prior Firebase expertise required.

---

### Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter Project Name: `jm-interior` (or any name you choose).
4. (Optional) Disable Google Analytics or enable it if desired. Click **Create project**.
5. Once your project is ready, click **Continue**.

---

### Step 2: Register Web Application & Get Credentials
1. In the Project Overview page, click the **Web** icon (`</>`) to add an app.
2. Enter App nickname: `jm-interior-web`.
3. Check the box for Firebase Hosting (optional) or leave unchecked. Click **Register app**.
4. Firebase will show your configuration object containing:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. Keep these values handy. You will paste them into `.env` (locally) and into Vercel Environment Variables.

---

### Step 3: Enable Email/Password Authentication
1. In the Firebase console left sidebar, navigate to **Build** > **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable the first toggle: **Email/Password**. Leave Email link (passwordless) disabled.
5. Click **Save**.

---

### Step 4: Create Firestore Database
1. In the left sidebar, navigate to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose your database location: Select `asia-south1 (Mumbai)` for the fastest response in Chennai and India.
4. For Security rules, select **Start in production mode** (we will apply custom secure rules in Step 6).
5. Click **Create** / **Enable**.

---

### Step 5: Create Cloud Storage
1. In the left sidebar, navigate to **Build** > **Storage**.
2. Click **Get Started**.
3. Choose **Start in production mode**. Click **Next**.
4. Choose bucket location (e.g. `asia-south1`). Click **Done**.

---

### Step 6: Configure Security Rules

#### 6.1 Firestore Security Rules
1. In Firestore, click the **Rules** tab at the top.
2. Copy the entire contents of the `firestore.rules` file from this project and paste it into the editor.
3. Click **Publish**.

#### 6.2 Storage Security Rules
1. In Storage, click the **Rules** tab at the top.
2. Copy the entire contents of the `storage.rules` file from this project and paste it into the editor.
3. Click **Publish**.

---

### Step 7: Configure Environment Variables

#### For Local Development:
1. In your project root, create a file named `.env`:
```env
VITE_FIREBASE_API_KEY=your_apiKey_here
VITE_FIREBASE_AUTH_DOMAIN=your_projectId.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_projectId
VITE_FIREBASE_STORAGE_BUCKET=your_projectId.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messagingSenderId
VITE_FIREBASE_APP_ID=your_appId
```

#### For Vercel Production Deployment:
1. In your Vercel Project Settings > **Environment Variables**, add the exact same 6 keys above.

---

### Step 8: Initialize First Administrator & Site Data
1. Run the application locally with `npm.cmd run dev` (or visit your deployed Vercel URL).
2. Go to `/admin/login`.
3. Click the discreet link at the bottom: **"First-time Firebase project setup / Seed Admin"**.
4. Confirm the prompt. The app will:
   - Create the Firebase Auth account for `selvam@jminterior.in` with the password `SELVAM@7401279764`.
   - Seed `users/admin_profile` mapping username **`SELVAM`**.
   - Seed `siteSettings/global` with K. Selvam's details and Chennai business information.
5. Log in with:
   - **Username**: `SELVAM`
   - **Password**: `SELVAM@7401279764`

---

### Step 9: Change Credentials Anytime
1. Once logged into `/admin`, navigate to **Admin Security**.
2. You can update your Username or change your Password at any time without editing any source code or redeploying.
