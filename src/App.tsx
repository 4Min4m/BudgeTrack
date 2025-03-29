import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Receipt, UploadCloud, PieChart, ShoppingCart } from 'lucide-react';
import { useStore } from './store/useStore';
import { Auth } from './components/Auth';
import ReceiptUploader from './components/ReceiptUploader';
import FinancialInsights from './components/FinancialInsights';
import ShoppingLists from './components/ShoppingLists';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState<'receipts' | 'insights' | 'shopping'>('receipts');
  const initializeUser = useStore((state) => state.initializeUser);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        initializeUser(session.user.id).catch((error) => {
          console.error('Error initializing user:', error);
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        initializeUser(session.user.id).catch((error) => {
          console.error('Error initializing user:', error);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [initializeUser]);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Smart Finance Manager</h1>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('receipts')}
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                activeTab === 'receipts'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Receipts
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                activeTab === 'insights'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PieChart className="w-5 h-5 mr-2" />
              Insights
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`flex items-center px-3 py-2 text-sm font-medium ${
                activeTab === 'shopping'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shopping Lists
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'receipts' && <ReceiptUploader />}
        {activeTab === 'insights' && <FinancialInsights />}
        {activeTab === 'shopping' && <ShoppingLists />}
      </main>
    </div>
  );
}

export default App;