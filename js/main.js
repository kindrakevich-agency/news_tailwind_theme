/**
 * @file
 * Main JavaScript for News theme.
 */

(function (Drupal) {
  'use strict';

  Drupal.behaviors.newsTheme = {
    attach: function (context, settings) {

      // Share dropdown functionality
      const shareButtons = context.querySelectorAll('.share-button');
      shareButtons.forEach(function(button) {
        if (!button.hasAttribute('data-share-initialized')) {
          button.setAttribute('data-share-initialized', 'true');

          button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const container = button.closest('.share-dropdown-container');
            const dropdown = container.querySelector('.share-dropdown');

            // Close all other dropdowns
            document.querySelectorAll('.share-dropdown').forEach(function(d) {
              if (d !== dropdown) {
                d.classList.add('hidden');
              }
            });

            // Toggle this dropdown
            dropdown.classList.toggle('hidden');
          });
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.share-dropdown-container')) {
          document.querySelectorAll('.share-dropdown').forEach(function(dropdown) {
            dropdown.classList.add('hidden');
          });
        }
      });

      // Facebook share
      const facebookLinks = context.querySelectorAll('.share-facebook');
      facebookLinks.forEach(function(link) {
        if (!link.hasAttribute('data-facebook-initialized')) {
          link.setAttribute('data-facebook-initialized', 'true');

          link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
            const shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(fullUrl);
            window.open(shareUrl, 'facebook-share', 'width=600,height=400');

            // Close dropdown
            const dropdown = link.closest('.share-dropdown');
            if (dropdown) {
              dropdown.classList.add('hidden');
            }
          });
        }
      });

      // Telegram share
      const telegramLinks = context.querySelectorAll('.share-telegram');
      telegramLinks.forEach(function(link) {
        if (!link.hasAttribute('data-telegram-initialized')) {
          link.setAttribute('data-telegram-initialized', 'true');

          link.addEventListener('click', function(e) {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
            const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(fullUrl);
            window.open(shareUrl, 'telegram-share', 'width=600,height=400');

            // Close dropdown
            const dropdown = link.closest('.share-dropdown');
            if (dropdown) {
              dropdown.classList.add('hidden');
            }
          });
        }
      });

      // Collect/Favorites functionality
      const collectButtons = context.querySelectorAll('.collect-button');
      collectButtons.forEach(function(button) {
        if (!button.hasAttribute('data-collect-initialized')) {
          button.setAttribute('data-collect-initialized', 'true');

          const nid = button.getAttribute('data-nid');

          // Check if already collected
          const favorites = getFavorites();
          if (favorites.includes(nid)) {
            button.classList.add('collected');
            button.classList.add('text-red-500');
            button.classList.remove('text-gray-600');
            button.setAttribute('aria-label', button.getAttribute('data-collected-text') || 'Collected');
          }

          button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFavorite(nid);

            // Update button state
            const favorites = getFavorites();
            if (favorites.includes(nid)) {
              button.classList.add('collected');
              button.classList.add('text-red-500');
              button.classList.remove('text-gray-600');
              button.setAttribute('aria-label', button.getAttribute('data-collected-text') || 'Collected');
            } else {
              button.classList.remove('collected');
              button.classList.remove('text-red-500');
              button.classList.add('text-gray-600');
              button.setAttribute('aria-label', button.getAttribute('data-collect-text') || 'Collect');
            }

            // Update favorites count in header
            updateFavoritesCount();
          });
        }
      });

      // Favorites icon click - show modal with favorites
      const favoritesIcon = context.querySelector('#favorites-icon');
      if (favoritesIcon && !favoritesIcon.hasAttribute('data-favorites-initialized')) {
        favoritesIcon.setAttribute('data-favorites-initialized', 'true');

        favoritesIcon.addEventListener('click', function(e) {
          e.preventDefault();
          showFavoritesModal();
        });

        // Initial count update
        updateFavoritesCount();
      }
    }
  };

  // Helper functions for favorites
  function getFavorites() {
    const favorites = localStorage.getItem('news_favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem('news_favorites', JSON.stringify(favorites));
  }

  function toggleFavorite(nid) {
    let favorites = getFavorites();
    const index = favorites.indexOf(nid);

    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.push(nid);
    }

    saveFavorites(favorites);
  }

  function updateFavoritesCount() {
    const favorites = getFavorites();
    const countElement = document.querySelector('#favorites-count');
    if (countElement) {
      const count = favorites.length;
      if (count > 0) {
        countElement.textContent = count;
        countElement.classList.remove('hidden');
      } else {
        countElement.classList.add('hidden');
      }
    }
  }

  function showFavoritesModal() {
    const favorites = getFavorites();

    // Create modal if it doesn't exist
    let modal = document.getElementById('favorites-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'favorites-modal';
      modal.className = 'fixed inset-0 z-50 overflow-y-auto hidden';
      modal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" id="favorites-modal-backdrop"></div>

          <!-- Modal panel -->
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex items-start justify-between mb-4">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">My Favorites</h3>
                <button id="favorites-modal-close" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Content -->
              <div id="favorites-modal-content" class="mt-4">
                <p class="text-center text-gray-500 dark:text-gray-400 py-8">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close modal handlers
      document.getElementById('favorites-modal-close').addEventListener('click', closeFavoritesModal);
      document.getElementById('favorites-modal-backdrop').addEventListener('click', closeFavoritesModal);
    }

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Load favorites content
    const contentDiv = document.getElementById('favorites-modal-content');

    if (favorites.length === 0) {
      contentDiv.innerHTML = `
        <div class="text-center py-8">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
          <p class="text-gray-500 dark:text-gray-400">Start collecting articles by clicking the "Collect" button</p>
        </div>
      `;
    } else {
      // Load articles
      contentDiv.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 py-8">Loading favorites...</p>';

      // Fetch article teasers via AJAX
      const baseUrl = window.location.origin + Drupal.url('node/');
      const articlePromises = favorites.map(nid => {
        return fetch(baseUrl + nid)
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const articleTeaser = doc.querySelector('article.masonry-item');
            return articleTeaser ? articleTeaser.outerHTML : null;
          })
          .catch(error => {
            console.error('Error loading article:', nid, error);
            return null;
          });
      });

      Promise.all(articlePromises).then(articles => {
        const validArticles = articles.filter(a => a !== null);

        if (validArticles.length > 0) {
          contentDiv.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              ${validArticles.join('')}
            </div>
          `;

          // Re-attach Drupal behaviors for the new content
          if (typeof Drupal !== 'undefined' && Drupal.attachBehaviors) {
            Drupal.attachBehaviors(contentDiv);
          }
        } else {
          contentDiv.innerHTML = `
            <div class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">Could not load favorites</p>
            </div>
          `;
        }
      });
    }
  }

  function closeFavoritesModal() {
    const modal = document.getElementById('favorites-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

})(Drupal);
