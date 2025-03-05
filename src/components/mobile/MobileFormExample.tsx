
import React, { useState } from 'react';
import { MobileForm } from './MobileForm';
import { MobileInput } from './MobileInput';
import { TouchButton } from './TouchButton';
import { SwipeContainer } from './SwipeContainer';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'sonner';

/**
 * MobileFormExample - A demonstration component showing how to use 
 * the mobile UI components together to create a touch-optimized experience
 */
const MobileFormExample = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [listItems, setListItems] = useState(['Swipe me left or right']);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setListItems([...listItems, name]);
      setName('');
      setLoading(false);
      toast.success('Item added successfully');
    }, 1000);
  };
  
  const handleSwipeLeft = (index: number) => {
    toast('Swiped left', {
      description: `You swiped item ${index + 1} left`
    });
  };
  
  const handleSwipeRight = (index: number) => {
    // Remove the item
    const newItems = [...listItems];
    newItems.splice(index, 1);
    setListItems(newItems);
    
    toast('Item removed', {
      description: `You swiped item ${index + 1} right to remove it`
    });
  };
  
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-medium">Mobile-Optimized Form</h2>
      
      <MobileForm onFormSubmit={handleSubmit}>
        <div className="space-y-3">
          <label htmlFor="name" className="text-sm font-medium block">
            Add an item
          </label>
          <MobileInput
            id="name"
            placeholder="Enter item name"
            value={name}
            onChangeText={setName}
            showClearButton={true}
          />
        </div>
        
        <TouchButton type="submit" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Add Item'}
        </TouchButton>
      </MobileForm>
      
      <div className="mt-8">
        <h3 className="text-md font-medium mb-2">Swipe Items (left or right):</h3>
        
        <div className="space-y-2">
          {listItems.map((item, index) => (
            <SwipeContainer
              key={index}
              onSwipeLeft={() => handleSwipeLeft(index)}
              onSwipeRight={() => handleSwipeRight(index)}
              className="bg-card p-4 rounded-lg touch-manipulation shadow-sm"
            >
              <div>{item}</div>
            </SwipeContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export { MobileFormExample };
