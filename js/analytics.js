(() => {
  const config = window.LOVYRN_CONFIG || {};
  const CONSENT_KEY = "lovyrn_analytics_consent";
  let gtmLoaded = false;
  let clarityLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.lovyrnTrack = (eventName, params = {}) => {
    window.dataLayer.push({ event: eventName, ...params });
  };

  function loadGTM() {
    if (gtmLoaded || !config.gtmId || config.gtmId.includes("XXXX")) return;
    gtmLoaded = true;
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',config.gtmId);
  }

  function loadClarity() {
    if (clarityLoaded || !config.clarityId || config.clarityId.includes("XXXX")) return;
    clarityLoaded = true;
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",config.clarityId);
  }

  function enableAnalytics() {
    loadGTM();
    loadClarity();
    window.lovyrnTrack("analytics_consent_granted");
  }

  window.lovyrnConsent = {
    get: () => localStorage.getItem(CONSENT_KEY),
    accept: () => { localStorage.setItem(CONSENT_KEY, "granted"); enableAnalytics(); },
    reject: () => { localStorage.setItem(CONSENT_KEY, "denied"); }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (window.lovyrnConsent.get() === "granted") enableAnalytics();

    document.querySelectorAll("[data-track]").forEach(el => {
      el.addEventListener("click", () => {
        const name = el.dataset.track;
        const params = {};
        if (el.dataset.cta) params.cta_name = el.dataset.cta;
        if (name) window.lovyrnTrack(name, params);
      });
    });

    const servicesLink = document.querySelector('a[href="services.html"]');
    if (servicesLink && location.pathname.endsWith("services.html")) {
      window.lovyrnTrack("view_services");
    }

    const form = document.querySelector("[data-form]");
    if (form) {
      let started = false;
      form.addEventListener("focusin", () => {
        if (!started) {
          started = true;
          window.lovyrnTrack("form_start");
        }
      });
    }

    if (location.pathname.endsWith("thank-you.html")) {
      window.lovyrnTrack("thank_you_view");
      if (sessionStorage.getItem("lovyrn_lead_confirmed") === "yes") {
        window.lovyrnTrack("generate_lead", { lead_source: "services_form" });
        sessionStorage.removeItem("lovyrn_lead_confirmed");
      }
    }
  });
})();
