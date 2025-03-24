
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-12">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
