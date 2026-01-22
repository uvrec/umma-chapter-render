
-- Soft delete empty verses after verse 114 in SCC Canto 1 Chapter 3
-- Note: Only runs if deleted_at column exists on verses table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'verses'
      AND column_name = 'deleted_at'
  ) THEN
    UPDATE verses
    SET deleted_at = NOW()
    WHERE id IN ('d303655e-6520-4fef-947b-7ff875064a37', 'b4e2d77e-c903-4ab8-a1ad-1bd2c8b25c11');
    RAISE NOTICE 'Soft deleted empty verses in SCC Canto 1 Chapter 3';
  ELSE
    RAISE NOTICE 'Column deleted_at does not exist on verses table, skipping soft delete...';
  END IF;
END $$;
