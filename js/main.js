(() => {
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".primary-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("open", !open);
      });
      nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }

    const banner = document.querySelector("[data-consent-banner]");
    const showBanner = () => {
      if (banner && !window.lovyrnConsent.get()) banner.hidden = false;
    };
    const hideBanner = () => { if (banner) banner.hidden = true; };
    showBanner();

    document.querySelectorAll("[data-consent]").forEach(button => {
      button.addEventListener("click", () => {
        if (button.dataset.consent === "accept") window.lovyrnConsent.accept();
        else window.lovyrnConsent.reject();
        hideBanner();
      });
    });

    document.querySelectorAll(".privacy-settings").forEach(button => {
      button.addEventListener("click", () => {
        if (banner) banner.hidden = false;
      });
    });

    const form = document.querySelector("[data-form]");
    if (form) {
      form.addEventListener("submit", async event => {
        event.preventDefault();
        const status = document.querySelector("[data-form-status]");
        const submit = form.querySelector('button[type="submit"]');
        const config = window.LOVYRN_CONFIG || {};
        if (!config.formEndpoint || config.formEndpoint.includes("REPLACE_ME")) {
          status.textContent = "The form is not connected yet. We will configure its submission service during the next setup step.";
          return;
        }
        submit.disabled = true;
        status.textContent = "Sending your inquiry…";
        try {
          const response = await fetch(config.formEndpoint, {
            method: "POST",
            body: new FormData(form),
            headers: { "Accept": "application/json" }
          });
          if (!response.ok) throw new Error("Submission failed");
          sessionStorage.setItem("lovyrn_lead_confirmed", "yes");
          window.location.href = "thank-you.html";
        } catch (error) {
          status.textContent = "Something went wrong. Please try again or contact us by email.";
          submit.disabled = false;
        }
      });
    }
  });
})();
