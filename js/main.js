
// 현재 화면에서 보고 있는 영역의 목차를 강조합니다.
const sections = document.querySelectorAll(".content-section");
const menuLinks = document.querySelectorAll(".side-navigation a");

function updateActiveMenu() {
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (window.scrollY >= sectionTop - 250) {
      currentSectionId = section.id;
    }
  });

  menuLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveMenu);
window.addEventListener("load", updateActiveMenu);

// 모든 .section-image 이미지를 클릭하면 전체 화면으로 확대합니다.
const modal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#imageModalContent");
const modalCaption = document.querySelector("#imageModalCaption");
const modalCloseButton = document.querySelector("#imageModalClose");
const expandableImages = document.querySelectorAll(".section-image");

let modalImageScale = 1;
let modalImageX = 0;
let modalImageY = 0;
let isModalImageDragging = false;
let dragStartX = 0;
let dragStartY = 0;

function updateModalImageTransform() {
  modalImage.style.transform =
    `translate(${modalImageX}px, ${modalImageY}px) scale(${modalImageScale})`;
  modalImage.classList.toggle("is-zoomed", modalImageScale > 1);
}

function resetModalImageZoom() {
  modalImageScale = 1;
  modalImageX = 0;
  modalImageY = 0;
  isModalImageDragging = false;
  modalImage.classList.remove("is-dragging");
  updateModalImageTransform();
}

function openImageModal(image) {
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modalCaption.textContent =
    `${image.alt} · 마우스 휠 확대/축소 · 드래그 이동`;

  resetModalImageZoom();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImageModal() {
  resetModalImageZoom();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  modalImage.src = "";
  modalCaption.textContent = "";
}

// 모달이 열리면 마우스 휠로 이미지를 바로 확대·축소할 수 있습니다.
modal.addEventListener("wheel", (event) => {
  if (!modal.classList.contains("open")) return;

  event.preventDefault();

  const zoomAmount = event.deltaY < 0 ? 0.2 : -0.2;
  modalImageScale = Math.min(4, Math.max(1, modalImageScale + zoomAmount));

  if (modalImageScale === 1) {
    modalImageX = 0;
    modalImageY = 0;
  }

  updateModalImageTransform();
}, { passive: false });

// 확대된 이미지는 마우스로 잡아 이동할 수 있습니다.
modalImage.addEventListener("pointerdown", (event) => {
  if (modalImageScale <= 1) return;

  event.preventDefault();
  isModalImageDragging = true;
  dragStartX = event.clientX - modalImageX;
  dragStartY = event.clientY - modalImageY;
  modalImage.classList.add("is-dragging");
  modalImage.setPointerCapture(event.pointerId);
});

modalImage.addEventListener("pointermove", (event) => {
  if (!isModalImageDragging) return;

  modalImageX = event.clientX - dragStartX;
  modalImageY = event.clientY - dragStartY;
  updateModalImageTransform();
});

function stopModalImageDragging(event) {
  if (!isModalImageDragging) return;

  isModalImageDragging = false;
  modalImage.classList.remove("is-dragging");

  if (modalImage.hasPointerCapture(event.pointerId)) {
    modalImage.releasePointerCapture(event.pointerId);
  }
}

modalImage.addEventListener("pointerup", stopModalImageDragging);
modalImage.addEventListener("pointercancel", stopModalImageDragging);

// 이미지를 더블 클릭하면 기본 배율로 돌아갑니다.
modalImage.addEventListener("dblclick", resetModalImageZoom);

expandableImages.forEach((image) => {
  image.addEventListener("click", () => {
    openImageModal(image);
  });
});

modalCloseButton.addEventListener("click", closeImageModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeImageModal();
  }
});

// 목차 위·아래 버튼으로 페이지의 처음과 끝으로 이동합니다.
const moveTopButton = document.querySelector("#moveTopButton");
const moveBottomButton = document.querySelector("#moveBottomButton");

moveTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

moveBottomButton.addEventListener("click", () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth"
  });
});

// 상위 목차를 클릭하면 하위 목차를 열고 닫습니다.
const navigationItems = document.querySelectorAll(
  ".navigation-item-with-submenu"
);

function closeAllSubmenus() {
  navigationItems.forEach((item) => {
    item.classList.remove("submenu-open");

    const mainLink = item.querySelector(":scope > a");
    mainLink.setAttribute("aria-expanded", "false");
  });
}

navigationItems.forEach((item) => {
  const mainLink = item.querySelector(":scope > a");
  mainLink.setAttribute("aria-expanded", "false");

  mainLink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const wasOpen = item.classList.contains("submenu-open");

    closeAllSubmenus();

    if (!wasOpen) {
      item.classList.add("submenu-open");
      mainLink.setAttribute("aria-expanded", "true");
    }
  });
});

// 목차 바깥이나 하위 목차를 클릭하면 열려 있던 목차를 닫습니다.
document.addEventListener("click", closeAllSubmenus);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllSubmenus();
  }
});
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const items = slider.querySelectorAll(".slider-item");
  const previousButton = slider.querySelector(".slider-prev");
  const nextButton = slider.querySelector(".slider-next");
  const dotsContainer = slider.querySelector(".slider-dots");

  let currentIndex = 0;

  // 이미지 개수에 맞게 하단 점 생성
  items.forEach((item, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `${index + 1}번째 이미지 보기`);

    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".slider-dot");

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  previousButton.addEventListener("click", () => {
    currentIndex =
      currentIndex === 0
        ? items.length - 1
        : currentIndex - 1;

    updateSlider();
  });

  nextButton.addEventListener("click", () => {
    currentIndex =
      currentIndex === items.length - 1
        ? 0
        : currentIndex + 1;

    updateSlider();
  });

  updateSlider();
});