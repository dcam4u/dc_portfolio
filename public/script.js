// Mobile menu toggle
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
}

// Close mobile menu when link is clicked
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Smooth reveal on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(".project-card, .tech-item, .soft-skill, .stat-card")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Back to Top Button
const backToTopBtn = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});

// Hide scroll indicator after scrolling
const scrollIndicator = document.querySelector(".scroll-indicator");

window.addEventListener("scroll", () => {
  if (scrollIndicator) {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = "0";
      scrollIndicator.style.pointerEvents = "none";
    } else {
      scrollIndicator.style.opacity = "0.7";
      scrollIndicator.style.pointerEvents = "auto";
    }
  }
});

// =============================================
// CONTACT FORM HANDLING
// =============================================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Get the submit button
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalBtnText = submitBtn.textContent;

    // Get form values
    const formData = {
      name: contactForm.querySelector("#name").value.trim(),
      email: contactForm.querySelector("#email").value.trim(),
      subject: contactForm.querySelector("#subject").value.trim(),
      message: contactForm.querySelector("#message").value.trim(),
    };

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      showFormMessage("Please fill in all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    // Show loading state
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      // Send data to our API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success!
        showFormMessage(
          "Thank you! Your message has been sent successfully.",
          "success"
        );
        contactForm.reset();
      } else {
        // Server returned an error
        showFormMessage(
          result.error || "Something went wrong. Please try again.",
          "error"
        );
      }
    } catch (error) {
      // Network error
      console.error("Form submission error:", error);
      showFormMessage(
        "Unable to send message. Please check your connection and try again.",
        "error"
      );
    } finally {
      // Reset button state
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// Helper function to show form messages
function showFormMessage(message, type) {
  // Remove any existing message
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const messageEl = document.createElement("div");
  messageEl.className = `form-message form-message-${type}`;
  messageEl.textContent = message;

  // Insert after the form
  contactForm.parentNode.insertBefore(messageEl, contactForm.nextSibling);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageEl.remove();
  }, 5000);
}
