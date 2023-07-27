import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// document.body.style.overflow = "hidden";

document.addEventListener("DOMContentLoaded", () => {

  let progress = 0;
  let itemsToLoad = 0;
  let loadedItems = 0;

  const loaderContainer = document.querySelector(".loader");
  const loaderFill = document.querySelector(".loader-fill");
  const loaderPercent = document.querySelector(".loader__percent");
  const images = document.querySelectorAll("img");
  itemsToLoad += images.length;

  Fancybox.bind("[data-fancybox]", {});

  SmoothScroll({
    // Время скролла 400 = 0.4 секунды
    animationTime: 1000,
    // Размер шага в пикселях 
    stepSize: 60,

    // Дополнительные настройки:

    // Ускорение 
    accelerationDelta: 60,
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

  class MediaController {
    constructor(items, typeSwiper, imagesSwiper, dateSwiper) {
      this.items = items;
      this.typeSwiper = typeSwiper;
      this.imagesSwiper = imagesSwiper;
      this.dateSwiper = dateSwiper;
      this.activeIndex = null;

      if (this.items && this.typeSwiper && this.imagesSwiper && this.dateSwiper) {
        this.init();
      }
    }

    init() {
      (() => {
        const typeFragment = document.createDocumentFragment();
        const imagesFragment = document.createDocumentFragment();
        const dateFragment = document.createDocumentFragment();
        this.items.forEach((item, i) => {
          const typeSlide = item.querySelector(".main-media-type__item").cloneNode(true);
          const imagesSlide = item.querySelector(".main-media-images__item").cloneNode(true);
          const dateSlide = item.querySelector(".main-media-date__item").cloneNode(true);
          typeFragment.appendChild(typeSlide);
          imagesFragment.appendChild(imagesSlide);
          dateFragment.appendChild(dateSlide);

          const btn = item.querySelector(".main-media-item__btn");
          btn.addEventListener("click", (e) => this.changeSlide.call(this, e, i));
          imagesSlide.addEventListener("click", (e) => this.changeSlide.call(this, e, i));
        });
        this.typeSwiper.wrapperEl.innerHtml = "";
        this.typeSwiper.appendSlide(typeFragment);
        this.imagesSwiper.wrapperEl.innerHtml = "";
        this.imagesSwiper.appendSlide(imagesFragment);
        this.dateSwiper.wrapperEl.innerHtml = "";
        this.dateSwiper.appendSlide(dateFragment);
      })();
      this.typeSwiper.slideTo(0);
      this.imagesSwiper.slideTo(0);
      this.dateSwiper.slideTo(0);
      this.items[0].classList.add("_active");
      this.activeIndex = 0;
    }

    changeSlide(e, index) {
      if (this.activeIndex === index) {

      } else {
        e.preventDefault();
        this.items.forEach((item, i) => {
          if (index === i) {
            item.classList.add("_active");
          } else {
            item.classList.remove("_active");
          }
        });
        this.typeSwiper.slideTo(index);
        this.imagesSwiper.slideTo(index);
        this.dateSwiper.slideTo(index);
        this.activeIndex = index;
      }
    }
  }

  class HeaderController {
    constructor(timeline) {
      this.timeline = timeline;
      this.prevScroll = 0;

      if (this.timeline) {
        this.init();
      }
    }

    init() {
      document.addEventListener("scroll", this.scrollHandler.bind(this));
    }

    scrollHandler() {
      if (window.scrollY > this.prevScroll && window.innerWidth > 960 && !header.classList.contains("_active")) {
        this.hide();
      } else {
        this.show();
      }
      this.prevScroll = window.scrollY;
    }

    hide() {
      this.timeline.play();
    }

    show() {
      this.timeline.reverse();
    }

  }

  class ServiceCase {
    constructor(container) {
      this.container = container;
      this.processContainer = this.container.querySelector(".service-case-process__list");
      this.processWrapper = this.container.querySelector(".service-case-process__list .swiper-wrapper");
      this.processSwiper = null;
      this.processBtn = this.container.querySelector(".service-case-process-btn");
      this.processBtnCount = this.processBtn.querySelector(".service-case-process-btn__count");
      this.processItems = [];
      this.extraContainer = this.container.querySelector(".service-case__extra");
      this.extraIsActive = false;
      this.hiddenProcces = 0;

      if (this.container && this.processContainer && this.processWrapper && this.processBtn && this.processBtnCount && this.extraContainer) {
        this.init();
      }
    }

    init() {
      this.processSwiper = new Swiper(this.processContainer, {
        slidesPerView: "auto",
        freeMode: true,
        enabled: true,
        breakpoints: {
          961: {
            enabled: false,
          }
        }
      });
      this.processSwiper.slides.forEach(slide => {
        const item = {
          original: slide,
          clone: slide.cloneNode(true),
        }
        this.extraContainer.appendChild(item.clone);
        this.processItems.push(item);
      });

      this.processBtn.addEventListener("click", this.btnHandler.bind(this));

      this.processHandler();
      window.addEventListener("resize", this.processHandler.bind(this));
    }

    processHandler() {
      this.hiddenProcces = 0;
      this.showBtn();

      const rows = [];
      let prevTop = null;
      let limitIndex = null;

      for (let i = 0; i < this.processSwiper.slides.length; i++) {
        const currenTop = Math.round(this.processSwiper.slides[i].getBoundingClientRect().top);
        if (prevTop === null) {
          prevTop = currenTop;
          rows.push(currenTop);
        } else {
          if (currenTop > prevTop) {
            prevTop = currenTop;
            rows.push(currenTop);
          }
        }

        if (rows.length > 2 && i > 1) {
          limitIndex = i - 1;
          break;
        } else {
          this.setVisible(true, i);
        }
      }

      if (limitIndex !== null) {
        for (let i = limitIndex; i < this.processSwiper.slides.length; i++) {
          this.hiddenProcces += 1;
          this.showBtn();
          this.setVisible(false, i);
        }
      } else {
        this.hideBtn();
      }
    }

    setVisible(bool, index) {
      if (bool) {
        this.processItems[index].original.classList.remove("_hidden");
        this.processItems[index].clone.classList.add("_hidden");
      } else {
        this.processItems[index].original.classList.add("_hidden");
        this.processItems[index].clone.classList.remove("_hidden");
      }
    }

    showBtn() {
      this.processBtn.classList.remove("_hidden");
      this.processBtnCount.textContent = "+ " + this.hiddenProcces;
    }

    hideBtn() {
      this.processBtn.classList.add("_hidden");
    }

    btnHandler() {
      if (this.extraIsActive) {
        this.closeExtra();
      } else {
        this.openExtra();
      }
    }

    openExtra() {
      this.extraIsActive = true;
      this.extraContainer.classList.add("_active");
      this.processBtn.classList.add("_active");
    }

    closeExtra() {
      this.extraIsActive = false;
      this.extraContainer.classList.remove("_active");
      this.processBtn.classList.remove("_active");
    }
  }

  class ServiceProcessItem {
    constructor(container, controller) {
      this.container = container;
      this.btn = this.container.querySelector(".service-process-item-btn");
      this.isActive = false;
      this.controller = controller;

      if (this.container && this.btn) {
        this.init();
      }
    }

    init() {
      if (this.controller) {
        this.controller.items.push(this);
        this.btn.addEventListener("click", () => this.controller.setActive(this));
      } else {
        this.btn.addEventListener("click", this.handleClick.bind(this));
      }
    }

    handleClick() {
      if (this.isActive) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isActive = true;
      this.container.classList.add("_active");
    }

    close() {
      this.isActive = false;
      this.container.classList.remove("_active");
    }
  }

  class ServiceProcessController {
    constructor() {
      this.items = [];
    }

    setActive(targetItem) {
      if (targetItem.isActive) {
        targetItem.close();
      } else {
        this.items.forEach(item => {
          if (item === targetItem) {
            item.open();
          } else {
            item.close();
          }
        });
      }
    }
  }

  class SwiperController {
    constructor(swiper, btns) {
      this.swiper = swiper;
      this.btns = btns;

      if (this.swiper && this.btns) {
        this.init();
      }
    }

    init() {
      this.btns.forEach((btn, i) => {
        btn.addEventListener("click", this.slideTo.bind(this, i));
      });

      this.slideTo(0);
    }

    slideTo(index) {
      this.btns.forEach((btn, i) => {
        if (index === i) {
          btn.classList.add("_active");
          this.swiper.slideTo(index);
        } else {
          btn.classList.remove("_active");
        }
      });
    }
  }

  class FormInput {
    constructor(container) {
      this.container = container;
      this.input = this.container.querySelector(".career-form-item__input");
      this.placeholder = this.container.querySelector(".career-form-item__placeholder");
      this.isFileInput = false;
      this.isSelectInput = false;
      this.fileName = null;
      this.btn = null;
      this.isOpen = false;

      if (this.container && this.input) {
        this.init();
      }
    }

    init() {
      if (this.container.classList.contains("career-form-item_file")) {
        this.isFileInput = true;
        this.fileName = this.container.querySelector(".career-form-item__file");
        this.btn = this.container.querySelector(".career-form-item__btn");
      }

      if (this.container.classList.contains("career-form-item_select")) {
        this.isSelectInput = true;
        this.fileName = this.container.querySelector(".career-form-item__file");
        this.selectBtns = this.container.querySelectorAll(".career-form-item-select__btn");
        this.selectBtns.forEach(item => {
          const value = item.getAttribute("data-value") ?? item.textContent;
          item.addEventListener("click", this.selectHandler.bind(this, value, item.textContent));
        })
      }

      if (this.isFileInput) {
        this.input.addEventListener("input", this.fileHandler.bind(this));
        this.btn.addEventListener("click", this.resetFile.bind(this));
      } else if (this.isSelectInput) {
        this.placeholder.addEventListener("click", this.clickHandler.bind(this));
      } else {
        this.input.addEventListener("focus", this.focusHandler.bind(this));
        this.input.addEventListener("blur", this.blurHandler.bind(this));
      }
    }

    focusHandler() {
      if (this.input.value.trim() === "") {
        this.container.classList.add("_focus");
      }
    }

    blurHandler() {
      if (this.input.value.trim() === "") {
        this.container.classList.remove("_focus");
      }
    }

    clickHandler() {
      if (this.isOpen) {
        this.isOpen = false;
        this.container.classList.remove("_open");
      } else {
        this.isOpen = true;
        this.container.classList.add("_open");
      }
    }

    fileHandler() {
      if (this.input.files.length > 0) {
        this.fileName.textContent = this.input.files[0].name;
        this.container.classList.add("_file");
      } else {
        this.container.classList.remove("_file");
      }
    }

    selectHandler(value, text) {
      this.input.value = value;
      this.fileName.textContent = text;
      this.isOpen = false;
      this.container.classList.remove("_open");
      this.container.classList.add("_file");
    }

    resetFile() {
      this.input.value = "";
      this.fileName.textContent = "";
      this.container.classList.remove("_file");
    }
  }

  class FormErrorHandler {
    constructor(form) {
      this.form = form;
      this.inputs = this.form.querySelectorAll(".career-form-item[data-required] .career-form-item__input");
      this.sendHandler = this.form.getAttribute("data-send-handler");
      this.hasError = false;

      if (this.form) {
        this.init();
      }
    }

    init() {
      this.form.addEventListener("submit", (e) => this.submitHandler.call(this, e));
    }

    submitHandler(e) {
      e.preventDefault();

      this.hasError = false;

      this.inputs.forEach(input => {
        if (input.value.trim() === "") {
          this.hasError = true;
          input.parentElement.classList.add("_error");
        } else {
          input.parentElement.classList.remove("_error");
        }
      });

      if (this.sendHandler !== null && !this.hasError) {
        this.form.classList.add("_sent");
      }
    }
  }

  class Menu {
    constructor(container, navItems, btn, header) {
      this.container = container;
      this.navContainer = this.container.querySelector(".menu__nav");
      this.mavItems = navItems;
      this.btn = btn;
      this.header = header;
      this.isActive = false;

      if (this.container && this.btn && this.header) {
        this.init();
      }
    }

    init() {
      let navFragment = document.createDocumentFragment();
      this.mavItems.forEach(item => {
        navFragment.appendChild(item);
      });
      this.navContainer.appendChild(navFragment);

      this.btn.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick() {
      if (this.isActive) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isActive = true;
      this.container.classList.add("_active");
      this.btn.classList.add("_active");
      this.header.classList.add("_active");
    }

    close() {
      this.isActive = false;
      this.container.classList.remove("_active");
      this.btn.classList.remove("_active");
      this.header.classList.remove("_active");
    }
  }

  const header = document.querySelector(".header");
  const menuContainer = document.querySelector(".menu");
  const menuBtn = document.querySelector(".header-btn");
  if (header && menuContainer && menuBtn) {
    const items = header.querySelectorAll(".header-anim");

    const tl = gsap.timeline({
      paused: true,
      delay: 1
    });

    items.forEach(item => {
      tl.to(item, {
        y: "-5rem",
        duration: 0.5,
      }, "-=0.4");
    });

    tl.to(header, {
      y: "-100%",
      duration: 0.8,
    }, "-=0.2");

    new HeaderController(tl);

    const navItems = [...document.querySelectorAll(".header-nav__link")].map(item => item.cloneNode(true));
    new Menu(menuContainer, navItems, menuBtn, header);
  }

  const pageHeadTag = document.querySelectorAll(".page-head-tag");
  pageHeadTag.forEach(container => {
    new Swiper(container, {
      slidesPerView: "auto",
      freeMode: true,
      speed: 5000,
      disableOnInteraction: false,
      autoplay: {
        delay: 0,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      },
    })
  });

  const formItems = document.querySelectorAll(".career-form-item");
  formItems.forEach(item => new FormInput(item));

  const formErrorHandlers = document.querySelectorAll("[data-erorr-handler]");
  formErrorHandlers.forEach(item => new FormErrorHandler(item));

  const mainProjectsSwiper = document.querySelector(".main-projects__swiper");
  if (mainProjectsSwiper) {
    const swiper = new Swiper(mainProjectsSwiper, {
      slidesPerView: "auto",
      freeMode: true,
      speed: 20000,
      disableOnInteraction: false,
      loop: true,
      autoplay: {
        delay: 0,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      },
    });
  }

  const mainServiceSwiper = document.querySelector(".main-service__swiper");
  if (mainServiceSwiper) {
    const swiper = new Swiper(mainServiceSwiper, {
      slidesPerView: "auto",
      freeMode: true,
      speed: 25000,
      enable: true,
      autoplay: {
        delay: 0,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      },
      breakpoints: {
        961: {
          autoplay: false,
          enable: false,
        }
      }
    });
  }

  const mainApporch = document.querySelector(".main-apporch");
  if (mainApporch) {
    const container = mainApporch.querySelector(".main-apporch__container");
    const text = mainApporch.querySelector(".main-apporch__text");
    const subtitleList = mainApporch.querySelectorAll(".main-apporch__anim");
    // const innerList = mainApporch.querySelectorAll(".main-apporch-info__inner");
    const link = mainApporch.querySelector(".main-apporch-link");

    const TL = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
      }
    });

    subtitleList.forEach(item => {
      const childe = item.children[0];
      TL.from(childe, {
        y: "100%",
        duration: 1,
        ease: "none",
      }, "sin")
    });

    TL.to(link, {
      opacity: 1,
      duration: 2,
      ease: "none",
    }, "sin");

    const textTL = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "110% 80%",
        scrub: true,
      }
    });


    [...text.children].forEach(childe => {
      const fragment = document.createDocumentFragment();
      childe.innerText.split("").forEach(letter => {
        const newItem = document.createElement("span");
        newItem.innerText = letter;

        textTL.to(newItem, {
          color: "rgba(255, 255, 255, 1)",
        })

        fragment.appendChild(newItem);
      })
      childe.innerHTML = "";
      childe.appendChild(fragment);
    })

  }

  const mainMedia = document.querySelector(".main-media");
  if (mainMedia) {
    const container = mainMedia.querySelector(".main-media__container");

    const items = mainMedia.querySelectorAll(".main-media-item");
    const typeContainer = mainMedia.querySelector(".main-media-type");
    const imagesContainer = mainMedia.querySelector(".main-media-images");
    const dateContainer = mainMedia.querySelector(".main-media-date");

    if (typeContainer && imagesContainer && dateContainer) {
      const typeSwiper = new Swiper(typeContainer, {
        allowTouchMove: false,
        speed: 800,
        direction: "vertical",
      });
      const imagesSwiper = new Swiper(imagesContainer, {
        allowTouchMove: false,
        speed: 800,
        effect: "creative",
        creativeEffect: {
          prev: {
            translate: ["110%", 0, -1],
          },
          next: {
            translate: ["-110%", 0, 0],
          },
        },
      });
      const dateSwiper = new Swiper(dateContainer, {
        allowTouchMove: false,
        speed: 800,
        direction: "vertical",
      });

      new MediaController(items, typeSwiper, imagesSwiper, dateSwiper);

      const animItems = mainMedia.querySelectorAll(".main-media__anim");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        }
      });

      animItems.forEach(item => {
        tl.from(item.children[0], {
          y: "110%",
          duration: 0.5,
          ease: "none",
        }, "sin");
      })
    }
  }

  // Page head canvas
  const pageHeadImg = document.querySelector(".page-head__img");
  const canvas = document.getElementById("page-head-canvas");
  if (canvas && pageHeadImg) {
    const dataService = pageHeadImg.getAttribute("data-service");
    const dataSphere = pageHeadImg.getAttribute("data-sphere");
    const dataPipe = pageHeadImg.getAttribute("data-pipe");

    let width = pageHeadImg.offsetWidth;
    let height = pageHeadImg.offsetHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      context: canvas.getContext("webgl1"),
      antialias: true,
      alpha: true
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    camera.position.z = 5;

    const clock = new THREE.Clock();

    const loader = new GLTFLoader();

    let mixer;
    let sphere;
    let pipe;
    let serviceModel;

    if (dataSphere !== null) {
      itemsToLoad += 1;
      const wrapper = new THREE.Group();
      wrapper.rotation.z = -0.3;

      const material = new THREE.MeshStandardMaterial({
        color: "#002df5",
        emissive: "#000535",
        roughness: 0.5,
        metalness: 0.3,
      });

      const lightTop = new THREE.PointLight("#ffffff", 2);
      lightTop.position.set(-5, 15, 0);
      lightTop.castShadow = true;
      scene.add(lightTop);

      const lightBottom = new THREE.PointLight("#ffffff", 2);
      lightBottom.position.set(10, -10, 0);
      lightBottom.castShadow = true;
      scene.add(lightBottom);

      const ambientLight = new THREE.AmbientLight("#ffffff", 1);
      scene.add(ambientLight);

      loader.load("assets/models/sphere-1/sphere-1.glb", function (gltf) {
        sphere = gltf.scene;
        sphere.scale.set(1.6, 1.6, 1.6);

        sphere.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child;
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.needsUpdate = true;
          }
        });

        wrapper.add(sphere);
        scene.add(wrapper);

        itemLoad();

      }, undefined, function (error) {

        console.error(error);
        itemLoad();
      });
    }

    if (dataPipe !== null) {
      itemsToLoad += 1;

      const material = new THREE.MeshStandardMaterial({
        color: "#a0a0a0",
        emissive: "#2c2c2c",
        roughness: 0.3,
        metalness: 0.8,
      });

      const lightBottom = new THREE.PointLight("#ffffff", 5);
      lightBottom.position.set(5, -5, 5);
      lightBottom.castShadow = true;
      scene.add(lightBottom);

      const lightTop = new THREE.PointLight("#ffffff", 2);
      lightTop.position.set(-5, 5, 0);
      lightTop.castShadow = true;
      scene.add(lightTop);

      const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
      scene.add(ambientLight);

      loader.load("assets/models/pipe-1/pipe-1.glb", function (gltf) {
        pipe = gltf.scene;
        pipe.scale.set(0.5, 0.5, 0.5);

        pipe.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child;
            child.material = material;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(pipe);

        itemLoad();

      }, undefined, function (error) {

        console.error(error);
        itemLoad();
      });
    }

    if (dataService !== null) {
      itemsToLoad += 1;

      const lightBack = new THREE.DirectionalLight("#580058", 1);
      lightBack.position.set(0, 5, -5);
      lightBack.castShadow = true;
      scene.add(lightBack);

      const lightFront = new THREE.DirectionalLight("#ffffff", 2);
      lightFront.position.set(0, 2, 10);
      lightFront.castShadow = true;
      scene.add(lightFront);

      const lightBottom = new THREE.DirectionalLight("#9e5d9e", 1);
      lightBottom.position.set(2, -10, 2);
      lightBottom.castShadow = true;
      scene.add(lightBottom);

      const ambientLight = new THREE.AmbientLight("#000000", 1);
      scene.add(ambientLight);

      loader.load("assets/models/service/service.gltf", function (gltf) {
        serviceModel = gltf.scene;
        serviceModel.scale.set(0.9, 0.9, 0.9);

        // console.log(serviceModel);

        const cubeMat = new THREE.MeshStandardMaterial({
          color: "#ffbb00",
          emissive: "#000000",
          roughness: 0.1,
          metalness: 0.4,
          transparent: true,
          opacity: 0.9,
          flatShading: true,
        });

        const coinMat = new THREE.MeshStandardMaterial({
          color: "#550055",
          emissive: "#000000",
          roughness: 0.1,
          metalness: 0.4,
        });

        serviceModel.children[0].traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = cubeMat;
            child.material.needsUpdate = true;
          }
        });

        serviceModel.children[1].traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = coinMat;
            child.material.needsUpdate = true;
          }
        });

        mixer = new THREE.AnimationMixer(serviceModel);

        for (let i = 0; i < gltf.animations.length; i++) {
          const clip = gltf.animations[i];

          THREE.AnimationUtils.makeClipAdditive(clip);

          const action = mixer.clipAction(clip);

          action.play();
        }
        scene.add(serviceModel);

        itemLoad();
      }, undefined, function (error) {

        console.error(error);
        itemLoad();
      });
    }

    function animate() {
      requestAnimationFrame(animate);

      if (sphere) {
        sphere.rotation.x += 0.005;
      }

      if (pipe) {
        pipe.rotation.x += 0.005;
      }

      if (mixer) {
        const mixerUpdateDelta = clock.getDelta();
        mixer.update(mixerUpdateDelta);
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

    function onWindowResize() {
      width = pageHeadImg.offsetWidth;
      height = pageHeadImg.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onWindowResize)
  }

  const worksProjects = document.querySelector(".works-projects");
  if (worksProjects) {
    const items = worksProjects.querySelectorAll(".works-projects-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: worksProjects,
        start: "top 80%",
      }
    });

    items.forEach(item => {
      const anim = item.querySelectorAll(".works-projects-item__anim");

      anim.forEach(j => {
        tl.from(j, {
          y: "5rem",
          opacity: 0,
          duration: 1,
        }, "-=0.8");
      });
    });
  }

  const projectImages = document.querySelectorAll(".project-images");
  projectImages.forEach(container => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
      }
    });

    const items = container.querySelectorAll(".project-images__img img");
    items.forEach((img, i) => {
      tl.from(img, {
        y: "-100%",
        duration: 1.5,
      }, `${i !== 0 && "-=1.1"}`)
    })
  })

  const dataParalax = document.querySelectorAll("[data-paralax]");
  dataParalax.forEach(container => {
    new Parallax(container);
  });

  const serviceCases = document.querySelector(".service-cases");
  if (serviceCases) {
    const caseList = serviceCases.querySelectorAll(".service-case");
    caseList.forEach(item => new ServiceCase(item));

    const navSwiper = new Swiper(".service-cases-nav", {
      slidesPerView: "auto",
      freeMode: true,
      watchSlidesProgress: true,
    });

    const tipesSwiper = new Swiper(".service-cases-types", {
      allowTouchMove: false,
      autoHeight: true,
      thumbs: {
        swiper: navSwiper,
      },
      effect: "fade",
      speed: 0,
    });
  }

  const serviceProcessContainer = document.querySelector(".service-process");
  if (serviceProcessContainer) {
    const title = serviceProcessContainer.querySelector(".service-process__title");
    const text = serviceProcessContainer.querySelector(".service-process__text");
    const items = document.querySelectorAll(".service-process-item");

    const tl = gsap.timeline({
      delay: 1,
      scrollTrigger: {
        trigger: serviceProcessContainer,
        start: "top 80%",
      }
    });

    tl.from(title, {
      y: "100%",
      duration: 1,
    }, "sin");

    tl.from(text, {
      y: "100%",
      duration: 1,
    }, "sin");

    const contoller = new ServiceProcessController();
    items.forEach(item => {
      new ServiceProcessItem(item, contoller);
      tl.from(item, {
        y: "100%",
        duration: 1,
      }, "sin");
    });
  }

  const agencyAbout = document.querySelector(".agency-about");
  if (agencyAbout) {
    const title = agencyAbout.querySelector(".agency-about__title");
    const text = agencyAbout.querySelector(".agency-about__text");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: agencyAbout,
        start: "top 80%",
      }
    });

    tl.from(title, {
      y: "100%",
      duration: 1,
    }, "sin");

    tl.from(text, {
      y: "100%",
      duration: 1,
    }, "sin");
  }

  const agencyAreas = document.querySelector(".agency-areas");
  const agencySolutions = document.querySelector(".agency-solutions");

  if (agencyAreas) {
    const text = agencyAreas.querySelector(".agency-areas__description");
    const list = agencyAreas.querySelector(".agency-areas__list");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: agencySolutions ? agencySolutions : agencyAreas,
        start: "top 80%",
      }
    });

    tl.from(text, {
      y: "100%",
      duration: 1,
    }, "sin");

    tl.from(list, {
      y: "100%",
      duration: 1,
    }, "sin");
  }

  if (agencySolutions) {
    const swiperContainer = agencySolutions.querySelector(".agency-solutions__list");
    new Swiper(swiperContainer, {
      freeMode: true,
      slidesPerView: "auto"
    });

    const title = agencySolutions.querySelector(".agency-solutions__title");
    const items = agencySolutions.querySelectorAll(".agency-solutions-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: agencySolutions,
        start: "top 80%",
      }
    });

    tl.from(title, {
      y: "100%",
      duration: 1,
    }, "sin");

    items.forEach((item, i) => {
      tl.from(item, {
        y: "100%",
        duration: 1,
        delay: 0.1 * i,
      }, "sin");
    })
  }

  const agencyTeam = document.querySelector(".agency-team");
  if (agencyTeam) {
    const swiperContainer = agencyTeam.querySelector(".agency-team__swiper");
    const title = agencyTeam.querySelector(".agency-team__title");

    const swiper = new Swiper(swiperContainer, {
      slidesPerView: "auto",
      freeMode: true,
      speed: 15000,
      disableOnInteraction: false,
      loop: true,
      autoplay: {
        delay: 0,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      },
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: agencyTeam,
        start: "top 80%",
      }
    });

    tl.from(swiperContainer, {
      x: "100%",
      duration: 1,
    }, "sin");

    tl.from(title, {
      y: "100%",
      duration: 1,
    }, "sin");
  }

  const agencyApporch = document.querySelector(".agency-apporch");
  const agencyCeo = document.querySelector(".agency-ceo");
  if (agencyApporch && agencyCeo) {
    const animItems = agencyApporch.querySelectorAll(".anim-container");
    const img = agencyCeo.querySelector(".agency-ceo__img img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: agencyApporch,
        start: "top 20%",
      }
    });

    animItems.forEach(item => {
      tl.from(item.children[0], {
        y: "100%",
        duration: 1,
      }, "sin");
    });

    tl.from(img, {
      y: "20%",
      duration: 1,
    }, "sin");
  }

  const agencyManagement = document.querySelector(".agency-management");
  if (agencyManagement) {
    const animItems = agencyManagement.querySelectorAll(".anim-container");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: agencyManagement,
        start: "bottom bottom",
      }
    });

    animItems.forEach(item => {
      tl.from(item.children[0], {
        y: "100%",
        duration: 1,
      }, "sin");
    });
  }

  const careerCase = document.querySelector(".career-case");
  if (careerCase) {
    const navBtns = careerCase.querySelectorAll(".career-case-nav__btn");
    const swiperContainer = careerCase.querySelector(".career-case__swiper");

    const swiper = new Swiper(swiperContainer, {
      autoHeight: true,
      speed: 800,
      effect: "fade",
      allowTouchMove: false,
    });

    const swiperController = new SwiperController(swiper, navBtns);
  }

  const cookies = document.querySelector("[data-cookies]");
  if (cookies) {
    const btns = cookies.querySelectorAll(".cookies__btn");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        cookies.classList.add("_hidden");
      })
    });
  }

  function itemLoad() {
    loadedItems++;
    progress = 100 / itemsToLoad * loadedItems;
    loaderFill.style.width = progress + "%";
    loaderPercent.style.left = progress + "%";
    loaderPercent.classList.add("_start");
    loaderPercent.textContent = Math.round(progress);

    if (progress >= 100 || loadedItems >= itemsToLoad) {
      loaderContainer.classList.add("_hidden");
      // document.body.style.overflow = "auto";
    }
  }

  if (loaderContainer && loaderFill && loaderPercent) {

    if (itemsToLoad === 0) {
      loaderContainer.classList.add("_hidden");
      document.body.style.overflow = "auto";
    } else {
      for (let i = 0; i < images.length; i++) {
        let imgCopy = new Image();
        imgCopy.src = images[i].src;
        //после загрузки фантома вызывается функция
        imgCopy.onload = itemLoad;
        imgCopy.onerror = itemLoad;
      }
    }
  }

  window.onload = () => {
    loaderContainer.classList.add("_hidden");
    document.body.style.overflow = "auto";
  }

});