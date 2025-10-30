# News Theme for Drupal 11

A modern, responsive news website theme built with Tailwind CSS for Drupal 11.

## Features

- Clean, modern design with Tailwind CSS
- Responsive masonry layout for article listings
- Sticky header with search functionality
- Dynamic taxonomy-based navigation
- Optimized for article content type
- Separate includes for header, navigation, and footer
- Pagination support
- **Pre-configured Views** - Automatically installed with the theme
- **Auto-configured homepage** - Ready to use immediately

## Requirements

- Drupal 11 (or Drupal 10)
- Article content type with the following fields:
  - `field_tags` (Taxonomy term reference to 'tags' vocabulary)
  - `field_image` (Image field, multiple values - only first image is displayed)
  - `body` (Text field with summary)

## Installation

1. Copy the theme to your Drupal installation:
   ```
   cp -r news_theme /path/to/drupal/themes/custom/
   ```

2. Enable the theme (this will automatically install the required views and set the homepage):
   ```bash
   drush theme:enable news_theme
   drush config:set system.theme default news_theme
   drush cr
   ```

   Or via the admin interface:
   - Go to Appearance → Install and set as default
   - Clear cache after installation

**Note:** When the theme is installed, it automatically:
- Creates **Frontpage Articles View** - Displays latest articles on `/frontpage`
- Creates **Taxonomy Term Articles View** - Displays filtered articles on `/taxonomy/term/%`
- Sets `/frontpage` as the default homepage (via install hook)

## Configuration

### 1. Content Type Setup

Ensure your Article content type has these fields:

- **field_tags**: Taxonomy term reference
  - Vocabulary: tags
  - Widget: Autocomplete
  - Multiple values: Yes

- **field_image**: Image
  - Multiple values: Yes (only first image will be displayed)

- **body**: Text (formatted, long, with summary)

### 2. Taxonomy Vocabulary

Create a taxonomy vocabulary called "tags" (machine name: `tags`) and add terms for your categories (e.g., Politics, Business, Technology, Health, etc.)

### 3. Automatic Views (No Manual Configuration Needed!)

The theme automatically installs two pre-configured views when enabled:

#### Frontpage Articles View
- **Path**: `/frontpage` (automatically set as homepage)
- **Format**: Unformatted list with masonry layout
- **Display**: Article nodes in teaser mode
- **Sort**: Post date (newest first)
- **Pager**: 12 items per page
- **Access**: All users with 'access content' permission

#### Taxonomy Term Articles View
- **Path**: `/taxonomy/term/%` (overrides default taxonomy pages)
- **Format**: Unformatted list with masonry layout
- **Display**: Article nodes filtered by tag in teaser mode
- **Sort**: Post date (newest first)
- **Pager**: 12 items per page
- **Contextual Filter**: Taxonomy term ID from URL
- **Validation**: Only accepts terms from 'tags' vocabulary

**These views are pre-configured and ready to use!** No manual view creation needed.

### 4. Display Modes

Configure the Article teaser display mode:

Navigate to: Structure → Content types → Article → Manage display → Teaser

- **field_image**: Image style (e.g., Large 480×480)
  - Show only first image
- **field_tags**: Label hidden
- **body**: Summary or trimmed, 200 characters

## Theme Structure

```
news_theme/
├── config/
│   └── install/
│       ├── views.view.frontpage_articles.yml      # Frontpage view config
│       └── views.view.taxonomy_term_articles.yml  # Taxonomy term view config
├── css/
│   └── style.css                                  # Custom CSS styles
├── js/                                            # JavaScript files (if needed)
├── templates/
│   ├── includes/
│   │   ├── header-menu.html.twig                 # Header with logo and search
│   │   ├── header-tags.html.twig                 # Taxonomy navigation
│   │   └── footer.html.twig                      # Footer with social links
│   ├── field--body.html.twig                     # Body field template
│   ├── field--field-image.html.twig              # Image field template
│   ├── field--field-tags.html.twig               # Tags field template
│   ├── node--article.html.twig                   # Full article page
│   ├── node--article--teaser.html.twig           # Article teaser (listing)
│   ├── page--front.html.twig                     # Front page template
│   ├── page.html.twig                            # Default page template
│   ├── pager.html.twig                           # Pagination template
│   ├── taxonomy-term--tags.html.twig             # Taxonomy term page
│   └── views-view-unformatted.html.twig          # Views unformatted template
├── news_theme.info.yml                            # Theme info file
├── news_theme.install                             # Install/uninstall hooks
├── news_theme.libraries.yml                       # Asset libraries
├── news_theme.theme                               # Theme functions
└── README.md                                      # This file
```

## Customization

### Changing Site Name

Edit `templates/includes/header-menu.html.twig` and change "NewsHub" to your site name.

### Changing Footer Content

Edit `templates/includes/footer.html.twig` to update:
- Site name and description
- Footer menu links
- Social media links
- Email address

### Styling

The theme uses Tailwind CSS via CDN. Custom styles can be added to `css/style.css`.

Key CSS classes:
- `.masonry` - Masonry grid layout
- `.scrollbar-hide` - Hide scrollbars while maintaining functionality

### Color Schemes

Tag colors can be customized in `templates/field--field-tags.html.twig`. Available Tailwind color schemes:
- `bg-purple-100 text-purple-800`
- `bg-red-100 text-red-800`
- `bg-blue-100 text-blue-800`
- `bg-green-100 text-green-800`
- etc.

## Template Files Explained

### Page Templates
- **page--front.html.twig**: Homepage layout with filter buttons and masonry grid
- **page.html.twig**: Default page layout for article detail pages
- **taxonomy-term--tags.html.twig**: Similar to front page but for filtered tag views

### Node Templates
- **node--article.html.twig**: Full article view with featured image, tags, body content
- **node--article--teaser.html.twig**: Compact card view for listings

### Field Templates
- **field--field-tags.html.twig**: Displays tags as styled badges with links
- **field--field-image.html.twig**: Displays only the first image (even if multiple)
- **field--body.html.twig**: Formats body text with proper styling

### Include Templates
- **header-menu.html.twig**: Site logo and search form
- **header-tags.html.twig**: Horizontal scrolling taxonomy navigation
- **footer.html.twig**: Footer with social links and navigation

## Troubleshooting

### Tags Not Showing in Header
Make sure:
1. The taxonomy vocabulary machine name is exactly `tags`
2. You have created taxonomy terms
3. Clear Drupal cache: `drush cr`

### Masonry Layout Not Working
1. Clear browser cache
2. Check that `css/style.css` is loading
3. Verify Tailwind CDN is accessible

### Images Not Displaying
1. Check field name is `field_image`
2. Verify image style exists
3. Check field permissions

## Credits

Original HTML design converted to Drupal 11 theme with Tailwind CSS.

## License

GPL-2.0-or-later
