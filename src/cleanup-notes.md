
# Cleanup Notes

## Package.json Dependencies to Keep

### Core Dependencies
- react
- react-dom
- react-router-dom
- typescript
- vite
- @supabase/supabase-js
- @capacitor/* packages (for mobile)

### UI Dependencies
- tailwindcss and its plugins
- shadcn/ui core packages
- class-variance-authority
- clsx
- tailwind-merge

### Type Definitions
- All @types packages

## Files/Components Kept

### Data & Types
- /src/data/types.ts
- /src/data/exercisesDatabase.ts
- /src/data/exerciseUtils.ts
- /src/data/exercises.ts

### Utilities
- /src/lib/utils.ts
- /src/lib/animations.ts

### Core UI Components (from shadcn)
- button
- dialog
- form
- input
- select
- card
- toast

## Database Structure
- All Supabase tables are kept as is
- All RLS policies are preserved
- Authentication setup remains intact

## Next Steps
1. Implement a minimal UI framework
2. Create new basic page structure
3. Rebuild core feature components
4. Focus on workout tracking first
