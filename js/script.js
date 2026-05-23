/*
  EXIM ADVICE - Interactive Web Engine
*/

document.addEventListener('DOMContentLoaded', () => {
  const CALENDLY_URL = 'https://calendly.com/testing-bot124/30min';
  
  // --- 1. Sticky Navigation Scroll Handler ---
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loads scrolled

  // --- 2. Mobile Hamburger Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 3. Scroll Trigger Animations (IntersectionObserver) ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If this element contains stat numbers, trigger count-up
        if (entry.target.classList.contains('welcome-stats')) {
          triggerStatsCounter();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => scrollObserver.observe(el));

  // --- 4. Staggered Animation Timing ---
  // Stagger Why Choose Us cards, Service cards, and Industry chips if not manually coded
  const staggerContainers = document.querySelectorAll('.why-grid, .services-grid, .industries-container');
  staggerContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, idx) => {
      child.style.transitionDelay = `${idx * 0.1}s`;
    });
  });

  // --- 5. Step Process Timeline Line Drawing ---
  const processTimeline = document.querySelector('.process-timeline');
  const progressLine = document.querySelector('.process-line-progress');
  const processSteps = document.querySelectorAll('.process-step');

  if (processTimeline && progressLine) {
    const handleTimelineScroll = () => {
      const rect = processTimeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far down the timeline is in the viewport
      const startTrigger = viewportHeight * 0.8;
      const endTrigger = viewportHeight * 0.2;
      
      const timelineHeight = rect.height;
      const timelineTop = rect.top;
      
      let progress = 0;
      if (timelineTop < startTrigger) {
        const scrolledDistance = startTrigger - timelineTop;
        const totalDistance = startTrigger - endTrigger + timelineHeight - viewportHeight * 0.4;
        progress = Math.min(Math.max((scrolledDistance / totalDistance) * 100, 0), 100);
      }
      
      progressLine.style.height = `${progress}%`;

      // Activate steps based on line position
      processSteps.forEach((step, index) => {
        const stepRect = step.getBoundingClientRect();
        if (stepRect.top < viewportHeight * 0.65) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll();
  }

  // --- 6. Stats Count Up Script ---
  let statsTriggered = false;
  function triggerStatsCounter() {
    if (statsTriggered) return;
    statsTriggered = true;
    
    const countElements = document.querySelectorAll('.stat-number[data-target]');
    countElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();
      
      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // EaseOutQuad formula
        const easedProgress = progress * (2 - progress);
        const currentValue = Math.floor(easedProgress * target);
        
        el.innerHTML = currentValue + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.innerHTML = target + suffix;
        }
      }
      
      requestAnimationFrame(updateCount);
    });
  }

  // --- 7. Testimonials Carousel ---
  const testimonials = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentTestimonialIdx = 0;
  let testimonialInterval = null;

  if (testimonials.length > 0) {
    const showTestimonial = (index) => {
      testimonials.forEach(card => card.classList.remove('active'));
      
      // Wrap index
      if (index >= testimonials.length) {
        currentTestimonialIdx = 0;
      } else if (index < 0) {
        currentTestimonialIdx = testimonials.length - 1;
      } else {
        currentTestimonialIdx = index;
      }
      
      testimonials[currentTestimonialIdx].classList.add('active');
    };

    const nextTestimonial = () => {
      showTestimonial(currentTestimonialIdx + 1);
    };

    const prevTestimonial = () => {
      showTestimonial(currentTestimonialIdx - 1);
    };

    const startCarouselTimer = () => {
      testimonialInterval = setInterval(nextTestimonial, 5000);
    };

    const resetCarouselTimer = () => {
      clearInterval(testimonialInterval);
      startCarouselTimer();
    };

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        prevTestimonial();
        resetCarouselTimer();
      });

      nextBtn.addEventListener('click', () => {
        nextTestimonial();
        resetCarouselTimer();
      });
    }

    // Auto load first slide and run timer
    showTestimonial(0);
    startCarouselTimer();
  }

  // --- 8. Floating Contact Widget (Bottom-Left) — Removed ---

  // --- 9. Standard Enroll Form Submission → Google Sheets ---
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL'; // Replace with your Apps Script Web App URL

  const enrollmentForm = document.getElementById('enrollment-form');
  if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = enrollmentForm.querySelector('button[type="submit"]');
      const spinner = submitBtn.querySelector('.spinner');
      const originalText = submitBtn.textContent.trim();

      if (spinner) spinner.style.display = 'inline-block';
      submitBtn.disabled = true;
      submitBtn.innerText = ' Processing Enrollment...';
      if (spinner) submitBtn.prepend(spinner);

      const formData = new FormData(enrollmentForm);
      const data = {};
      [
        ['fullname', 'e-fullname'], ['company', 'e-company'], ['mobile', 'e-mobile'],
        ['email', 'e-email'], ['city', 'e-city'], ['product', 'e-product'],
        ['business', 'e-business'], ['interest', 'e-interest'], ['target', 'e-target'],
        ['status', 'e-status'], ['requirement', 'e-requirement'], ['message', 'e-message']
      ].forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) data[key] = el.value;
      });

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        // Reset form and show success state
        enrollmentForm.reset();
        if (spinner) spinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerText = '✓ Application Submitted Successfully!';

        // Open Calendly popup with prefilled values (name, email, phone -> a1, company -> a2)
        try {
          const calendlyBase = CALENDLY_URL;
          const name = encodeURIComponent(data.fullname || '');
          const email = encodeURIComponent(data.email || '');
          const phone = encodeURIComponent(data.mobile || '');
          const company = encodeURIComponent(data.company || '');

          let calendlyUrl = `${calendlyBase}?name=${name}&email=${email}`;
          if (phone) calendlyUrl += `&a1=${phone}`;
          if (company) calendlyUrl += `&a2=${company}`;

          if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
            Calendly.initPopupWidget({ url: calendlyUrl });
          } else {
            // Fallback: open Calendly in a new tab
            window.open(calendlyUrl, '_blank', 'noopener');
          }
        } catch (err) {
          console.warn('Calendly prefill failed', err);
        }

        setTimeout(() => { submitBtn.innerText = originalText; }, 3000);
      } catch (err) {
        if (spinner) spinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submission Failed — Try Again';
        setTimeout(() => { submitBtn.innerText = originalText; }, 3000);
      }
    });
  }

  // --- 10. Trade Tools Controls (Tabs & Calculators) ---
  const tabButtons = document.querySelectorAll('.tools-tab-btn');
  const tabPanes = document.querySelectorAll('.tools-content-pane');

  if (tabButtons.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        const activePane = document.getElementById(targetTab);
        if (activePane) activePane.classList.add('active');
      });
    });
  }

  // --- 11. Live Currency Converter Engine ---
  let exchangeRates = {
    USD: 83.50,
    EUR: 90.35,
    GBP: 106.20,
    AED: 22.73,
    INR: 1.00
  };

  const converterAmount = document.getElementById('conv-amount');
  const converterFrom = document.getElementById('conv-from');
  const converterResult = document.getElementById('conv-result-val');
  const rateTimestamp = document.getElementById('rate-timestamp');

  // Fetch exchange rates from free open API
  async function fetchLiveRates() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      
      const inrRate = data.rates.INR;
      if (inrRate) {
        exchangeRates.USD = inrRate;
        exchangeRates.EUR = inrRate / data.rates.EUR;
        exchangeRates.GBP = inrRate / data.rates.GBP;
        exchangeRates.AED = inrRate / data.rates.AED;
        
        const updateDate = new Date(data.time_last_update_utc);
        if (rateTimestamp) {
          rateTimestamp.innerText = `Rates updated live: ${updateDate.toLocaleDateString()} ${updateDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live exchange rates. Using static backup rates.', err);
      if (rateTimestamp) {
        rateTimestamp.innerText = 'Using standard trade backup rates (updates daily)';
      }
    }
    // Perform initial calculations
    calculateConversion();
    calculateMargin();
  }

  function calculateConversion() {
    if (!converterAmount || !converterFrom || !converterResult) return;
    
    const amountVal = parseFloat(converterAmount.value);
    if (isNaN(amountVal) || amountVal <= 0) {
      converterResult.innerText = '₹ 0.00';
      return;
    }
    
    const currency = converterFrom.value;
    const rate = exchangeRates[currency] || 1;
    const inrValue = amountVal * rate;
    
    converterResult.innerText = `₹ ${inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (converterAmount && converterFrom) {
    converterAmount.addEventListener('input', calculateConversion);
    converterFrom.addEventListener('change', calculateConversion);
  }

  // --- 12. Export Margin & Commission Calculator Engine ---
  const calcGoodsCost = document.getElementById('calc-goods-cost');
  const calcLogistics = document.getElementById('calc-logistics');
  const calcCustoms = document.getElementById('calc-customs');
  const calcSaleCurrency = document.getElementById('calc-sale-currency');
  const calcSalePrice = document.getElementById('calc-sale-price');
  const calcCommissionSlider = document.getElementById('calc-commission-slider');
  const calcCommissionVal = document.getElementById('calc-commission-val');

  // Outputs
  const outTotalCost = document.getElementById('out-total-cost');
  const outRevenue = document.getElementById('out-revenue');
  const outGrossProfit = document.getElementById('out-gross-profit');
  const outCommission = document.getElementById('out-commission');
  const outNetProfit = document.getElementById('out-net-profit');
  const outMargin = document.getElementById('out-margin');

  function calculateMargin() {
    if (!calcGoodsCost || !calcSalePrice) return;

    // Fetch Inputs
    const goodsCost = parseFloat(calcGoodsCost.value) || 0;
    const logistics = parseFloat(calcLogistics.value) || 0;
    const customs = parseFloat(calcCustoms.value) || 0;
    
    const salePrice = parseFloat(calcSalePrice.value) || 0;
    const currency = calcSaleCurrency.value;
    const commissionPct = parseFloat(calcCommissionSlider.value) || 0;

    // Update Slider text
    if (calcCommissionVal) {
      calcCommissionVal.innerText = `${commissionPct}%`;
    }

    // Exchange rate conversion to INR
    const rate = exchangeRates[currency] || 1;
    
    // Core math
    const totalCostINR = goodsCost + logistics + customs;
    const grossRevenueINR = salePrice * rate;
    const grossProfitINR = grossRevenueINR - totalCostINR;
    
    const commissionINR = grossRevenueINR * (commissionPct / 100);
    const netProfitINR = grossProfitINR - commissionINR;
    
    let marginPct = 0;
    if (grossRevenueINR > 0) {
      marginPct = (netProfitINR / grossRevenueINR) * 100;
    }

    // Populate Outputs
    if (outTotalCost) outTotalCost.innerText = `₹ ${totalCostINR.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    if (outRevenue) outRevenue.innerText = `₹ ${grossRevenueINR.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    if (outGrossProfit) outGrossProfit.innerText = `₹ ${grossProfitINR.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    if (outCommission) outCommission.innerText = `₹ ${commissionINR.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    if (outNetProfit) {
      outNetProfit.innerText = `₹ ${netProfitINR.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
      // Style color if negative
      if (netProfitINR < 0) {
        outNetProfit.style.color = '#ef4444';
      } else {
        outNetProfit.style.color = '#38660c';
      }
    }
    
    if (outMargin) {
      outMargin.innerText = `${marginPct.toFixed(1)}%`;
      if (marginPct < 0) {
        outMargin.style.color = '#ef4444';
      } else {
        outMargin.style.color = '#38660c';
      }
    }
  }

  // Register Event Listeners for Calculator
  const calcInputsList = [
    calcGoodsCost, calcLogistics, calcCustoms, 
    calcSaleCurrency, calcSalePrice, calcCommissionSlider
  ];

  calcInputsList.forEach(input => {
    if (input) {
      input.addEventListener('input', calculateMargin);
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', calculateMargin);
      }
    }
  });

  // Call rates update initialization
  fetchLiveRates();

  // --- 13. Blog Category Filtering Logic ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (filterBtns.length > 0 && blogCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active state on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterCategory = btn.getAttribute('data-category');

        blogCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterCategory === 'all' || cardCategory === filterCategory) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

});
