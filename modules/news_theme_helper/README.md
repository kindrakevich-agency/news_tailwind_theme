# News Theme Helper Module

This is a helper module for the News Theme. It provides the favorites page routing functionality.

## Installation

1. Enable this module: `drush en news_theme_helper -y`
2. Clear cache: `drush cr`

The `/favorites` page will now work correctly.

## What it does

- Provides the `/favorites` route that displays user's collected articles
- Provides the `/favorites/api` endpoint for loading favorite articles via AJAX
