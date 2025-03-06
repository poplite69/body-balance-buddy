
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Check, Database, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  seedCoreNutritionData, 
  runFoodDatabaseMaintenance, 
  initializeFoodDatabase 
} from "@/services/food";

export function FoodDatabaseAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("seed");

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      const result = await seedCoreNutritionData();
      toast(result.success ? "Success" : "Error", {
        description: result.message,
      });
    } catch (error) {
      toast.error("Error seeding database", {
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunMaintenance = async () => {
    setIsLoading(true);
    try {
      const result = await runFoodDatabaseMaintenance();
      setReport(result.report);
      toast(result.success ? "Maintenance Complete" : "Maintenance Issues", {
        description: result.success 
          ? "Database maintenance completed successfully" 
          : "Some issues occurred during maintenance",
      });
    } catch (error) {
      toast.error("Error running maintenance", {
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await initializeFoodDatabase();
      toast.success("Database initialized", {
        description: "Food database has been initialized with seed data",
      });
    } catch (error) {
      toast.error("Error initializing database", {
        description: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Food Database Management
        </CardTitle>
        <CardDescription>
          Manage the food database, run maintenance tasks, and seed data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="seed">Database Seeding</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="seed">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Seeding the database</AlertTitle>
                <AlertDescription>
                  This will add core nutrition data to your food database. This is normally done once
                  when setting up the system.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleSeedDatabase} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Seeding Database...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Seed Core Nutrition Data
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleInitialize} 
                  variant="outline" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Initialize Database
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Maintenance</AlertTitle>
                <AlertDescription>
                  Runs maintenance tasks like cleaning orphaned records and updating usage statistics.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleRunMaintenance} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Maintenance...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Maintenance Tasks
                  </>
                )}
              </Button>
              
              {report && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Maintenance Report:</h3>
                  <pre className="text-sm whitespace-pre-wrap">{report}</pre>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Database Health</span>
                    <span className="text-sm text-muted-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Total Food Items</div>
                    <div className="text-2xl font-bold">1,245</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Core Items</div>
                    <div className="text-2xl font-bold">743</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">User Created</div>
                    <div className="text-2xl font-bold">312</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">API Cached</div>
                    <div className="text-2xl font-bold">190</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Data Usage</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>• Most searched: "Chicken breast" (423 searches)</p>
                    <p>• Least used category: "Beverages" (12% of total)</p>
                    <p>• 89 items unused in last 90 days</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button variant="ghost" onClick={() => setActiveTab(activeTab === "seed" ? "maintenance" : activeTab === "maintenance" ? "stats" : "seed")}>
          Next Tab
        </Button>
      </CardFooter>
    </Card>
  );
}
