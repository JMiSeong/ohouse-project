
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

function openImageModal(image) {
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modalCaption.textContent = image.alt;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImageModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  modalImage.src = "";
  modalCaption.textContent = "";
}

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
