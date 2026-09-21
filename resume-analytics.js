// resume-analytics.js
// Fires one `resume_open` event when a resume page is opened directly.
// Used by resume_v2.html and everything under /resumes/ so a recruiter opening
// a tailored resume shows up as a funnel event instead of an anonymous hit.
// The visitor's path is the property, so no per-file configuration is needed.
// Silent no-op when the analytics beacon is blocked or the file is opened
// offline (e.g. as an email attachment).
(function () {
  const track = (name, data) => {
    try {
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      window.va('event', { name: name, data: data || {} });
    } catch (err) {
      // Never let tracking interfere with the document
    }
  };

  const resumeLabel = () => {
    const path = location.pathname.replace(/^\/+/, '');
    if (!path || path === 'resume_v2.html') return 'canonical';
    return path
      .replace(/^resumes\//, '')
      .replace(/\.html$/, '');
  };

  const fire = () => track('resume_open', { resume: resumeLabel(), method: 'page_view' });

  if (document.readyState === 'complete') {
    fire();
  } else {
    window.addEventListener('load', fire);
  }
})();
