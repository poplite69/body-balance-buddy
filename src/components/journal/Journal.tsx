
import { CalendarDays, Clock, Menu, PenLine, Plus, Search, Smile, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeIn } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Journal() {
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  
  // Mock journal data
  const recentEntries = [
    {
      id: '1',
      date: 'Today, 9:30 AM',
      content: 'Feeling great after yesterday\'s workout. Energy levels are high and I slept really well. Ready to tackle the day and looking forward to my evening run.',
      mood: 'great',
      tags: ['workout', 'sleep', 'energy']
    },
    {
      id: '2',
      date: 'Yesterday, 8:45 PM',
      content: 'Hit a new PR on squats today! Really proud of my progress over the last month. My nutrition has been on point and it\'s paying off in my training.',
      mood: 'great',
      tags: ['PR', 'strength', 'progress']
    },
    {
      id: '3',
      date: '2 days ago, 10:15 PM',
      content: 'Feeling a bit low on energy today. Might be due to poor sleep the last couple of nights. Need to prioritize my sleep schedule and maybe take it easier on tomorrow\'s workout.',
      mood: 'bad',
      tags: ['sleep', 'recovery', 'fatigue']
    }
  ];
  
  // Render mood icon based on mood string
  const renderMoodIcon = (mood: string) => {
    const moodStyles = {
      great: "text-green-500",
      good: "text-emerald-400",
      neutral: "text-amber-400",
      bad: "text-orange-500",
      terrible: "text-red-500"
    };
    
    return (
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        mood === 'great' ? "bg-green-100" : 
        mood === 'good' ? "bg-emerald-100" : 
        mood === 'neutral' ? "bg-amber-100" :
        mood === 'bad' ? "bg-orange-100" : "bg-red-100"
      )}>
        <Smile className={cn("h-5 w-5", moodStyles[mood as keyof typeof moodStyles])} />
      </div>
    );
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className={cn("grip-section", fadeIn())}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-grip-neutral-800">Journal</h1>
            <p className="text-grip-neutral-500 mt-1">Track your thoughts, moods, and reflections</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="grip-button-ghost">
              <CalendarDays className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button className="grip-button" onClick={() => setNewEntryOpen(!newEntryOpen)}>
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </div>
        </div>
      </section>
      
      {/* New journal entry (conditionally rendered) */}
      {newEntryOpen && (
        <section className={cn("grip-section", fadeIn(0.1))}>
          <Card className="grip-card border-2 border-grip-blue/20">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <PenLine className="h-5 w-5 mr-2 text-grip-blue" />
                New Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-grip-neutral-500 mr-2" />
                    <span className="text-sm text-grip-neutral-600">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Smile className="h-4 w-4 text-grip-neutral-500 mr-2" />
                    <select className="grip-input text-sm h-8 bg-grip-neutral-50/80">
                      <option value="great">Feeling Great</option>
                      <option value="good">Feeling Good</option>
                      <option value="neutral">Feeling Neutral</option>
                      <option value="bad">Feeling Bad</option>
                      <option value="terrible">Feeling Terrible</option>
                    </select>
                  </div>
                </div>
                
                <textarea
                  placeholder="Write your thoughts here..."
                  className="grip-input w-full h-48 resize-none"
                ></textarea>
                
                <div>
                  <label className="flex items-center text-sm font-medium text-grip-neutral-700 mb-2">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. workout, nutrition, mood (separate with commas)"
                    className="grip-input w-full"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" className="grip-button-ghost" onClick={() => setNewEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="grip-button">
                    Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
      
      {/* Journal entries */}
      <section className={cn("grip-section", fadeIn(0.2))}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-grip-neutral-700">Recent Entries</h2>
          
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-grip-neutral-400" />
            <input
              type="text"
              placeholder="Search entries..."
              className="grip-input pl-9 h-9 text-sm bg-grip-neutral-50/80"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {recentEntries.map((entry) => (
            <Card key={entry.id} className="grip-card hover:shadow-md transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {renderMoodIcon(entry.mood)}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-grip-neutral-700">{entry.date}</h3>
                      <Button variant="ghost" size="sm" className="h-8 text-grip-neutral-500">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-grip-neutral-600 mb-3">
                      {entry.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <div 
                          key={tagIndex} 
                          className="text-xs bg-grip-neutral-100 text-grip-neutral-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button
            variant="outline" 
            className="w-full border-dashed border-grip-neutral-200 hover:border-grip-blue/30 py-6 h-auto"
            onClick={() => setNewEntryOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Write a new entry
          </Button>
        </div>
      </section>
      
      {/* Mood trends */}
      <section className={cn("grip-section", fadeIn(0.3))}>
        <Card className="grip-card">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-7 gap-2 w-full max-w-md">
                  {Array.from({ length: 28 }).map((_, i) => {
                    // Generate random mood for demonstration
                    const moods = ['great', 'good', 'neutral', 'bad', 'terrible'];
                    const randomMood = moods[Math.floor(Math.random() * 5)];
                    const moodColors = {
                      great: "bg-green-400",
                      good: "bg-emerald-300",
                      neutral: "bg-amber-300",
                      bad: "bg-orange-300",
                      terrible: "bg-red-300",
                    };
                    
                    return (
                      <div 
                        key={i}
                        className={cn(
                          "w-full aspect-square rounded-md shadow-sm", 
                          moodColors[randomMood as keyof typeof moodColors],
                          i >= 25 && "opacity-40"
                        )}
                      />
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-green-400 mr-2"></div>
                  <span className="text-sm text-grip-neutral-600">Great</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-emerald-300 mr-2"></div>
                  <span className="text-sm text-grip-neutral-600">Good</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-amber-300 mr-2"></div>
                  <span className="text-sm text-grip-neutral-600">Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-orange-300 mr-2"></div>
                  <span className="text-sm text-grip-neutral-600">Bad</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-sm bg-red-300 mr-2"></div>
                  <span className="text-sm text-grip-neutral-600">Terrible</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
