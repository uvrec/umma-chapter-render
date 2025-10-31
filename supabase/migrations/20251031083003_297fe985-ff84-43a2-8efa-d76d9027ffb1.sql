
-- Soft delete empty verses after verse 114 in SCC Canto 1 Chapter 3
UPDATE verses
SET deleted_at = NOW()
WHERE id IN ('d303655e-6520-4fef-947b-7ff875064a37', 'b4e2d77e-c903-4ab8-a1ad-1bd2c8b25c11');
