# Split Expense

A simple expense tracker app to split expenses among friends. No user accounts required - all data is stored locally in your browser using localStorage.

## Features

- **Manual Expense Input**
  - Expense Type: Dropdown with categories (default: "Miscellaneous")
  - Total Amount: User inputs the total paid
  - Participants: Checkboxes (up to 10 people)
  - Payer: Dropdown to select who paid
  - Date: Date picker
  - Description: Free-text field

- **Expense Splitting Logic**
  - Split expenses equally among selected participants
  - Automatically calculates who owes whom

- **Debt Summary**
  - View individual balances
  - Settlement summary showing simplified debts

- **Responsive Design**
  - Mobile-first approach
  - Works on both web and mobile devices

- **Local Storage**
  - All data stored locally in your browser
  - No user accounts required

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- React 19
- Vite
- TailwindCSS
- localStorage for data persistence
