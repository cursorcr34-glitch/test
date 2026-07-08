const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const filterButtons = document.querySelectorAll(".filter-button");
const carCards = document.querySelectorAll(".car-card");
const carLinks = document.querySelectorAll("[data-car]");
const carSelect = document.querySelector("#car-select");
const bookingForm = document.querySelector("#booking-form");
const formMessage = document.querySelector("#form-message");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navMenu.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    carCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

carLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const selectedCar = link.dataset.car;

    if (selectedCar && carSelect) {
      carSelect.value = selectedCar;
    }
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  const formData = new FormData(bookingForm);
  const name = String(formData.get("name") || "").trim();
  const car = String(formData.get("car") || "").trim();

  formMessage.textContent = `${name}, ${car} ucun bron sorgunuz qeyde alindi. Operator tezlikle sizinle elaqe saxlayacaq.`;
  bookingForm.reset();
});
