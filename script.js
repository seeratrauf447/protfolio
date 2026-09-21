/* ==========================================================================
   SEERAT RAUF - PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Update footer copyright year
  document.getElementById('year').textContent = new Date().getFullYear();

  /* --------------------------------------------------------------------------
     1. CANVAS DYNAMIC PARTICLE MESH BACKGROUND
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  let mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
      this.color = '#06b6d4';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#06b6d4';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / interaction
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 - dist / 480})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* --------------------------------------------------------------------------
     2. DYNAMIC HERO TYPING ANIMATION
     -------------------------------------------------------------------------- */
  const typedTextElement = document.getElementById('typed-text');
  const roles = [
    "Software Developer",
    "Laravel & C# Backend Specialist",
    "Flutter Mobile Engineer",
    "BS Software Engineering Student"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
  }
  typeRole();

  /* --------------------------------------------------------------------------
     3. NAVBAR SCROLL EFFECT & MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  /* --------------------------------------------------------------------------
     4. STATS COUNTER ROLLUP ANIMATION
     -------------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const isFloat = target % 1 !== 0;
          let current = 0;
          const increment = target / 50;

          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = isFloat ? current.toFixed(1) : Math.ceil(current);
              setTimeout(updateCounter, 30);
            } else {
              counter.textContent = isFloat ? target.toFixed(1) : target;
            }
          };
          updateCounter();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) counterObserver.observe(statsRow);

  /* --------------------------------------------------------------------------
     5. SKILLS PROGRESS BARS ANIMATION
     -------------------------------------------------------------------------- */
  const progressBars = document.querySelectorAll('.progress-bar-fill');

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(bar => {
          const targetProgress = bar.getAttribute('data-progress');
          bar.style.width = targetProgress;
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillsObserver.observe(skillsSection);

  /* --------------------------------------------------------------------------
     6. LIVE CODE PREVIEW TAB SWITCHER
     -------------------------------------------------------------------------- */
  const codeContentElement = document.getElementById('code-content');
  const codeTabs = document.querySelectorAll('.code-tab-btn');

  const codeSnippets = {
    csharp: `<span class="token-kw">using</span> System;
<span class="token-kw">namespace</span> <span class="token-cls">Portfolio.Controllers</span>
{
    <span class="token-kw">public class</span> <span class="token-cls">DeveloperController</span>
    {
        <span class="token-kw">public string</span> Name { <span class="token-kw">get</span>; } = <span class="token-str">"Seerat Rauf"</span>;
        <span class="token-kw">public string</span> Degree { <span class="token-kw">get</span>; } = <span class="token-str">"BS Software Engineering"</span>;
        
        <span class="token-kw">public void</span> <span class="token-fn">ExecuteBuild</span>() 
        {
            Console.<span class="token-fn">WriteLine</span>(<span class="token-str">"Building clean, maintainable software systems..."</span>);
        }
    }
}`,
    laravel: `<span class="token-kw">&lt;?php</span>
<span class="token-kw">namespace</span> App\\Http\\Controllers;
<span class="token-kw">use</span> App\\Models\\Notification;

<span class="token-kw">class</span> <span class="token-cls">EventNotifierController</span> <span class="token-kw">extends</span> Controller
{
    <span class="token-kw">public function</span> <span class="token-fn">broadcastNotice</span>($title, $department)
    {
        <span class="token-cm">// Broadcast COMSATS University campus announcement</span>
        <span class="token-kw">return</span> Notification::<span class="token-fn">create</span>([
            <span class="token-str">'title'</span> => $title,
            <span class="token-str">'department'</span> => $department,
            <span class="token-str">'status'</span> => <span class="token-str">'published'</span>
        ]);
    }
}`,
    flutter: `<span class="token-kw">import</span> <span class="token-str">'package:flutter/material.dart'</span>;

<span class="token-kw">class</span> <span class="token-cls">BmiCalculator</span> <span class="token-kw">extends</span> StatelessWidget {
  <span class="token-kw">final</span> double weightKg;
  <span class="token-kw">final</span> double heightCm;

  <span class="token-cls">BmiCalculator</span>({<span class="token-kw">required</span> <span class="token-kw">this</span>.weightKg, <span class="token-kw">required</span> <span class="token-kw">this</span>.heightCm});

  double <span class="token-fn">calculateBmi</span>() {
    double heightMeters = heightCm / 100;
    <span class="token-kw">return</span> weightKg / (heightMeters * heightMeters);
  }
}`
  };

  // Set default code snippet
  codeContentElement.innerHTML = `<pre><code>${codeSnippets.csharp}</code></pre>`;

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const snippetKey = tab.getAttribute('data-tab');
      codeContentElement.innerHTML = `<pre><code>${codeSnippets[snippetKey]}</code></pre>`;
    });
  });

  /* --------------------------------------------------------------------------
     7. PROJECTS FILTER LOGIC
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'slideInRight 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     8. INTERACTIVE PROJECT LIVE DEMO MODALS
     -------------------------------------------------------------------------- */
  const demoModal = document.getElementById('demo-modal');
  const closeDemoBtn = document.getElementById('close-demo-btn');
  const demoTitle = document.getElementById('demo-title');
  const demoModalBody = document.getElementById('demo-modal-body');

  const demoButtons = document.querySelectorAll('.open-demo-btn');

  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoType = btn.getAttribute('data-demo');
      loadDemoWidget(demoType);
      demoModal.classList.add('active');
    });
  });

  closeDemoBtn.addEventListener('click', () => {
    demoModal.classList.remove('active');
  });

  function loadDemoWidget(type) {
    if (type === 'quiz') {
      demoTitle.innerHTML = '<i class="fa-solid fa-brain text-cyan"></i> Interactive Quiz Game Demo';
      demoModalBody.innerHTML = `
        <div class="quiz-widget">
          <div id="quiz-container">
            <h4 id="quiz-question" style="font-size: 1.15rem; margin-bottom: 1rem;">1. What does OOP stand for in Software Engineering?</h4>
            <div id="quiz-options">
              <button class="quiz-option-btn" onclick="checkQuizAnswer(this, false)">A. Operational Output Procedure</button>
              <button class="quiz-option-btn" onclick="checkQuizAnswer(this, true)">B. Object-Oriented Programming</button>
              <button class="quiz-option-btn" onclick="checkQuizAnswer(this, false)">C. Online Order Processing</button>
              <button class="quiz-option-btn" onclick="checkQuizAnswer(this, false)">D. Overloaded Object Protocol</button>
            </div>
            <div id="quiz-feedback" style="margin-top: 1rem; font-weight: 600;"></div>
          </div>
        </div>
      `;
    } else if (type === 'bmi') {
      demoTitle.innerHTML = '<i class="fa-solid fa-weight-scale text-cyan"></i> Flutter BMI Calculator Demo';
      demoModalBody.innerHTML = `
        <div class="glass-card" style="padding: 1.5rem; background: var(--bg-tertiary);">
          <div class="form-group">
            <label class="form-label">Weight (kg)</label>
            <input type="number" id="bmi-weight" class="form-input" value="62" placeholder="e.g. 62">
          </div>
          <div class="form-group">
            <label class="form-label">Height (cm)</label>
            <input type="number" id="bmi-height" class="form-input" value="168" placeholder="e.g. 168">
          </div>
          <button class="btn btn-primary" onclick="calculateBmiDemo()" style="width: 100%;">
            <i class="fa-solid fa-calculator"></i> Calculate BMI
          </button>

          <div id="bmi-result" style="margin-top: 1.5rem; text-align: center; display: none;">
            <h4 style="font-size: 1.8rem; color: var(--accent-cyan);" id="bmi-val">22.0</h4>
            <p id="bmi-status" style="font-weight: 600; color: var(--accent-emerald);">Normal Weight</p>
          </div>
        </div>
      `;
    } else if (type === 'booking') {
      demoTitle.innerHTML = '<i class="fa-solid fa-calendar-check text-cyan"></i> Event Booking App Simulator';
      demoModalBody.innerHTML = `
        <div class="glass-card" style="padding: 1.5rem; background: var(--bg-tertiary);">
          <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">COMSATS Annual Tech Summit 2026</h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
            <i class="fa-solid fa-location-dot"></i> Vehari Campus Auditorium | Oct 15, 2026
          </p>
          <div class="form-group">
            <label class="form-label">Number of Tickets</label>
            <input type="number" id="ticket-count" class="form-input" value="2" min="1" max="10" onchange="updateBookingTotal()">
          </div>
          <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">
            Total Price: <span id="ticket-total" style="color: var(--accent-cyan);">$0 (Free Student Pass)</span>
          </p>
          <button class="btn btn-primary" onclick="confirmEventBooking()" style="width: 100%;">
            <i class="fa-solid fa-check-circle"></i> Reserve Seats Now
          </button>
        </div>
      `;
    } else if (type === 'notifier') {
      demoTitle.innerHTML = '<i class="fa-solid fa-bell text-cyan"></i> COMSATS Event Notifier Demo';
      demoModalBody.innerHTML = `
        <div class="glass-card" style="padding: 1.5rem; background: var(--bg-tertiary);">
          <h4 style="margin-bottom: 1rem;">Broadcast New Announcement</h4>
          <div class="form-group">
            <label class="form-label">Event Title</label>
            <input type="text" id="notice-title" class="form-input" value="Software Engineering Project Presentation">
          </div>
          <div class="form-group">
            <label class="form-label">Target Department</label>
            <select id="notice-dept" class="form-input">
              <option>Computer Science & SE</option>
              <option>Electrical Engineering</option>
              <option>Management Sciences</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="publishNoticeDemo()" style="width: 100%;">
            <i class="fa-solid fa-paper-plane"></i> Publish Notification
          </button>
        </div>
      `;
    } else if (type === 'weather') {
      demoTitle.innerHTML = '<i class="fa-solid fa-cloud-sun text-cyan"></i> Weather App Forecast Demo';
      demoModalBody.innerHTML = `
        <div class="glass-card" style="padding: 1.5rem; background: var(--bg-tertiary); text-align: center;">
          <div style="font-size: 3.5rem; color: var(--accent-amber); margin-bottom: 0.5rem;">
            <i class="fa-solid fa-sun"></i>
          </div>
          <h3 style="font-size: 1.8rem;">Burewala, Pakistan</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">Sunny & Clear Skies</p>
          <h2 style="font-size: 2.8rem; color: var(--accent-cyan); margin-bottom: 1.5rem;">31°C</h2>

          <div style="display: flex; justify-content: space-around; border-top: 1px solid var(--border-glass); padding-top: 1rem;">
            <div><strong>Humidity</strong><br><span style="color: var(--text-secondary);">45%</span></div>
            <div><strong>Wind</strong><br><span style="color: var(--text-secondary);">12 km/h</span></div>
            <div><strong>UV Index</strong><br><span style="color: var(--text-secondary);">Low (3)</span></div>
          </div>
        </div>
      `;
    }
  }

  // Quiz helper global handler
  window.checkQuizAnswer = function(button, isCorrect) {
    const parent = button.parentElement;
    const buttons = parent.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    const feedback = document.getElementById('quiz-feedback');
    if (isCorrect) {
      button.classList.add('correct');
      feedback.innerHTML = '<span style="color: var(--accent-emerald);"><i class="fa-solid fa-circle-check"></i> Correct! Object-Oriented Programming is the core paradigm.</span>';
    } else {
      button.classList.add('incorrect');
      feedback.innerHTML = '<span style="color: var(--accent-coral);"><i class="fa-solid fa-circle-xmark"></i> Incorrect. Option B is the right answer!</span>';
    }
  };

  // BMI helper global handler
  window.calculateBmiDemo = function() {
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    const resultBox = document.getElementById('bmi-result');
    const valEl = document.getElementById('bmi-val');
    const statusEl = document.getElementById('bmi-status');

    if (!weight || !height) return;

    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
    resultBox.style.display = 'block';
    valEl.textContent = bmi;

    if (bmi < 18.5) {
      statusEl.textContent = 'Underweight';
      statusEl.style.color = 'var(--accent-amber)';
    } else if (bmi <= 24.9) {
      statusEl.textContent = 'Normal Healthy Weight';
      statusEl.style.color = 'var(--accent-emerald)';
    } else {
      statusEl.textContent = 'Overweight';
      statusEl.style.color = 'var(--accent-coral)';
    }
  };

  // Booking helper
  window.confirmEventBooking = function() {
    showToast('Seats reserved successfully! Confirmation sent.');
    demoModal.classList.remove('active');
  };

  // Notifier helper
  window.publishNoticeDemo = function() {
    showToast('Campus Notification Broadcasted to Students!');
    demoModal.classList.remove('active');
  };

  /* --------------------------------------------------------------------------
     9. RESUME MODAL HANDLERS
     -------------------------------------------------------------------------- */
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');

  openResumeBtn.addEventListener('click', () => {
    resumeModal.classList.add('active');
  });

  closeResumeBtn.addEventListener('click', () => {
    resumeModal.classList.remove('active');
  });

  /* --------------------------------------------------------------------------
     10. THEME SWITCHER (DARK / LIGHT MODE)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      localStorage.setItem('theme', 'light');
      showToast('Switched to Light Ambient Theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem('theme', 'dark');
      showToast('Switched to Dark Cyberpunk Theme');
    }
  });

  /* --------------------------------------------------------------------------
     11. COPY TO CLIPBOARD & TOAST NOTIFICATIONS
     -------------------------------------------------------------------------- */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-cyan"></i> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  document.getElementById('copy-email-chip').addEventListener('click', () => {
    navigator.clipboard.writeText('seeratrauf1040@gmail.com');
    showToast('Email address copied to clipboard!');
  });

  document.getElementById('copy-phone-chip').addEventListener('click', () => {
    navigator.clipboard.writeText('0313 6992115');
    showToast('Phone number copied to clipboard!');
  });

  /* --------------------------------------------------------------------------
     12. SILENT BACKGROUND EMAIL SUBMISSION TO SEERATRAUF1040@GMAIL.COM
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('sender-name').value;
    const email = document.getElementById('sender-email').value;
    const message = document.getElementById('sender-message').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    fetch('https://formsubmit.co/ajax/seeratrauf1040@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: `New Portfolio Message from ${name}`
      })
    })
    .then(response => response.json())
    .then(data => {
      showToast(`Thank you, ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    })
    .catch(error => {
      showToast(`Thank you, ${name}! Your message has been sent.`);
      contactForm.reset();
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    });
  });
});
