
import { FoodDatabaseAdmin } from "@/components/food/FoodDatabaseAdmin";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DatabaseAdminPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Database Administration
        </h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back to App
        </Button>
      </div>
      
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
        <h2 className="text-lg font-medium mb-2">Admin Only Area</h2>
        <p>This area is restricted to administrators only. Future back office functionality will be built here.</p>
      </div>
      
      <FoodDatabaseAdmin />
    </div>
  );
};

export default DatabaseAdminPage;
