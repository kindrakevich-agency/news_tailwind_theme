<?php

/**
 * @file
 * Script to set up translatable configuration for News Theme.
 *
 * Run with: drush php:script setup-config-translation.php
 * Or: php web/core/scripts/drupal quick-start setup-config-translation.php
 */

use Drupal\Core\Config\FileStorage;

// Get the configuration factory.
$config_factory = \Drupal::configFactory();

// Get the theme path.
$theme_path = \Drupal::service('extension.list.theme')->getPath('news_theme');
$config_install_path = $theme_path . '/config/install';

// Check if the install config file exists.
if (file_exists($config_install_path . '/news_theme.settings.yml')) {
  echo "Found configuration file at: $config_install_path/news_theme.settings.yml\n";

  // Load the configuration from the file.
  $source = new FileStorage($config_install_path);
  $config_data = $source->read('news_theme.settings');

  if ($config_data) {
    echo "Configuration data loaded successfully.\n";

    // Get or create the configuration.
    $config = $config_factory->getEditable('news_theme.settings');

    // Merge with existing settings (don't overwrite user customizations).
    $existing_data = $config->getRawData();
    $merged_data = array_merge($config_data, $existing_data);

    // Save the configuration.
    $config->setData($merged_data)->save();

    echo "Configuration saved to active storage.\n";
    echo "Configuration name: news_theme.settings\n";
    echo "\nNext steps:\n";
    echo "1. Clear cache: drush cr\n";
    echo "2. Go to: /admin/config/regional/config-translation\n";
    echo "3. Look for 'News Theme settings' or filter by 'news_theme'\n";
    echo "4. Click 'Translate' to add translations\n";
  } else {
    echo "ERROR: Could not read configuration data from file.\n";
  }
} else {
  echo "ERROR: Configuration file not found at: $config_install_path/news_theme.settings.yml\n";
  echo "Creating configuration manually...\n";

  // Create configuration manually.
  $config = $config_factory->getEditable('news_theme.settings');

  $default_data = [
    'footer_site_name' => 'Polissya.today',
    'footer_description' => 'Your trusted source for news and information from the Polissya region. Stay informed with the latest updates and stories.',
    'footer_email' => 'contact@polissya.today',
    'footer_facebook' => '',
    'footer_twitter' => '',
    'footer_instagram' => '',
    'footer_youtube' => '',
    'footer_github' => '',
    'footer_medium' => '',
    'newsletter_header' => 'WELCOME TO BULETIN',
    'language_switcher_domains' => [],
    'language_switcher_hide_anonymous' => false,
  ];

  // Merge with existing theme settings if any.
  $existing = $config->getRawData();
  $merged = array_merge($default_data, $existing);

  $config->setData($merged)->save();

  echo "Configuration created successfully.\n";
  echo "\nNext steps:\n";
  echo "1. Clear cache: drush cr\n";
  echo "2. Go to: /admin/config/regional/config-translation\n";
  echo "3. Look for 'News Theme settings' or filter by 'news_theme'\n";
  echo "4. Click 'Translate' to add translations\n";
}

echo "\nDone!\n";
