
import { DailyFoodLog } from "@/components/food/DailyFoodLog";
import { FoodDatabaseAdmin } from "@/components/food/FoodDatabaseAdmin";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, UtensilsCrossed, Database } from "lucide-react";

const FoodPage = () => {
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Food Tracking</h1>
      
      <Tabs defaultValue="log" className="mb-6">
        <TabsList>
          <TabsTrigger value="log">Food Log</TabsTrigger>
          <TabsTrigger value="recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="admin">Database Admin</TabsTrigger>
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
        
        <TabsContent value="admin">
          <FoodDatabaseAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodPage;
