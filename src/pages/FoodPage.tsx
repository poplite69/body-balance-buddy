
import { DailyFoodLog } from "@/components/food/DailyFoodLog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FoodPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Food Tracking</h1>
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/database')}
          >
            Database Admin
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="log" className="mb-6">
        <TabsList>
          <TabsTrigger value="log">Food Log</TabsTrigger>
          <TabsTrigger value="recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="log">
          <DailyFoodLog />
        </TabsContent>
        
        <TabsContent value="recipes">
          <div className="text-center py-12 text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Recipes Yet</h3>
            <p>Create your first recipe to see it here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="text-center py-12 text-muted-foreground">
            <PlusCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Favorite Foods</h3>
            <p>Add foods to your favorites for quick access</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodPage;
