# Expense Tracker 💸

A lightweight, modern, and private expense tracker built with pure HTML, Tailwind CSS, and vanilla JavaScript. No frameworks, build steps, or backend servers required—just double-click `index.html` and track your spending directly in your browser.

---

## Key Features

* **Quick Expense Logging**: Add expenses with an item name, amount, and custom category in seconds.
* **Monthly Budget Tracking & Smart Alerts**:
  * Set your monthly budget goal directly from the interface.
  * Live visual progress bar showing your spent vs. remaining budget.
  * Automated threshold warnings: **Caution banner** at 80% usage and **Alert banner** when budget is exceeded.
* **Visual Category Breakdown**: Real-time segmented progress bar and legend showing proportional spending across all categories.
* **Instant Category Filtering**: Filter your transactions by category (Food, Transport, Utilities, Entertainment, Other) with dynamic category-specific totals.
* **Multi-Currency Support**: Switch between **₹ INR**, **$ USD**, **€ EUR**, and **£ GBP** on the fly.
* **Dark Mode Toggle**: Sleek dark and light themes with smooth color transitions and persistent state.
* **100% Offline & Private**: All data is stored locally in your browser's `localStorage`—no cookies, tracking, or cloud servers.
* **One-Click CSV Export**: Download your entire expense log formatted for Microsoft Excel, Google Sheets, or Apple Numbers.
* **Safe Reset Confirmation**: In-page confirmation modal to protect against accidental data loss when clearing expenses.

---

## Project Structure

The project follows a clean separation of concerns:

```text
expense-tracker/
├── index.html       # Semantic HTML layout, form controls, and modals
├── styles.css       # Custom scrollbars, font definitions, and transition rules
├── app.js           # Application state, budget calculations, and DOM rendering
└── README.md        # Documentation and setup instructions
```

---

## Getting Started

### Prerequisites

You only need a modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari, or Brave). No Node.js or server installation is required.

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Open the application**:
   * Simply double-click `index.html` or right-click and choose **Open With > Google Chrome** (or your preferred browser).
   * Alternatively, if using VS Code, use the **Live Server** extension.

---

## How It Works

### 1. State Management
All application state (expenses array, selected category filter, active currency, monthly budget, and theme preference) is managed in `app.js` and synchronized with browser `localStorage`.

| Storage Key | Type | Description |
| :--- | :--- | :--- |
| `my_expenses_data` | JSON String | Array of expense objects: `{ id, name, amount, category }` |
| `my_expenses_currency` | String | Active currency symbol (`₹`, `$`, `€`, `£`) |
| `my_expenses_budget` | Number | User-configured monthly budget threshold |
| `my_expenses_theme` | String | Active theme setting (`dark` or `light`) |

### 2. Budget Alert Logic
```javascript
const budgetPercentage = (overallTotal / monthlyBudget) * 100;

if (budgetPercentage >= 100) {
  // Over-budget alert banner and rose-colored progress bar
} else if (budgetPercentage >= 80) {
  // Caution warning banner and amber-colored progress bar
} else {
  // Standard indigo progress bar
}
```

### 3. Client-Side CSV Export
The CSV exporter constructs a RFC-4180 compliant CSV string in memory and leverages the HTML5 `Blob` and `URL.createObjectURL` APIs to trigger a client-side file download without any backend dependencies.

---

## Built With

* **HTML5**: Semantic tags (`<main>`, `<header>`, `<section>`, `<footer>`, `<form>`).
* **Tailwind CSS v3.4**: Utility-first CSS framework loaded via CDN.
* **Vanilla JavaScript (ES6+)**: Clean, modern JavaScript utilizing array methods (`.reduce()`, `.filter()`, `.map()`).
* **Inter Font**: Google Web Fonts integration for modern typography.

---

## Roadmap

* [ ] Custom user-created categories and icon pickers
* [ ] Date-range filters (Weekly, Monthly, Custom)
* [ ] Interactive historical spending charts using Chart.js
* [ ] Progressive Web App (PWA) support for mobile home screen installation

---

## License

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).
