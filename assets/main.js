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


  // AJAX Cart

  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

  addToCartForms.forEach(cartForm => {
    cartForm.addEventListener("submit", async function (e) {
      // Prevent Submission
      e.preventDefault();

      await fetch('/cart/add', {
        method: 'post',
        body: new FormData(cartForm)
      });

      // Get New Object
      const res = await fetch('/cart.json');
      const cart = await res.json();
      console.log(cart);
      


    })
  })

});
