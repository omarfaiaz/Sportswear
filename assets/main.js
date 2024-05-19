$(document).ready(function () {
  $(".faq-item_que").on("click", function () {
    const toggleText = $(this).parent().data("toggle");

    $(this).parent().find(".faq-item_ans").slideToggle();
    if (toggleText === "close") {
      $(this).parent().data("toggle", "open");
    } else {
      $(this).parent().data("toggle", "close");
    }
  });

  $(".mob-filter_btn").on("click", function () {
    $(".overlay").addClass("active-overlay");
    $("#mobile-filters").addClass("active-filter");
  });
  $(".close-filter_btn ").on("click", function () {
    $(".overlay").removeClass("active-overlay");
    $("#mobile-filters").removeClass("active-filter");
  });

  // ========= PRODUCT SLIDER ================
  $(".product-gallery_img").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    dots: false,
    asNavFor: ".product-gallery_thumb",
  });
  $(".product-gallery_thumb").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".product-gallery_img",
    dots: false,
    arrows: false,
    vertical: true,
    verticalSwiping: true,
    centerMode: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          centerMode: false,
          variableWidth: false,
          vertical: false,
          verticalSwiping: false,
        },
      },
    ],
  });
  // Brand Carousel

  $(".logo-carousel").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
  });

  // Collection Isotope Filter
  var $grid = $("#collection-filter_block").isotope({
    filter: "#shoes",
  });

  // filter items on button click
  $(".collection-filter_btn").on("click", function () {
    var filterValue = $(this).attr("data-filter");
    console.log(filterValue);

    $grid.isotope({ filter: filterValue });
  });

  // Best Seller Filter
  $("#home-sort-by").on("change", async function () {
    fetch("/collections/all?sort_by=" + $(this).val())
      .then((response) => response.text())
      .then((data) => {
        let html_div = document.createElement("div");
        html_div.innerHTML = data;

        let html_dom = document.querySelector("#best-seller_grid").innerHTML;
        console.log(html_div);

        // document.querySelector("#best-seller_grid").innerHTML = html_div;
        // update url without refreshing the page
        // history.replaceState(null, null, '?sort_by=' + $(this).val());
      })
      .catch((error) => console.error("Error", error));
  });

  // AJAX Cart

  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

  addToCartForms.forEach((cartForm) => {
    cartForm.addEventListener("submit", async function (e) {
      // Prevent Submission
      e.preventDefault();

      await fetch("/cart/add", {
        method: "post",
        body: new FormData(cartForm),
      });

      // Get New Object
      const res = await fetch("/cart.json");
      const cart = await res.json();
      console.log(cart);
    });
  });

  // Cart Drawer
  function openCartDrawer() {
    document.querySelector(".cart-drawer").classList.add("cart-drawer--active");
  }

  function closeCartDrawer() {
    document
      .querySelector(".cart-drawer")
      .classList.remove("cart-drawer--active");
  }

  function updateCartItemCounts(count) {
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count;
    });
  }

  async function updateCartDrawer() {
    const res = await fetch("/?section_id=template-cart-drawer");
    const text = await res.text();
    const html = document.createElement("div");
    html.innerHTML = text;

    const newBox = html.querySelector(".cart-drawer").innerHTML;

    document.querySelector(".cart-drawer").innerHTML = newBox;

    addCartDrawerListeners();
  }

  function addCartDrawerListeners() {
    // Update quantities
    document
      .querySelectorAll(".cart-drawer-quantity-selector button")
      .forEach((button) => {
        button.addEventListener("click", async () => {
          // Get line item key
          const rootItem =
            button.parentElement.parentElement.parentElement.parentElement
              .parentElement;
          const key = rootItem.getAttribute("data-line-item-key");

          // Get new quantity
          const currentQuantity = Number(
            button.parentElement.querySelector("input").value
          );
          const isUp = button.classList.contains(
            "cart-drawer-quantity-selector-plus"
          );
          const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

          // Ajax update\
          const res = await fetch("/cart/update.js", {
            method: "post",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates: { [key]: newQuantity } }),
          });
          const cart = await res.json();

          updateCartItemCounts(cart.item_count);

          // Update cart
          updateCartDrawer();
        });
      });

    document
      .querySelector(".cart-drawer-box")
      .addEventListener("click", (e) => {
        e.stopPropagation();
      });

    document
      .querySelectorAll(".cart-drawer-header-right-close, .cart-drawer")
      .forEach((el) => {
        el.addEventListener("click", () => {
          console.log("closing drawer");
          closeCartDrawer();
        });
      });
  }

  addCartDrawerListeners();

  document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Submit form with ajax
      await fetch("/cart/add", {
        method: "post",
        body: new FormData(form),
      });

      // Get cart count
      const res = await fetch("/cart.js");
      const cart = await res.json();
      updateCartItemCounts(cart.item_count);

      // Update cart
      await updateCartDrawer();

      // Open cart drawer
      openCartDrawer();
    });
  });

  document.querySelectorAll('a[href="/cart"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
});
