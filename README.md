# Smart Finance Manager

![Smart Finance Manager Banner](https://via.placeholder.com/1200x400.png?text=Smart+Finance+Manager)

A modern web application to manage your finances by uploading receipts, tracking budgets, and creating shopping lists. Built with React, TypeScript, Supabase, and Tesseract.js for OCR functionality.

## ✨ Features

- **Receipt Uploading & OCR**: Upload receipt images, extract data (like total amount) using Tesseract.js, and store them in a database.
- **Multi-language Support**: Supports Dutch and English receipts with automatic language detection and translation using Google Translate API.
- **Budget Tracking**: Set and manage budgets for different categories.
- **Shopping Lists**: Create and manage shopping lists with items, quantities, and completion status.
- **Financial Insights**: Visualize your spending patterns (coming soon!).
- **Secure Authentication**: User authentication powered by Supabase Auth.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL)
- **OCR**: Tesseract.js for extracting text from receipt images
- **Translation**: Google Translate API for language detection and translation
- **State Management**: Zustand
- **File Export**: XLSX for exporting data to Excel
- **Deployment**: GitHub Pages (or your preferred platform)

## 📸 Screenshots

### Receipt Uploading
![Receipt Uploading](https://via.placeholder.com/600x400.png?text=Receipt+Uploading)

### Budget Tracking
![Budget Tracking](https://via.placeholder.com/600x400.png?text=Budget+Tracking)

### Shopping Lists
![Shopping Lists](https://via.placeholder.com/600x400.png?text=Shopping+Lists)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or Yarn
- A Supabase account and project
- Google Cloud account for Translate API

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/4Min4m/BudgeTrack.git
   cd smart-finance-manager
   Install dependencies:
bash

npm install
# or
yarn install

Set up environment variables:
Create a .env file in the root directory and add the following:

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key

Run the development server:
bash

npm run dev
# or
yarn dev

Open http://localhost:5173 in your browser to see the app.

Database Setup
Create the necessary tables in Supabase:
Run the following SQL scripts in the Supabase SQL Editor to set up the tables:
sql

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE receipts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  date TIMESTAMP NOT NULL,
  total DECIMAL NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  category TEXT NOT NULL,
  budget_limit DECIMAL NOT NULL,
  period TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shopping_items (
  id UUID PRIMARY KEY,
  list_id UUID REFERENCES shopping_lists(id),
  name TEXT NOT NULL,
  quantity DECIMAL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE receipt_items (
  id UUID PRIMARY KEY,
  receipt_id UUID REFERENCES receipts(id),
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quantity DECIMAL,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

Set up a trigger for profiles:
This ensures a profile is created for each new user:
sql

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

 Usage
Sign Up / Log In: Use your email to sign up or log in via Supabase Auth.

Upload a Receipt: Drag and drop a receipt image or click to upload. The app will extract the total amount and store the receipt.

Manage Budgets: Add budgets for different categories and track your spending.

Create Shopping Lists: Add items to your shopping lists and mark them as completed.

 Contributing
Contributions are welcome! Please follow these steps:
Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Make your changes and commit (git commit -m "Add your feature").

Push to the branch (git push origin feature/your-feature).

Open a Pull Request.

 License
This project is licensed under the MIT License - see the LICENSE file for details.
 Contact
For any questions or feedback, feel free to reach out:
Email: m.a.amini2011@gmail.com

GitHub: 4Min4m

Happy budgeting! 