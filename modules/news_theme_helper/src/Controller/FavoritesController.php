<?php

namespace Drupal\news_theme_helper\Controller;

use Drupal\Core\Controller\ControllerBase;
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

    // Load main menu items
    $menu_tree = \Drupal::menuTree();
    $menu_name = 'main';
    $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
    $parameters->setMaxDepth(1);
    $tree = $menu_tree->load($menu_name, $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);

    $main_menu_items = [];
    foreach ($tree as $element) {
      $main_menu_items[] = [
        'title' => $element->link->getTitle(),
        'url' => $element->link->getUrlObject(),
      ];
    }

    $build = [
      '#theme' => 'page__favorites',
      '#tags' => $tags,
      '#main_menu_items' => $main_menu_items,
      '#cache' => [
        'max-age' => 0, // Don't cache this page
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

    $articles = [];
    $nodes = Node::loadMultiple($nids);

    foreach ($nodes as $node) {
      if ($node->bundle() === 'article' && $node->access('view')) {
        // Render the node in teaser view mode
        $view_builder = \Drupal::entityTypeManager()->getViewBuilder('node');
        $render_array = $view_builder->view($node, 'teaser');
        $articles[] = \Drupal::service('renderer')->renderRoot($render_array);
      }
    }

    return new JsonResponse(['articles' => $articles]);
  }

}
