# Setup Configuration Translation for News Theme

The configuration translation isn't appearing because the theme configuration needs to be created in Drupal's active configuration storage.

## Run These Commands on Your Server:

```bash
# 1. Set the translatable configuration values
drush config:set news_theme.settings footer_description "Your trusted source for news and information from the Polissya region. Stay informed with the latest updates and stories." -y

drush config:set news_theme.settings newsletter_header "WELCOME TO BULETIN" -y

# 2. Set other default values
drush config:set news_theme.settings footer_site_name "Polissya.today" -y
drush config:set news_theme.settings footer_email "contact@polissya.today" -y
drush config:set news_theme.settings footer_facebook "" -y
drush config:set news_theme.settings footer_twitter "" -y
drush config:set news_theme.settings footer_instagram "" -y
drush config:set news_theme.settings footer_youtube "" -y
drush config:set news_theme.settings footer_github "" -y
drush config:set news_theme.settings footer_medium "" -y
drush config:set news_theme.settings language_switcher_domains "[]" -y
drush config:set news_theme.settings language_switcher_hide_anonymous false -y

# 3. Clear all caches
drush cr
```

## Alternative: Using Drupal Admin UI

If you don't have drush access, you can create the configuration through the Drupal admin:

1. Go to: `/devel/php` (requires Devel module)
2. Paste this PHP code:

```php
$config = \Drupal::configFactory()->getEditable('news_theme.settings');
$config->set('footer_description', 'Your trusted source for news and information from the Polissya region. Stay informed with the latest updates and stories.');
$config->set('newsletter_header', 'WELCOME TO BULETIN');
$config->set('footer_site_name', 'Polissya.today');
$config->set('footer_email', 'contact@polissya.today');
$config->save();
\Drupal::service('cache.render')->deleteAll();
echo "Configuration created successfully!";
```

3. Execute the code
4. Clear cache: `/admin/config/development/performance` > "Clear all caches"

## After Setup:

1. Go to: `/admin/config/regional/config-translation`
2. In the filter box, type: `news_theme.settings`
3. You should see "News Theme settings" in the list
4. Click "Translate" 
5. For each language (e.g., Spanish), click "Add" or "Edit"
6. Translate these fields:
   - **Footer description**
   - **Newsletter header**
7. Save

## Verify It's Working:

After translating, the footer description should display in the selected language on your site.

## Troubleshooting:

If it still doesn't appear:

1. Make sure the Configuration Translation module is enabled:
   ```bash
   drush pm:enable config_translation -y
   ```

2. Rebuild cache again:
   ```bash
   drush cr
   ```

3. Check if the configuration exists:
   ```bash
   drush config:get news_theme.settings
   ```

4. Check the schema is valid:
   ```bash
   drush config:status | grep news_theme
   ```
