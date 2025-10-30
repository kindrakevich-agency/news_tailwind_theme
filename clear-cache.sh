#!/bin/bash

# Clear all Drupal caches
echo "Clearing Drupal cache..."
drush cr

# Clear Twig cache
echo "Clearing Twig template cache..."
drush eval "drupal_flush_all_caches();"

# Rebuild theme registry
echo "Rebuilding theme registry..."
drush eval "\Drupal::service('theme.registry')->reset();"

echo "All caches cleared!"
echo ""
echo "IMPORTANT: Also clear your browser cache:"
echo "  Chrome/Edge: Ctrl+Shift+Delete or Cmd+Shift+Delete"
echo "  Or use hard refresh: Ctrl+F5 or Cmd+Shift+R"
