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

### 1. Theme Settings

Configure the theme appearance via: **Appearance → Settings → News Theme**

**Header Settings:**
- **Header Site Name**: The site name displayed in the header. Leave empty to use the site name from Basic site settings.

**Footer Settings:**
- **Footer Site Name**: The site name displayed in the footer.
- **Footer Description**: The description text displayed in the footer.
- **Footer Email**: Contact email address (text hidden on mobile, only icon visible).
- **Social Media Links**: URLs for Facebook, Twitter, Instagram, YouTube, GitHub, and Medium.

**Newsletter/Featured Block Settings:**
- **Newsletter Header Text**: The header text displayed above the featured article section on the homepage.

### 2. Content Type Setup

Ensure your Article content type has these fields:

- **field_tags**: Taxonomy term reference
  - Vocabulary: tags
  - Widget: Autocomplete
  - Multiple values: Yes

- **field_image**: Image
  - Multiple values: Yes (only first image will be displayed)

- **body**: Text (formatted, long, with summary)

### 3. Taxonomy Vocabulary

Create a taxonomy vocabulary called "tags" (machine name: `tags`) and add terms for your categories (e.g., Politics, Business, Technology, Health, etc.)

### 4. Automatic Views (No Manual Configuration Needed!)

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

### 5. Display Modes

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
│   │   ├── exchange-rates.html.twig              # Exchange rates block
│   │   ├── footer.html.twig                      # Footer with social links
│   │   ├── header-menu.html.twig                 # Header with logo and search
│   │   ├── header-tags.html.twig                 # Taxonomy navigation
│   │   ├── newsletter-featured.html.twig         # Newsletter/featured article block
│   │   └── top-news-by-category.html.twig        # Top news by category block
│   ├── field--body.html.twig                     # Body field template
│   ├── field--field-image.html.twig              # Image field template
│   ├── field--field-tags.html.twig               # Tags field template
│   ├── html.html.twig                            # Base HTML template (parent)
│   ├── node--article.html.twig                   # Full article page
│   ├── node--article--teaser.html.twig           # Article teaser (listing)
│   ├── page--favorites.html.twig                 # Favorites page template
│   ├── page--front.html.twig                     # Front page template
│   ├── page--search.html.twig                    # Search results page template
│   ├── page--taxonomy--term.html.twig            # Taxonomy term page template
│   ├── page.html.twig                            # Default page template
│   ├── pager.html.twig                           # Pagination template
│   ├── search-result.html.twig                   # Search result item template
│   ├── taxonomy-term--tags.html.twig             # Taxonomy term page
│   └── views-view-unformatted.html.twig          # Views unformatted template
├── news_theme.info.yml                            # Theme info file
├── news_theme.install                             # Install/uninstall hooks
├── news_theme.libraries.yml                       # Asset libraries
├── news_theme.theme                               # Theme functions
└── README.md                                      # This file
```

## Template Inheritance

This theme uses Twig's template inheritance to reduce code duplication and maintain consistency across pages.

### Base Template (html.html.twig)

All page templates extend from `html.html.twig`, which provides the common HTML structure:
- DOCTYPE and html tag
- Head section with placeholders, title, and Tailwind CSS CDN
- Body with header, navigation, and footer
- Page top and bottom placeholders

### Template Blocks

Child templates can override these blocks to customize content:

**Available Blocks:**
- `head_extra` - Additional head content
- `body_classes` - Additional body CSS classes
- `before_content` - Content before main content area (e.g., filter buttons, newsletter)
- `content` - Main content area
- `after_content` - Content after main content area (e.g., JavaScript)

### Example Usage

**Simple page (page.html.twig):**
```twig
{% extends "html.html.twig" %}
{# Uses default blocks, no overrides needed #}
```

**Front page with custom content (page--front.html.twig):**
```twig
{% extends "html.html.twig" %}

{% block before_content %}
    <!-- Filter buttons, newsletter, exchange rates, etc. -->
{% endblock %}

{% block content %}
    <!-- Custom main content wrapper -->
{% endblock %}
```

**Favorites page with JavaScript (page--favorites.html.twig):**
```twig
{% extends "html.html.twig" %}

{% block before_content %}
    <!-- Filter buttons -->
{% endblock %}

{% block content %}
    <!-- Favorites list with loading states -->
{% endblock %}

{% block after_content %}
    <!-- JavaScript for loading favorites -->
{% endblock %}
```

### Benefits

- **DRY (Don't Repeat Yourself)**: Common HTML structure defined once
- **Easy Maintenance**: Changes to header/footer/structure in one place
- **Consistency**: All pages share the same base structure
- **Flexibility**: Easy to override specific sections when needed

## Customization

### Changing Site Name

You can configure the site name in two ways:
1. **Theme Settings**: Go to Appearance → Settings → News Theme → Header Settings
2. **Basic Site Settings**: Go to Configuration → System → Basic site settings (will be used if theme setting is empty)

### Changing Footer Content

Configure footer settings via: **Appearance → Settings → News Theme → Footer Settings**

You can customize:
- Footer site name and description
- Social media links (Facebook, Twitter, Instagram, YouTube, GitHub, Medium)
- Contact email address

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

## Domain Module Compatibility

This theme is fully compatible with the **Domain** module for multi-site installations:

- **Domain-aware URLs**: All URLs use Drupal's path() and url() functions, ensuring proper domain routing
- **Dynamic Site Names**: The header site name automatically uses the current domain's site name from configuration
- **No Hardcoded URLs**: All links are generated dynamically, respecting the active domain
- **Shared Configuration**: Footer settings and other theme configurations work across all domains

To use with Domain module:
1. Install and configure the Domain module
2. Set up domain-specific site names via Configuration → System → Basic site settings (per domain)
3. Optionally override site names via theme settings for each domain

## Mobile Optimizations

The theme includes several mobile-specific optimizations:

- **Responsive Header**: Login icon hidden on mobile devices for cleaner navigation
- **Mobile-friendly Footer**: Email text hidden on mobile (icon remains visible)
- **Optimized Newsletter Block**: Mobile-specific padding and font sizes matching the news list layout
- **Active Menu States**: Menu items show active state with gray background for better navigation
- **Sticky Header**: Header remains fixed at the top on all devices

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
