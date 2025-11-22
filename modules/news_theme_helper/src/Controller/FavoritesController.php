<?php

namespace Drupal\news_theme_helper\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for the favorites page.
 */
class FavoritesController extends ControllerBase {

  /**
   * Display the favorites page.
   */
  public function content(Request $request) {
    // Load tags from taxonomy vocabulary
    $tags = [];
    $term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
    $terms = $term_storage->loadTree('tags', 0, NULL, TRUE);
    foreach ($terms as $term) {
      $tags[] = [
        'id' => $term->id(),
        'name' => $term->getName(),
      ];
    }

    // Load main menu items with language and domain support.
    $main_menu_items = $this->getMainMenuItems();

    $build = [
      '#theme' => 'page__favorites',
      '#tags' => $tags,
      '#main_menu_items' => $main_menu_items,
      '#cache' => [
        'max-age' => 0, // Don't cache this page
        'contexts' => [
          'languages:language_interface',
          'languages:language_content',
        ],
      ],
    ];

    return $build;
  }

  /**
   * API endpoint to get favorite articles.
   */
  public function api(Request $request) {
    $nids = $request->query->get('nids');

    if (empty($nids)) {
      return new JsonResponse(['articles' => []]);
    }

    $nids = explode(',', $nids);
    $nids = array_filter($nids, 'is_numeric');

    if (empty($nids)) {
      return new JsonResponse(['articles' => []]);
    }

    // Get current language for loading translated nodes.
    $language_manager = \Drupal::languageManager();
    $current_language = $language_manager->getCurrentLanguage();

    $articles = [];
    $nodes = Node::loadMultiple($nids);

    foreach ($nodes as $node) {
      if ($node->bundle() === 'article' && $node->access('view')) {
        // Get translated version of the node if available.
        $translated_node = $node;
        if ($node->hasTranslation($current_language->getId())) {
          $translated_node = $node->getTranslation($current_language->getId());
        }

        // Render the translated node in teaser view mode.
        $view_builder = \Drupal::entityTypeManager()->getViewBuilder('node');
        $render_array = $view_builder->view($translated_node, 'teaser');

        // Add language cache context to ensure proper caching.
        $render_array['#cache']['contexts'][] = 'languages:language_interface';
        $render_array['#cache']['contexts'][] = 'languages:language_content';

        $articles[] = \Drupal::service('renderer')->renderRoot($render_array);
      }
    }

    return new JsonResponse(['articles' => $articles]);
  }

  /**
   * Helper function to get main menu items with language and domain filtering.
   *
   * @return array
   *   Array of menu items with title, url, and is_active keys.
   */
  protected function getMainMenuItems() {
    $menu_tree = \Drupal::menuTree();
    $menu_name = 'main';

    // Get current language for proper menu translation.
    $language_manager = \Drupal::languageManager();
    $current_language = $language_manager->getCurrentLanguage();

    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    $parameters->setMaxDepth(1);
    $tree = $menu_tree->load($menu_name, $parameters);

    // Use standard menu tree manipulators.
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);

    // Get domain restrictions if domain_menu_item module is enabled.
    $domain_restrictions = [];
    $active_domain_id = NULL;

    if (\Drupal::moduleHandler()->moduleExists('domain') &&
        \Drupal::moduleHandler()->moduleExists('domain_menu_item')) {

      // Get the current domain.
      $domain_negotiator = \Drupal::service('domain.negotiator');
      $active_domain = $domain_negotiator->getActiveDomain();

      if ($active_domain) {
        $active_domain_id = $active_domain->id();

        // Get all menu links that have domain restrictions.
        $database = \Drupal::database();
        $query = $database->select('domain_menu_item', 'd')
          ->fields('d', ['menu_link_content_id', 'domain_id']);
        $results = $query->execute()->fetchAll();

        // Group by menu link content id.
        foreach ($results as $row) {
          $domain_restrictions[$row->menu_link_content_id][] = $row->domain_id;
        }
      }
    }

    // Get current path for active menu detection.
    $current_path = \Drupal::service('path.current')->getPath();
    // Generate language-aware URL for comparison.
    $current_url = Url::fromUserInput($current_path, [
      'language' => $current_language,
    ])->toString();

    $menu_items = [];
    foreach ($tree as $element) {
      $plugin_id = $element->link->getPluginId();
      $menu_link_entity = NULL;

      // Load menu link content entity if this is a content menu link.
      if (strpos($plugin_id, 'menu_link_content:') === 0) {
        $uuid = str_replace('menu_link_content:', '', $plugin_id);
        $entities = \Drupal::entityTypeManager()
          ->getStorage('menu_link_content')
          ->loadByProperties(['uuid' => $uuid]);

        if ($entities) {
          $menu_link_entity = reset($entities);
        }
      }

      // Language filtering: Skip menu items not translated to current language.
      if ($menu_link_entity) {
        // Check if the menu link has a translation for the current language.
        if (!$menu_link_entity->hasTranslation($current_language->getId())) {
          // Skip this menu item if it's not available in the current language.
          continue;
        }

        // Get the translated version of the menu link.
        $menu_link_entity = $menu_link_entity->getTranslation($current_language->getId());
      }

      // Apply domain filtering if domain module is enabled.
      if ($active_domain_id && !empty($domain_restrictions) && $menu_link_entity) {
        $menu_link_id = $menu_link_entity->id();

        // Check if this menu link has domain restrictions.
        if (isset($domain_restrictions[$menu_link_id])) {
          $allowed_domains = $domain_restrictions[$menu_link_id];

          // If current domain is not in the allowed list, skip this link.
          if (!in_array($active_domain_id, $allowed_domains)) {
            continue;
          }
        }
      }

      // Get URL object and ensure it's language-aware.
      $url_object = $element->link->getUrlObject();

      // Generate language-aware URL for menu item.
      if (!$url_object->isExternal()) {
        $url_object->setOption('language', $current_language);
      }

      $is_active = FALSE;

      // Check if this menu item is active by comparing language-aware URLs.
      $menu_url = $url_object->toString();
      if ($menu_url === $current_url) {
        $is_active = TRUE;
      }

      // Use translated title if available, otherwise use default title.
      $title = $menu_link_entity ? $menu_link_entity->getTitle() : $element->link->getTitle();

      $menu_items[] = [
        'title' => $title,
        'url' => $url_object,
        'is_active' => $is_active,
      ];
    }

    return $menu_items;
  }

}
