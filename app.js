document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('mainNavbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. BILINGUAL LANGUAGE SWITCHER (TAMIL / ENGLISH)
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langLabel = document.getElementById('langLabel');
  let currentLang = 'EN';

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'EN' ? 'TA' : 'EN';
      if (currentLang === 'TA') {
        langLabel.textContent = 'English / TA';
        // Highlight Tamil subtitles
        document.querySelectorAll('.tamil-text').forEach(el => {
          el.style.color = '#FFB800';
          el.style.transform = 'scale(1.03)';
          el.style.transition = 'all 0.3s ease';
        });
      } else {
        langLabel.textContent = 'தமிழ் / EN';
        document.querySelectorAll('.tamil-text').forEach(el => {
          el.style.color = '';
          el.style.transform = '';
        });
      }
    });
  }

  // 3. PROJECT FILTERING LOGIC (CATEGORY TABS + SEARCH BAR)
  const categoryButtons = document.querySelectorAll('#projectCategoryTabs .tab-btn');
  const projectCards = document.querySelectorAll('#projectsGridContainer .project-card');

  function filterProjects(category = 'all', district = 'all', budget = 'all', status = 'all') {
    let matchCount = 0;
    projectCards.forEach(card => {
      const cardCategories = card.dataset.category || '';
      const cardDistrict = card.dataset.district || '';
      const cardBudget = card.dataset.budget || '';

      const matchCategory = (category === 'all') || cardCategories.includes(category);
      const matchDistrict = (district === 'all') || (cardDistrict === district);
      const matchBudget = (budget === 'all') || (cardBudget === budget);
      const matchStatus = (status === 'all') || (status === 'cctv-live' && cardCategories.includes('cctv-live'));

      if (matchCategory && matchDistrict && matchBudget && matchStatus) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        matchCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  }

  // Category Tab Click
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');
      filterProjects(category, 'all', 'all', 'all');
    });
  });

  // Search Filter Box Submit
  const filterSearchBtn = document.getElementById('filterSearchBtn');
  const searchDistrict = document.getElementById('searchDistrict');
  const searchType = document.getElementById('searchType');
  const searchBudget = document.getElementById('searchBudget');
  const searchStatus = document.getElementById('searchStatus');

  if (filterSearchBtn) {
    filterSearchBtn.addEventListener('click', () => {
      const districtVal = searchDistrict.value;
      const budgetVal = searchBudget.value;
      const statusVal = searchStatus.value;
      filterProjects('all', districtVal, budgetVal, statusVal);

      // Scroll smoothly to projects showcase
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // District Explorer Cards Click -> Filter & Scroll to Projects
  document.querySelectorAll('.filter-district-card').forEach(card => {
    card.addEventListener('click', () => {
      const district = card.getAttribute('data-district');
      if (searchDistrict) searchDistrict.value = district;
      filterProjects('all', district, 'all', 'all');
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 4. LIVE CCTV CAMERA SWITCHER & CLOCK TICKER
  const liveTimestampClock = document.getElementById('liveTimestampClock');
  if (liveTimestampClock) {
    setInterval(() => {
      const now = new Date();
      const formatted = now.toISOString().replace('T', ' ').substring(0, 19) + ' IST';
      liveTimestampClock.textContent = formatted;
    }, 1000);
  }

  const camButtons = document.querySelectorAll('.cctv-camera-selector .cam-btn');
  const cctvStreamVideo = document.getElementById('cctvStreamVideo');

  camButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      camButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const newVid = btn.getAttribute('data-vid');
      if (cctvStreamVideo && newVid) {
        cctvStreamVideo.style.opacity = '0.3';
        setTimeout(() => {
          cctvStreamVideo.src = newVid;
          cctvStreamVideo.play().catch(() => {});
          cctvStreamVideo.style.opacity = '1';
        }, 180);
      }
    });
  });

  // 5. LAND APPRECIATION & ROI CALCULATOR LOGIC
  const roiAmountSlider = document.getElementById('roiAmountSlider');
  const roiYearsSlider = document.getElementById('roiYearsSlider');
  const roiAmountLabel = document.getElementById('roiAmountLabel');
  const roiYearsLabel = document.getElementById('roiYearsLabel');
  const roiTotalValueDisplay = document.getElementById('roiTotalValueDisplay');
  const roiGainDisplay = document.getElementById('roiGainDisplay');

  function formatLakhsCrores(amount) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Crores`;
    }
    return `₹${(amount / 100000).toFixed(1)} Lakhs`;
  }

  function updateRoiCalculations() {
    if (!roiAmountSlider || !roiYearsSlider) return;

    const principal = parseFloat(roiAmountSlider.value);
    const years = parseInt(roiYearsSlider.value);
    const cagr = 0.178; // 17.8% annual compound growth rate

    const futureValue = principal * Math.pow(1 + cagr, years);
    const netGain = futureValue - principal;

    roiAmountLabel.textContent = formatLakhsCrores(principal);
    roiYearsLabel.textContent = `${years} Years`;

    roiTotalValueDisplay.textContent = formatLakhsCrores(futureValue);
    roiGainDisplay.textContent = `+${formatLakhsCrores(netGain)}`;
  }

  if (roiAmountSlider && roiYearsSlider) {
    roiAmountSlider.addEventListener('input', updateRoiCalculations);
    roiYearsSlider.addEventListener('input', updateRoiCalculations);
    updateRoiCalculations();
  }

  // 6. MODAL POPUPS (SITE VISIT / DRONE TOUR & CCTV PREVIEW)
  const siteVisitModal = document.getElementById('siteVisitModal');
  const cctvModal = document.getElementById('cctvModal');
  const cctvModalTitle = document.getElementById('cctvModalTitle');
  const modalProjectSelect = document.getElementById('modalProjectSelect');

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  // Open Site Visit Modal triggers
  document.querySelectorAll('.open-sitevisit-modal, #scheduleVisitHeaderBtn, #droneTourBtn, #drawerScheduleBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title');
      if (title && modalProjectSelect) {
        modalProjectSelect.value = `${title}`;
      }
      openModal(siteVisitModal);
      closeMobileDrawer();
    });
  });

  // Open CCTV Modal triggers
  const cctvModalVideo = document.getElementById('cctvModalVideo');
  document.querySelectorAll('.open-cctv-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title');
      if (cctvModalTitle && title) {
        cctvModalTitle.textContent = `${title} - Live Solar CCTV Feed`;
      }
      openModal(cctvModal);
      if (cctvModalVideo) {
        cctvModalVideo.play().catch(() => {});
      }
    });
  });

  // Close buttons & Overlay click
  document.querySelectorAll('.closeModalBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(siteVisitModal);
      closeModal(cctvModal);
      if (cctvModalVideo) cctvModalVideo.pause();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === siteVisitModal) closeModal(siteVisitModal);
    if (e.target === cctvModal) {
      closeModal(cctvModal);
      if (cctvModalVideo) cctvModalVideo.pause();
    }
  });

  // Schedule Form Submit Handler
  const scheduleForm = document.getElementById('scheduleForm');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your VIP Site Visit & 4K Live Drone Walkthrough appointment has been successfully scheduled with our Tamil Concierge team.');
      closeModal(siteVisitModal);
      scheduleForm.reset();
    });
  }

  // 7. MOBILE NAVIGATION DRAWER
  const mobileMenuOpen = document.getElementById('mobileMenuOpen');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
  }

  if (mobileMenuOpen) {
    mobileMenuOpen.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.add('active');
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileDrawer);
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });
});
