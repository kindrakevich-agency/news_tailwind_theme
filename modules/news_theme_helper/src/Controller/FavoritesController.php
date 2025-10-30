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
    $build = [
      '#theme' => 'page__favorites',
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
