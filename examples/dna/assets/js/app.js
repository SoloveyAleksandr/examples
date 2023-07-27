document.addEventListener("DOMContentLoaded", () => {

  class ModalFeedback {
    constructor(container) {
      this.container = container;
      this.bg = this.container.querySelector(".modal-feedback__bg");
      this.closeBtn = this.container.querySelector(".modal-feedback-form__close-btn");
      this.form = this.container.querySelector(".modal-feedback-form");
      this.isOpen = false;

      if (this.container && this.bg && this.closeBtn && this.form) {
        this.init();
      }
    }

    init() {
      this.closeBtn.addEventListener("click", this.close.bind(this));
      this.bg.addEventListener("click", this.close.bind(this));
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.form.classList.add("_send");
      })
    }

    open() {
      this.isOpen = true;
      this.container.classList.add("_active");
    }

    close() {
      this.isOpen = false;
      this.container.classList.remove("_active");
      this.form.classList.remove("_send");
    }
  }

  class StoryController {
    constructor(container) {
      this.container = container;
      this.btn = this.container.querySelector(".main-slider-story__btn");
      this.title = this.container.querySelector(".main-slider-story__title");
      this.text = this.container.querySelector(".main-slider-story__text");

      if (this.container && this.btn && this.title && this.text) {
        this.init();
      }
    }

    init() {
      this.btn.addEventListener("click", this.close.bind(this));
    }

    setInfo(title, story) {
      this.title.textContent = title ? title.textContent : "";
      this.text.innerHTML = story ? story.innerHTML : "";
    }

    open() {
      this.container.classList.add("_active");
    }

    close() {
      this.container.classList.remove("_active");
    }
  }

  class StoryItem {
    constructor(container, controller) {
      this.container = container;
      this.controller = controller
      this.btn = this.container.querySelector(".main-slider-swiper-slide__link");
      this.title = this.container.querySelector(".main-slider-swiper-slide__title");
      this.story = this.container.querySelector(".main-slider-swiper-slide__story");

      if (this.container && this.btn && this.title && this.story) {
        this.init();
      }
    }

    init() {
      this.btn.addEventListener("click", () => {
        this.controller.setInfo(this.title, this.story);
        this.controller.open();
      });
    }
  }

  class Counter {
    constructor(container) {
      this.container = container;
      this.decBtn = this.container.querySelector(".product-form-counter__btn_decrement");
      this.incBtn = this.container.querySelector(".product-form-counter__btn_increment");
      this.value = this.container.querySelector(".product-form-counter__value");
      this.input = this.container.querySelector(".product-form-counter__input");
      // this.priceContainer = priceContainer;
      // this.price = this.priceContainer.getAttribute("data-price") || 0;

      if (this.container && this.decBtn && this.incBtn && this.value && this.input) {
        this.init();
      }
    }

    init() {
      this.incBtn.addEventListener("click", this.increment.bind(this));
      this.decBtn.addEventListener("click", this.decrement.bind(this));
      this.setValue();
    }

    increment() {
      this.input.value = Number(this.input.value) + 1;
      this.setValue();
    }

    decrement() {
      if (Number(this.input.value) > 1) {
        this.input.value = Number(this.input.value) - 1;
      }
      this.setValue();
    }

    setValue() {
      this.value.textContent = this.input.value;
      // this.priceContainer.textContent = Number(this.input.value) * Number(this.price);
    }
  }

  class RadioBtn {
    constructor(container, btnsList) {
      this.container = container;
      this.input = this.container.querySelector("input");
      this.btnsList = btnsList;

      if (this.container && this.input) {
        this.init();
      }
    }

    init() {
      this.input.addEventListener("input", this.inputHandler.bind(this));
      if (this.input.checked) {
        this.container.classList.add("_checked");
      } else {
        this.container.classList.remove("_checked");
      }
    }

    inputHandler() {
      this.btnsList.forEach(btn => {
        if (btn.input.checked) {
          btn.container.classList.add("_checked");
        } else {
          btn.container.classList.remove("_checked");
        }
      });
    }
  }

  SmoothScroll({
    // Время скролла 400 = 0.4 секунды
    animationTime: 800,
    // Размер шага в пикселях 
    stepSize: 60,

    // Дополнительные настройки:

    // Ускорение 
    accelerationDelta: 30,
    // Максимальное ускорение
    accelerationMax: 2,

    // Поддержка клавиатуры
    keyboardSupport: true,
    // Шаг скролла стрелками на клавиатуре в пикселях
    arrowScroll: 50,

    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,

    // Поддержка тачпада
    touchpadSupport: true,
  })

  if (document.querySelector(".main-top") && window.matchMedia("(min-width: 1024px)").matches) {
    const mainTopWrapper = document.querySelector(".main-top-wrapper");
    const mainTop = mainTopWrapper.querySelector(".main-top");

    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: mainTopWrapper,
        scrub: 0,
        pin: true,
        end: "300%",
      }
    })
      .to(mainTop, {
        duration: 1,
        ease: "none",
        x: -1 * (mainTop.scrollWidth - mainTopWrapper.clientWidth) + "px",
      });

    const mobileTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-top-mobile",
        start: "left right",
        end: "right right",
        containerAnimation: mainTL,
        // markers: true,
      }
    })
      .from(".main-top-mobile-list__item_1", {
        opacity: 0,
        y: "-50%",
        duration: 1.5,
        delay: 1,
      }, "sin")
      .from(".main-top-mobile-list__item_2", {
        opacity: 0,
        y: "50%",
        duration: 1.5,
        delay: 1.5,
      }, "sin")

    const boxTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-top-test-box_1",
        start: "left 80%",
        end: "right 80%",
        scrub: true,
        containerAnimation: mainTL,
        // markers: true,
      }
    })
      .from(".main-top-test-box__img_7", {
        opacity: 0,
        y: "50%",
        duration: 1,
      })
      .from(".main-top-test-box__img_6", {
        opacity: 0,
        y: "-50%",
        duration: 1,
      })
      .from(".main-top-test-box__img_5", {
        opacity: 0,
        y: "-50%",
        duration: 1,
      })
      .from(".main-top-test-box__img_4", {
        opacity: 0,
        y: "-50%",
        duration: 1,
      })

    const testMobileTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-top-test-box_2",
        start: "20% right",
        end: "right right",
        containerAnimation: mainTL,
        scrub: true,
        // markers: true,
      }
    })
      .from(".main-top-test-box__img_1", {
        opacity: 0,
        y: "-50%",
        duration: 1,
      }, "sin")
      .from(".main-top-test-box__img_2", {
        opacity: 0,
        y: "50%",
        duration: 1,
        delay: 0.5,
      }, "sin")
      .from(".main-top-test-box__img_3", {
        opacity: 0,
        y: "-50%",
        duration: 1,
        delay: 1,
      }, "sin")

    // const delayTL = gsap.timeline({
    //   duration: 0.2,
    // })
    // mainTL.add(delayTL);
  }

  if (document.querySelector(".main-about-wrapper") && window.matchMedia("(min-width: 1024px)").matches) {

    const mainAboutWrapper = document.querySelector(".main-about-wrapper");
    const mainAboutTimeline = mainAboutWrapper.querySelector(".main-about-timeline__fill");

    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: mainAboutWrapper,
        scrub: 0,
        pin: true,
        end: "900%",
        onUpdate: self => mainAboutTimeline.style.width = `${self.progress * 100}%`
      }
    })

    mainTL.to(".main-about-slide_1", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_1 .main-about-box_1").offsetWidth - mainAboutWrapper.clientWidth) + "px",
    })
    mainTL.to(".main-about-slide_2", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_2 .main-about-box_2").offsetWidth) + "px",
      onComplete: () => document.querySelector(".main-about-slide__number_2").classList.add("_active"),
      onStart: () => document.querySelector(".main-about-slide__number_2").classList.remove("_active"),
    })
    mainTL.to(".main-about-slide_3", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_3 .main-about-box_3").offsetWidth) + "px",
      onComplete: () => document.querySelector(".main-about-slide__number_3").classList.add("_active"),
      onStart: () => document.querySelector(".main-about-slide__number_3").classList.remove("_active"),
    })
    mainTL.to(".main-about-slide_4", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_4 .main-about-box_4").offsetWidth) + "px",
      onComplete: () => document.querySelector(".main-about-slide__number_4").classList.add("_active"),
      onStart: () => document.querySelector(".main-about-slide__number_4").classList.remove("_active"),
    })

    mainTL.to(".main-about-slide_5", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_5 .main-about-box_5").offsetWidth) + "px",
      onComplete: () => document.querySelector(".main-about-slide__number_5").classList.add("_active"),
      onStart: () => document.querySelector(".main-about-slide__number_5").classList.remove("_active"),
    })
    mainTL.to(".main-about-slide_6", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_6 .main-about-box_6").offsetWidth) + "px",
      onComplete: () => document.querySelector(".main-about-slide__number_6").classList.add("_active"),
      onStart: () => document.querySelector(".main-about-slide__number_6").classList.remove("_active"),
    })
    mainTL.to(".main-about-slide_7", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_7 .main-about-box_7").offsetWidth) + "px",
      onComplete: () => document.querySelector(".main-about-slide__number_7").classList.add("_active"),
      onStart: () => document.querySelector(".main-about-slide__number_7").classList.remove("_active"),
    })
    mainTL.to(".main-about-slide_8", {
      duration: 1,
      ease: "none",
      x: -1 * (document.querySelector(".main-about-slide_8 .main-about-box_8").offsetWidth) + "px",
    })

    const delayTL = gsap.timeline({
      duration: 0.2,
    })
    mainTL.add(delayTL);
  } else if (document.querySelector(".main-about-wrapper") && window.matchMedia("(max-width: 1023px)").matches) {
    const template = document.querySelector(".main-about-wrapper template").content.cloneNode(true);
    const templateSwiper = template.querySelector(".main-about-swiper-wrapper");

    const mainSection = document.querySelector(".main-about");

    const slides = gsap.utils.toArray(".main-about-slide");
    const fragment = document.createDocumentFragment();

    slides.forEach((slide, index) => {
      if (index === 0) {
        template.querySelector(".main-about__title").innerHTML = slide.querySelector(".main-about__title").innerHTML;
      } else {
        const newSlide = template.querySelector(".main-about-swiper-slide").cloneNode(true);
        const newSlideContainer = newSlide.querySelector(".main-about-swiper-slide__container");

        newSlideContainer.appendChild(slide.querySelector(".main-about-slide__number"));
        newSlideContainer.appendChild(slide.querySelector(".main-about__subtitle"));
        newSlideContainer.appendChild(slide.querySelector(".main-about__description"));
        newSlide.appendChild(slide.querySelector(".main-about-box-img"));

        fragment.appendChild(newSlide);
      }
    })

    mainSection.innerHTML = "";
    templateSwiper.innerHTML = "";
    templateSwiper.appendChild(fragment);
    mainSection.appendChild(template);

    new Swiper(".main-about-swiper", {
      speed: 800,
      autoHeight: true,
      navigation: {
        nextEl: '.main-about-swiper-btns__bnt_next',
        prevEl: '.main-about-swiper-btns__bnt_prev',
      },
      effect: "creative",
      creativeEffect: {
        prev: {
          // will set `translateZ(-400px)` on previous slides
          translate: [0, 0, -400],
        },
        next: {
          // will set `translateX(100%)` on next slides
          translate: ['100%', 0, 0],
        },
      },
    })
  }

  const mainSlider = document.querySelector(".main-slider");
  if (mainSlider) {
    const swiper = new Swiper('.main-slider-swiper', {
      speed: 1000,
      navigation: {
        nextEl: ".main-slider .main-slider__btn_next",
        prevEl: ".main-slider .main-slider__btn_prev",
      },
    });

    const storyContainer = mainSlider.querySelector(".main-slider-story");

    const storyController = new StoryController(storyContainer);

    const slides = mainSlider.querySelectorAll(".main-slider-swiper-slide");
    slides.forEach(slide => new StoryItem(slide, storyController));
  }

  if (document.querySelector(".header")) {
    class Menu {
      constructor(btn, profileBtn, menu) {
        this.btn = document.querySelector(btn);
        this.menu = document.querySelector(menu);
        this.profileBtn = document.querySelector(profileBtn)
        this.isOpen = false;

        if (this.btn) {
          this.init();
        }
      }

      init() {
        this.btn.addEventListener("click", this.handleClick.bind(this));
      }

      handleClick() {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      }

      open() {
        this.btn.classList.add("_active");
        this.profileBtn.classList.add("_active");
        this.menu.classList.add("_active");
        this.isOpen = true;
      }

      close() {
        this.btn.classList.remove("_active");
        this.profileBtn.classList.remove("_active");
        this.menu.classList.remove("_active");
        this.isOpen = false;
      }
    }

    new Menu(".header-nav-btns__btn_burger", ".header-nav-btns__btn_profile", ".menu");
  }

  const footer = document.querySelector(".footer");
  if (footer && window.matchMedia("(max-width: 1023px)").matches) {
    const container = footer.querySelector(".footer-container");
    const fragment = document.createDocumentFragment();
    const logo = footer.querySelector(".footer-logo").cloneNode(true);
    const nav = footer.querySelector(".footer-nav").cloneNode(true);
    const contacts = footer.querySelector(".footer-contacts").cloneNode(true);
    const legal = footer.querySelector(".footer-legal").cloneNode(true);
    const btn = footer.querySelector(".footer-right__btn").cloneNode(true);
    const list = footer.querySelector(".footer-right-list").cloneNode(true);

    container.innerHTML = "";
    fragment.appendChild(logo);
    fragment.appendChild(nav);
    fragment.appendChild(contacts);
    fragment.appendChild(legal);
    fragment.appendChild(btn);
    fragment.appendChild(list);

    container.appendChild(fragment);
  }

  const startWindowSize = window.innerWidth;

  const breakpoints = [480, 744, 1023, 1920];
  let maxBreakpoint = Infinity;
  let minBreakpoint = 0;

  for (let i = 0; i < breakpoints.length; i++) {
    if (startWindowSize < breakpoints[i]) {
      maxBreakpoint = breakpoints[i];
      break;
    }
  }

  for (let i = breakpoints.length - 1; i > -1; i--) {
    if (startWindowSize > breakpoints[i]) {
      minBreakpoint = breakpoints[i];
      break;
    }
  }

  if (breakpoints.includes(startWindowSize)) {
    maxBreakpoint = startWindowSize;
  }

  window.addEventListener("resize", (e) => {
    if (e.target.innerWidth >= maxBreakpoint || e.target.innerWidth <= minBreakpoint || e.target.innerWidth >= startWindowSize * 1.1 || e.target.innerWidth <= startWindowSize * 0.9) {
      location.reload();
    }
  })

  const aboutWrapper = document.querySelector(".about-wrapper");
  const aboutContent = document.querySelector(".about");

  if (aboutWrapper && aboutContent && window.matchMedia("(min-width: 1024px)").matches) {
    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: aboutWrapper,
        scrub: 0,
        pin: true,
        end: "500%"
      }
    });

    mainTL.to(aboutContent, {
      x: -1 * (aboutContent.scrollWidth - aboutWrapper.offsetWidth) + "px",
      duration: 1,
    })
    const delayTL = gsap.timeline({
      duration: 0.2,
    })
    mainTL.add(delayTL);

    const infoListTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-info",
        start: "50% right",
        end: "right left",
        containerAnimation: mainTL,
      }
    })
    const infoListTitles = gsap.utils.toArray(".about-info-list__title");
    const infoListTexts = gsap.utils.toArray(".about-info-list__text");
    infoListTitles.forEach((item, index) => {
      infoListTL.from(item, {
        opacity: 0,
        x: "100%",
        duration: 1,
        delay: index * 0.5,
      }, "sin")
    });
    infoListTexts.forEach((item, index) => {
      infoListTL.from(item, {
        opacity: 0,
        y: "100%",
        duration: 1,
        delay: index * 0.3,
      }, "sin_2")
    });
  }

  if (aboutContent && window.matchMedia("(max-width: 1023px)").matches) {
    new Swiper(".about-team-list-wrapper", {
      slidesPerView: "auto",
      freeMode: true,
      speed: 500,
    })
  }

  const dnaAnim = document.querySelector(".dna-anim");
  if (dnaAnim) {
    const fragment = document.createDocumentFragment();
    const dnaItem = dnaAnim.querySelector(".dna-anim__box");

    const startColor = {
      r: 50,
      g: 168,
      b: 158,
    };
    const endColor = {
      r: 89,
      g: 168,
      b: 244,
    }

    const dnaCount = Math.round(dnaAnim.offsetHeight / (window.matchMedia("(min-width: 481px)").matches ? 50 : 25));

    for (let i = 0; i < dnaCount; i++) {
      const item = dnaItem.cloneNode(true);
      const spin_1 = item.querySelector(".dna-anim__item_left");
      const spin_2 = item.querySelector(".dna-anim__item_right");

      spin_1.style.animationDelay = (i + 1) * -1200 + 'ms';
      spin_2.style.animationDelay = (i + 1) * -1200 + 'ms';
      spin_1.style.backgroundColor = `rgb(${startColor.r + ((endColor.r - startColor.r) / 20 * i)}, 168, ${startColor.b + ((endColor.b - startColor.b) / 20 * i)})`;
      spin_2.style.backgroundColor = `rgb(${startColor.r + ((endColor.r - startColor.r) / 20 * i)}, 168, ${startColor.b + ((endColor.b - startColor.b) / 20 * i)})`;

      fragment.appendChild(item);
    }

    dnaAnim.appendChild(fragment);
  }

  const modalFeedback = document.querySelector(".modal-feedback");
  if (modalFeedback) {
    const modal = new ModalFeedback(modalFeedback);

    const btns = document.querySelectorAll("[data-modal-feedback]");
    btns.forEach(btn => {
      btn.addEventListener("click", () => modal.open());
    })
  }

  const productSlider = document.querySelector(".product__slider");
  if (productSlider) {
    const navContainer = productSlider.querySelector(".product-nav");

    const navSwiper = new Swiper(navContainer, {
      allowTouchMove: false,
      // spaceBetween: 15,
      speed: 800,
      freeMode: true,
      watchSlidesProgress: true,
      slidesPerView: 4,
      breakpoints: {
        1024: {
          slidesPerView: 5
        }
      }
    });

    const photoContainer = productSlider.querySelector(".product-photo");
    const nextBtn = photoContainer.querySelector(".product-photo__btn_next");
    const prevBtn = photoContainer.querySelector(".product-photo__btn_prev");

    const photoSwiper = new Swiper(photoContainer, {
      allowTouchMove: false,
      spaceBetween: 100,
      speed: 800,
      loop: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      thumbs: {
        swiper: navSwiper,
      },
    });

    photoSwiper.slides.forEach(slide => {
      const newSlide = slide.cloneNode(true);
      newSlide.className = "swiper-slide product-nav__item";

      navSwiper.appendSlide(newSlide);
      // console.log(newSlide);
    })
  }

  const productForm = document.querySelector(".product-form");
  if (productForm) {
    const counter = productForm.querySelector(".product-form-counter");
    // const price = productForm.querySelector(".product-form__price");
    new Counter(counter);

    const typeItems = productForm.querySelectorAll(".product-form-type__item");
    typeItems.forEach(item => {
      const radioBtns = item.querySelectorAll(".product-form-type__label");
      const btnsList = [];
      radioBtns.forEach(btn => btnsList.push(new RadioBtn(btn, btnsList)));
    });
  }

});

window.onload = () => {
  const spinner = document.querySelector(".spinner");
  if (spinner) {
    spinner.addEventListener("animationend", () => {
      document.body.classList.remove("_hidden");
      spinner.style.display = "none";
    })
    spinner.classList.add("_hidden");
  }
}