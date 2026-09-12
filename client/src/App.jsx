import Dashboard from "./components/Dashboard/Dashboard";
import { ToastProvider } from "./components/ui/Toast";

const App = () => {
  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-background text-text-primary selection:bg-brand-subtle selection:text-brand-focus">
        <Dashboard />
      </div>
    </ToastProvider>
  );
};

export default App;