
-- Function to clean up orphaned food records
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_food_records()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Remove food portion options that reference non-existent food items
  DELETE FROM public.food_portion_options
  WHERE NOT EXISTS (
    SELECT 1 FROM public.food_items
    WHERE food_items.id = food_portion_options.food_item_id
  );
  
  -- Remove any favorite foods that reference non-existent food items
  DELETE FROM public.favorite_foods
  WHERE NOT EXISTS (
    SELECT 1 FROM public.food_items
    WHERE food_items.id = favorite_foods.food_item_id
  );
END;
$$;

-- Function to update food usage statistics
CREATE OR REPLACE FUNCTION public.update_food_usage_statistics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update search_count for items based on food log usage
  UPDATE public.food_items
  SET search_count = search_count + subquery.log_count
  FROM (
    SELECT food_item_id, COUNT(*) as log_count
    FROM public.user_food_logs
    WHERE created_at > NOW() - interval '30 days'
    GROUP BY food_item_id
  ) as subquery
  WHERE food_items.id = subquery.food_item_id;
  
  -- Update last_used_at for items based on most recent usage
  UPDATE public.food_items
  SET last_used_at = subquery.max_date
  FROM (
    SELECT food_item_id, MAX(created_at) as max_date
    FROM public.user_food_logs
    GROUP BY food_item_id
  ) as subquery
  WHERE food_items.id = subquery.food_item_id
  AND (food_items.last_used_at IS NULL OR subquery.max_date > food_items.last_used_at);
END;
$$;

-- Function to get food database statistics
CREATE OR REPLACE FUNCTION public.get_food_database_stats()
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_count', (SELECT COUNT(*) FROM public.food_items),
    'core_count', (SELECT COUNT(*) FROM public.food_items WHERE data_layer = 'core'),
    'api_count', (SELECT COUNT(*) FROM public.food_items WHERE data_layer = 'api_cache'),
    'user_count', (SELECT COUNT(*) FROM public.food_items WHERE data_layer = 'user'),
    'unused_count', (SELECT COUNT(*) FROM public.food_items WHERE last_used_at IS NULL OR last_used_at < NOW() - interval '90 days')
  ) INTO result;
  
  RETURN result;
END;
$$;
