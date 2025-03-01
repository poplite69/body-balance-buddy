
import { AlertCircle, ArrowRight, Brain, ChevronRight, Info, MessageSquare, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function AICoach() {
  const [messageValue, setMessageValue] = useState("");
  
  // Mock insights data
  const insights = [
    {
      id: '1',
      title: 'Recovery Optimization',
      description: 'Based on your recent training volume and sleep patterns, consider taking an extra rest day this week.',
      category: 'recovery',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Nutrition Insight',
      description: 'Your protein intake has been consistently below target. Try adding a protein shake after workouts.',
      category: 'nutrition',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Performance Pattern',
      description: 'You perform better in evening workouts compared to morning sessions based on your strength metrics.',
      category: 'performance',
      priority: 'low',
    },
  ];
  
  // Mock conversation data
  const conversation = [
    {
      role: 'user',
      content: 'How can I improve my squat form?'
    },
    {
      role: 'ai',
      content: 'Based on your workout history, I notice you might be struggling with depth in your squats. Here are some tips:\n\n1. Focus on ankle mobility\n2. Try box squats to ensure proper depth\n3. Film yourself to check form\n\nI can also analyze a video if you upload one next time.'
    },
    {
      role: 'user',
      content: 'What should I eat before my morning workout tomorrow?'
    },
    {
      role: 'ai',
      content: 'For your 7AM workout tomorrow, I recommend eating a light, carb-focused meal about 60-90 minutes before. Since you\'ve reported feeling better with some food in your system, try:\n\n• A banana with 1 tbsp of almond butter\n• Half a bagel with a thin spread of cream cheese\n• A small bowl of oatmeal with berries\n\nThese options provide quick energy without causing digestive discomfort during your workout.'
    },
  ];
  
  // Get icon for insight category
  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Zap className="h-4 w-4" /></div>;
      case 'recovery':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Brain className="h-4 w-4" /></div>;
      case 'performance':
        return <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Sparkles className="h-4 w-4" /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-grip-blue-light flex items-center justify-center text-grip-blue"><Info className="h-4 w-4" /></div>;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className={cn("grip-section", fadeIn())}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-grip-neutral-800">AI Coach</h1>
            <p className="text-grip-neutral-500 mt-1">Personalized insights and recommendations</p>
          </div>
        </div>
      </section>
      
      {/* Insights */}
      <section className={cn("grip-section", fadeIn(0.1))}>
        <h2 className="text-xl font-bold text-grip-neutral-700 mb-4">Personalized Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <Card key={insight.id} className={cn(
              "grip-card overflow-hidden",
              insight.priority === 'high' 
                ? 'border-l-4 border-l-red-400' 
                : insight.priority === 'medium'
                  ? 'border-l-4 border-l-amber-400'
                  : 'border-l-4 border-l-green-400'
            )}>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  {getInsightIcon(insight.category)}
                  <div className="flex-1">
                    <h3 className="font-medium text-grip-neutral-700 mb-1">{insight.title}</h3>
                    <p className="text-sm text-grip-neutral-600 mb-3">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-grip-neutral-500 capitalize">
                        {insight.category} • {insight.priority} priority
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 text-grip-blue hover:text-grip-blue-dark hover:bg-grip-blue-light/50">
                        Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Progress connections */}
      <section className={cn("grip-section", fadeIn(0.2))}>
        <Card className="grip-card relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-grip-blue/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-grip-blue/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-80 backdrop-blur-sm shadow-sm">
                <AlertCircle className="h-8 w-8 text-grip-blue" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-grip-neutral-700 mb-1">Cross-Data Insight Discovered</h3>
                <p className="text-grip-neutral-600 mb-4">
                  I've noticed that your energy levels are 32% higher on days when you consume at least 
                  2,000 calories and get 7+ hours of sleep. This pattern is consistent across the last 3 weeks.
                </p>
                <Button className="grip-button">
                  View Detailed Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Coach chat */}
      <section className={cn("grip-section", fadeIn(0.3))}>
        <Card className="grip-card min-h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-grip-blue" />
              Chat with AI Coach
            </CardTitle>
            <CardDescription>Ask questions about your health, training, nutrition, or routines</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      message.role === 'user' 
                        ? "bg-grip-blue text-white rounded-tr-none" 
                        : "bg-grip-neutral-100 text-grip-neutral-700 rounded-tl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 pb-4">
            <div className="relative w-full">
              <textarea
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
                placeholder="Ask your AI coach something..."
                className="grip-input w-full py-3 pr-12 min-h-[60px] max-h-32 resize-none"
              />
              <Button 
                className="absolute right-2 bottom-2 w-8 h-8 p-0 rounded-full bg-grip-blue text-white hover:bg-grip-blue-dark"
                disabled={!messageValue.trim()}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
