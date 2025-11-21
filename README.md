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
- Node.js and npm (for building Tailwind CSS)
- Article content type with the following fields:
  - `field_tags` (Taxonomy term reference to 'tags' vocabulary)
  - `field_image` (Image field, multiple values - only first image is displayed)
  - `body` (Text field with summary)

## Installation

1. Copy the theme to your Drupal installation:
   ```bash
   cp -r news_theme /path/to/drupal/themes/custom/
   ```

2. Install dependencies and build the CSS:
   ```bash
   cd /path/to/drupal/themes/custom/news_theme
   npm install
   npm run build
   ```

3. Enable the theme (this will automatically install the required views and set the homepage):
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
│   ├── src/
│   │   └── input.css                              # Source CSS with Tailwind directives
│   └── style.css                                  # Compiled/minified CSS output
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
├── package.json                                   # Node.js dependencies
├── tailwind.config.js                             # Tailwind CSS configuration
├── .gitignore                                     # Git ignore rules
└── README.md                                      # This file
```

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

The theme uses Tailwind CSS with a build process for optimized performance.

**Working with styles:**
1. Edit `css/src/input.css` to modify styles (not `css/style.css` directly)
2. Run the build command to compile changes:
   ```bash
   npm run build    # Production build (minified)
   npm run watch    # Development mode (auto-compile on save)
   ```

**Available build commands:**
- `npm run build` - Compiles and minifies CSS for production
- `npm run watch` - Watches for changes and auto-compiles during development
- `npm run dev` - Alias for `npm run watch`

**Key CSS classes:**
- `.masonry` - Masonry grid layout (custom)
- `.scrollbar-hide` - Hide scrollbars while maintaining functionality (custom)
- All Tailwind utility classes (e.g., `bg-blue-500`, `text-center`, etc.)

**How it works:**
- Tailwind scans your templates and only includes the CSS classes you actually use
- Custom styles in `css/src/input.css` are combined with Tailwind utilities
- Final output is minified and optimized (~32KB for production)

### Color Schemes

Tag colors can be customized in `templates/field--field-tags.html.twig`. Available Tailwind color schemes:
- `bg-purple-100 text-purple-800`
- `bg-red-100 text-red-800`
- `bg-blue-100 text-blue-800`
- `bg-green-100 text-green-800`
- etc.

## Development Workflow

### Setting Up for Development

1. Clone or copy the theme to your Drupal installation
2. Install Node.js dependencies:
   ```bash
   cd /path/to/themes/custom/news_theme
   npm install
   ```

### Making Style Changes

**For CSS modifications:**
1. Start the watch process:
   ```bash
   npm run watch
   ```
2. Edit `css/src/input.css` - changes will automatically compile
3. Refresh your browser to see the changes
4. When done, press Ctrl+C to stop the watch process

**For production deployment:**
```bash
npm run build
```
This creates an optimized, minified CSS file.

### Making Template Changes

1. Edit any `.html.twig` file in the `templates/` directory
2. Clear Drupal cache:
   ```bash
   drush cr
   ```
3. Refresh your browser to see the changes

### Adding New Tailwind Classes

When you add new Tailwind utility classes to your templates:
1. The classes will automatically be included in the compiled CSS
2. If using `npm run watch`, they'll be added immediately
3. If not, run `npm run build` to regenerate the CSS

### File Structure for Development

**Don't edit directly:**
- `css/style.css` - This is auto-generated and will be overwritten

**Edit these files:**
- `css/src/input.css` - Add custom CSS and Tailwind directives here
- `templates/**/*.html.twig` - Modify markup and add Tailwind classes
- `tailwind.config.js` - Configure Tailwind settings (colors, fonts, etc.)

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

### CSS Styles Not Updating
If your CSS changes aren't appearing:
1. Make sure you're editing `css/src/input.css`, not `css/style.css`
2. Run `npm run build` to compile the CSS
3. Clear Drupal cache: `drush cr`
4. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
5. Check that `css/style.css` was regenerated (check the file timestamp)

### npm install Fails
If you get errors during `npm install`:
1. Ensure Node.js version 14 or higher is installed: `node --version`
2. Update npm: `npm install -g npm@latest`
3. Clear npm cache: `npm cache clean --force`
4. Delete `node_modules` folder and `package-lock.json`, then try again

### Tailwind Classes Not Working
If Tailwind utility classes aren't being applied:
1. Rebuild the CSS: `npm run build`
2. Check that the classes are in your templates (`.html.twig` files)
3. Verify `tailwind.config.js` includes the correct template paths
4. Clear both Drupal and browser cache

### Tags Not Showing in Header
Make sure:
1. The taxonomy vocabulary machine name is exactly `tags`
2. You have created taxonomy terms
3. Clear Drupal cache: `drush cr`

### Masonry Layout Not Working
1. Clear browser cache
2. Check that `css/style.css` is loading and is not empty
3. Rebuild CSS: `npm run build`
4. Clear Drupal cache: `drush cr`

### Images Not Displaying
1. Check field name is `field_image`
2. Verify image style exists
3. Check field permissions

## Credits

Original HTML design converted to Drupal 11 theme with Tailwind CSS.

## License

GPL-2.0-or-later
