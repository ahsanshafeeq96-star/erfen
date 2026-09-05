/**
 * EFREN BISTRO & GRILL — SRINAGAR
 * Client-side interactions, navigation, reservations, and luxury reveal effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll state
  const header = document.querySelector('header.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile drawer navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('drawer-open', isOpen);
    });

    if (drawerClose) {
      drawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('drawer-open');
      });
    }

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('drawer-open');
      });
    });
  }

  // 3. Highlight current active nav link & mobile action bar
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('.mobile-action-btn').forEach(btn => {
    const href = btn.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      btn.classList.add('active');
    }
  });

  // 4. Reveal on Scroll with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // 5. Menu Tab Filtering (on menu.html)
  const menuTabs = document.querySelectorAll('.menu-tab-btn');
  const menuCategories = document.querySelectorAll('.menu-category-section');

  if (menuTabs.length > 0 && menuCategories.length > 0) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetCategory = tab.getAttribute('data-category');

        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Smoothly center the active tab horizontally on mobile
        tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

        menuCategories.forEach(cat => {
          if (targetCategory === 'all' || cat.getAttribute('data-category') === targetCategory) {
            cat.style.display = 'block';
            setTimeout(() => { cat.style.opacity = '1'; }, 20);
          } else {
            cat.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Reservation Form Interactive Logic (on reservations.html)
  const bookingForm = document.getElementById('efren-booking-form');
  const radioTiles = document.querySelectorAll('.radio-tile');
  const seatingInput = document.getElementById('selected-seating');
  const modal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');

  // Radio tile selection
  if (radioTiles.length > 0) {
    radioTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        radioTiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        if (seatingInput) {
          seatingInput.value = tile.getAttribute('data-value');
        }
      });
    });
  }

  // Form submission & modal display
  if (bookingForm && modal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guest-name')?.value || 'Valued Guest';
      const date = document.getElementById('booking-date')?.value || 'Upcoming Evening';
      const time = document.getElementById('booking-time')?.value || '8:00 PM';
      const guests = document.getElementById('booking-guests')?.value || '2';
      const seating = seatingInput?.value || 'Hearthside Counter';

      // Fill confirmation details
      const summaryEl = document.getElementById('modal-summary');
      if (summaryEl) {
        summaryEl.innerHTML = `
          <strong>${escapeHtml(name)}</strong>, your table for <strong>${escapeHtml(guests)} Guests</strong> has been reserved for <strong>${escapeHtml(date)}</strong> at <strong>${escapeHtml(time)}</strong>.<br><br>
          <span style="color: var(--tarnished-brass);">Enclave: ${escapeHtml(seating)}</span><br>
          <small style="color: var(--text-muted); display: block; margin-top: 10px;">A formal confirmation SMS & bespoke concierge invitation has been dispatched to your contact details.</small>
        `;
      }

      modal.classList.add('open');
      bookingForm.reset();
      radioTiles.forEach((t, i) => {
        if (i === 0) t.classList.add('selected');
        else t.classList.remove('selected');
      });
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  // 7. Newsletter Dispatch Form
  const dispatchForm = document.getElementById('newsletter-form');
  if (dispatchForm) {
    dispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = dispatchForm.querySelector('input[type="email"]');
      if (input && input.value) {
        const btn = dispatchForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Enrolled ✦';
        btn.style.background = 'var(--corten-rust)';
        btn.style.color = '#fff';
        input.value = '';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 3500);
      }
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
