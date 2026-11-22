/**
 * Kishore M - Personal Portfolio Script
 * Pure Vanilla JavaScript (Clean, Minimal, Performant)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- DOM Elements ---
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('themeToggle');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const toast = document.getElementById('toastNotification');
  const projectCards = document.querySelectorAll('.project-card');
  const projectGithubLinks = document.querySelectorAll('.project-github-link');
  const externalProfileLinks = document.querySelectorAll('.external-profile-link');
  const sections = document.querySelectorAll('section[id]');

  let toastTimeout = null;

  /**
   * Display a temporary toast notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (default: 3200ms)
   */
  function showToast(message, duration = 3000) {
    if (!toast) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toast.textContent = message;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /**
   * Helper function: Check if a URL is a placeholder
   * @param {string} url
   * @returns {boolean}
   */
  function isPlaceholderUrl(url) {
    if (!url) return true;
    const cleanUrl = url.trim().toUpperCase();
    return (
      cleanUrl === '' ||
      cleanUrl === '#' ||
      cleanUrl.startsWith('YOUR_') ||
      cleanUrl.includes('YOUR_BIZPILOT_GITHUB_URL') ||
      cleanUrl.includes('YOUR_DATA_WIPER_GITHUB_URL') ||
      cleanUrl.includes('YOUR_RESTAURANT_PROJECT_GITHUB_URL') ||
      cleanUrl.includes('YOUR_LEETCODE_URL')
    );
  }

  // ==========================================================================
  // 1. Theme Toggle (Dark & Light Theme - Initially Light Theme)
  // ==========================================================================
  const savedTheme = localStorage.getItem('portfolio-theme');

  // Initially default to light theme unless user previously toggled to dark
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
      themeToggle.setAttribute('title', 'Switch to light theme');
    }
  } else {
    // Ensure clean light theme by default
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      themeToggle.setAttribute('title', 'Switch to dark theme');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      if (isDark) {
        // Switch to Light Theme
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'light');
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        themeToggle.setAttribute('title', 'Switch to dark theme');
        showToast('Switched to Light Theme');
      } else {
        // Switch to Dark Theme
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('portfolio-theme', 'dark');
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
        themeToggle.setAttribute('title', 'Switch to light theme');
        showToast('Switched to Dark Theme');
      }
    });
  }

  // ==========================================================================
  // 2. Mobile Navigation Toggle & Accessibility
  // ==========================================================================
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a navigation item is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navToggle.classList.remove('open');
          navMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu if user clicks outside of navigation
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // ==========================================================================
  // 3. Header Shadow & Active Navigation Highlight on Scroll
  // ==========================================================================
  function handleScroll() {
    // Header shadow on scroll
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Detection
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ==========================================================================
  // 4. Projects GitHub Link Handling
  // ==========================================================================
  projectGithubLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');

      if (isPlaceholderUrl(url)) {
        e.preventDefault();
        showToast('Repository link placeholder: Replace with your actual GitHub URL in index.html');
      }
    });
  });

  projectCards.forEach((card) => {
    const cardRepoUrl = card.getAttribute('data-repo-url');
    const childLink = card.querySelector('.project-github-link');
    const url = cardRepoUrl || (childLink ? childLink.getAttribute('href') : null);

    if (!isPlaceholderUrl(url)) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-github-link')) return;
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    } else {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-github-link')) return;
        showToast('Repository link placeholder: Replace with your actual GitHub URL in index.html');
      });
    }
  });

  // ==========================================================================
  // 5. External Profile Links (LinkedIn, GitHub, LeetCode)
  // ==========================================================================
  externalProfileLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (isPlaceholderUrl(href)) {
        e.preventDefault();
        showToast('Profile link placeholder: Replace with your actual profile URL in index.html');
      }
    });
  });

  // ==========================================================================
  // 6. Clipboard Copy Helpers (Email & Phone)
  // ==========================================================================
  async function copyToClipboard(text, btnElement, successLabel, toastMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      const textSpan = btnElement.querySelector('span');
      if (textSpan) {
        const originalText = textSpan.textContent;
        textSpan.textContent = successLabel;
        showToast(toastMessage);

        setTimeout(() => {
          textSpan.textContent = originalText;
        }, 2200);
      }
    } catch (err) {
      showToast('Could not copy automatically. Please copy: ' + text);
    }
  }

  // Copy Email Button
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'kishoremari2901@gmail.com';
      copyToClipboard(email, copyEmailBtn, 'Copied!', 'Email address copied: ' + email);
    });
  }

  // Copy Phone Button
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phone = copyPhoneBtn.getAttribute('data-phone') || '+919363629878';
      copyToClipboard(phone, copyPhoneBtn, 'Copied!', 'Mobile number copied: ' + phone);
    });
  }
});
