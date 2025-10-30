#!/bin/bash

echo "Starting aggressive cache clearing..."

# Clear Drupal cache
echo "1. Clearing Drupal cache..."
drush cr

# Clear all caches via Drupal
echo "2. Flushing all Drupal caches..."
drush eval "drupal_flush_all_caches();"

# Reset theme registry
echo "3. Resetting theme registry..."
drush eval "\Drupal::service('theme.registry')->reset();"

# Clear Twig cache specifically
echo "4. Clearing Twig cache..."
drush eval "\Drupal::service('twig')->invalidate();"

# Clear render cache
echo "5. Clearing render cache..."
drush eval "\Drupal::cache('render')->deleteAll();"

# Clear dynamic page cache
echo "6. Clearing dynamic page cache..."
drush eval "\Drupal::cache('dynamic_page_cache')->deleteAll();"

# Clear bootstrap cache
echo "7. Clearing bootstrap cache..."
drush eval "\Drupal::cache('bootstrap')->deleteAll();"

# Rebuild cache
echo "8. Rebuilding cache..."
drush cache:rebuild

echo ""
echo "✓ All caches cleared!"
echo ""
echo "IMPORTANT: Now clear your browser cache:"
echo "  - Press Ctrl + Shift + Delete"
echo "  - Or press Ctrl + Shift + R for hard refresh"
echo "  - Or open DevTools (F12) and right-click refresh button → Empty Cache and Hard Reload"
