# DailyPay Nepal - Project Documentation

## 1. Project Overview
**DailyPay Nepal** is a modern **Earned Wage Access (EWA)** platform designed to revolutionize the payroll system in Nepal. It empowers employees to access their earned salary in real-time before the standard payday, providing financial freedom and reducing reliance on high-interest loans.

For organizations, it offers a streamlined dashboard to manage employee salary streams, monitor funding, and ensure compliance with automated auditing.

---

## 2. Technology Stack
The project is built using a robust, modern frontend stack designed for performance, scalability, and a premium user experience.

*   **Core Framework:** [React](https://react.dev/) (v18+)
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety and developer productivity.
*   **Build Tool:** [Vite](https://vitejs.dev/) for lightning-fast development and build capability.
*   **Styling:** **Vanilla CSS** with a custom Design System (Variables, Utility Classes). No external UI frameworks (like Bootstrap or Tailwind) were used, ensuring a unique, high-performance, and fully custom visual identity.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) for smooth, complex UI transitions.
*   **Icons:** [Lucide React](https://lucide.dev/) for consistent, crisp iconography.
*   **State Management:** React Context API (`AppContext`) for global state (User, Employees, Transactions).
*   **Routing:** React Router v6 for client-side navigation.

---

## 3. Architecture & Project Structure
The project follows a modular, component-based architecture.

```
d:/Dailypay Nepal/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.tsx      # Global header with adaptive mobile/desktop views
│   │   ├── Sidebar.tsx     # Main navigation sidebar
│   │   ├── BottomNav.tsx   # Mobile-specific bottom navigation
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   └── Modals/         # various modals (AddEmployee, Withdraw, etc.)
│   ├── context/
│   │   └── AppContext.tsx  # Global state (Mock Backend logic)
│   ├── pages/              # Main view components
│   │   ├── Dashboard.tsx   # Employee Home
│   │   ├── Wallet.tsx      # Employee Wallet
│   │   ├── OrgDashboard.tsx# Organization Home
│   │   ├── OrgEmployees.tsx# Employee Management
│   │   └── ...
│   ├── types/              # TypeScript interface definitions
│   ├── index.css           # Global styles and Design System variables
│   └── App.tsx             # Root component and Routing setup
└── package.json
```

---

## 4. Key Features & Modules

### A. Authentication & Roles
The app supports multi-role access via a unified Login portal:
1.  **Employee:** Access to personal earnings and wallet.
2.  **Organization (HR/Admin):** Management of staff and payroll funds.
3.  **Administrator (Regulator):** Oversight and compliance monitoring.

### B. Employee Portal
*   **Real-Time Salary Streaming:** Visualizes salary accruing second-by-second.
*   **Wallet System:** 
    *   View "Available Balance" (Sticky header for visibility).
    *   Transfer funds to Bank, eSewa, or Khalti.
    *   View transaction history.
*   **Salary Unlock:** Request access to locked salary portions (requires Org approval).

### C. Organization Portal
*   **Dashboard:** Overview of Total Loaded Balance, Distributed Amount, and active employees.
*   **Employee Management:** 
    *   **Add Employee:** Single entry or Bulk Import (CSV) capability.
    *   **View Details:** Search, filter, and view employee status.
*   **Payroll Control:** Monitor "Live Accrual" burn rate and manage funding account deposits.
*   **Communication:** Send announcements or notifications to employees.
*   **Approvals:** Review and Approve/Reject salary unlock requests.

### D. Mobile Responsiveness
The application adopts a **Mobile-First** design philosophy:
*   **Adaptive Navigation:** Swaps the Desktop Sidebar for a native-app-like **Bottom Navigation Bar** on mobile devices.
*   **Responsive Tables:** Horizontal scrolling for complex data tables on small screens.
*   **Touch-Optimized:** Larger touch targets (44px+) for buttons and inputs on mobile.

---

## 5. Design System
The UI is built on a custom "Dark Mode" aesthetic inspired by fintech and neobanks.

*   **Colors:**
    *   **Backgrounds:** Deep colors (`#0a0a0c`, `#13131f`) for reduced eye strain.
    *   **Primary:** Neon Blue (`#00d2ff`) for CTAs and active states.
    *   **Accents:** Success Green (`#00e676`), Warning Orange (`#ffb300`).
    *   **Glassmorphism:** Extensive use of `backdrop-filter: blur()` and semi-transparent whites/blacks for panels and overlays.
*   **Typography:** Modern sans-serif stack (Inter/System UI) with clear hierarchy (`h1` to `caption`).

---

## 6. Setup and Installation

1.  **Prerequisites:** Node.js (v16+) and npm/yarn.
2.  **Clone/Download** the repository.
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
5.  Access the app at `http://localhost:5173`.

---

## 7. Mock Data & Persistence
Currently, the application uses **Client-Side Persistence** via `localStorage`. 
*   **AppContext:** initializes mock data for Employees, Transactions, and Logs.
*   Changes (adding an employee, transferring funds) are saved to state and persist across page reloads within the same session context (and partial `localStorage` support).
*   **Note:** In a production environment, `AppContext` would be replaced by API calls to a secure backend (Node.js/Python).

