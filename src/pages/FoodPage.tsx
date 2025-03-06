
import { DailyFoodLog } from "@/components/food/DailyFoodLog";

const FoodPage = () => {
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Food Tracking</h1>
      <DailyFoodLog />
    </div>
  );
};

export default FoodPage;
