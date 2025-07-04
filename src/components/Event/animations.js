export const animationStyles = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .animate-on-scroll.delay-100 {
    transition-delay: 0.1s;
  }

  .animate-on-scroll.delay-200 {
    transition-delay: 0.2s;
  }

  .animate-on-scroll.delay-300 {
    transition-delay: 0.3s;
  }

  .animate-on-scroll.delay-400 {
    transition-delay: 0.4s;
  }

  .animate-on-scroll.delay-500 {
    transition-delay: 0.5s;
  }

  .animate-on-scroll.delay-600 {
    transition-delay: 0.6s;
  }
`;

export const useScrollAnimation = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};
