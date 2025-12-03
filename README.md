# Split Expense

A simple expense tracker app to split expenses among friends. No user accounts required - all data is stored locally in your browser using localStorage.

## Features

- **Manual Expense Input**
  - Expense Type: Dropdown with categories (default: "Miscellaneous")
  - Total Amount: User inputs the total paid
  - Participants: Checkboxes (up to 10 people)
  - Payer: Select who paid (supports multiple payers)
  - Date: Date picker
  - Description: Free-text field

- **Multiple Payers Support**
  - Select multiple people who paid for an expense
  - Specify individual amounts for each payer
  - "Split evenly" button to divide payment equally among payers

  ![Multiple Payers](https://github.com/user-attachments/assets/75b9dbb8-b4eb-49d9-ab45-fb4d6c53e503)

- **Expense Splitting Logic**
  - Split expenses equally among selected participants
  - Automatically calculates who owes whom
  - Handles complex scenarios with multiple payers

  ![Expense List with Multiple Payers](https://github.com/user-attachments/assets/a681186a-c37a-43f1-b1f5-2627bd82918a)

- **Debt Summary with Settlement Transparency**
  - View individual balances (owes, owed, net)
  - Settlement summary showing simplified debts
  - Expandable breakdown showing which expenses contribute to each settlement
  - Mark settlements as paid with checkbox

  ![Settlements Transparency](https://github.com/user-attachments/assets/fe764713-f42a-4d2f-83f3-548a19ffe541)

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
