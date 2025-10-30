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
            button.textContent = button.getAttribute('data-collected-text') || 'Collected';
            button.classList.add('opacity-75');
          }

          button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFavorite(nid);

            // Update button state
            const favorites = getFavorites();
            if (favorites.includes(nid)) {
              button.textContent = button.getAttribute('data-collected-text') || 'Collected';
              button.classList.add('opacity-75');
            } else {
              button.textContent = button.getAttribute('data-collect-text') || 'Collect';
              button.classList.remove('opacity-75');
            }

            // Update favorites count in header
            updateFavoritesCount();
          });
        }
      });

      // Favorites icon click - redirect to favorites page
      const favoritesIcon = context.querySelector('#favorites-icon');
      if (favoritesIcon && !favoritesIcon.hasAttribute('data-favorites-initialized')) {
        favoritesIcon.setAttribute('data-favorites-initialized', 'true');

        favoritesIcon.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = settings.path.baseUrl + 'favorites';
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

})(Drupal);
