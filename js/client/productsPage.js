var apiURL =
  "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products";
// productsList chứa danh sách các sản phẩm.
var productsList = [];
// cart: chứa các sản phẩm trong giỏ hàng.
var cart = [];
function getCartDataFromLocal() {
  //Lấy dữ liệu giỏ hàng lưu ở local
  let getData = localStorage.getItem("cyber-Cart");
  if (!getData) return;
  cart = JSON.parse(getData);
}
function saveCartDataToLocal() {
  let jsonData = JSON.stringify(cart);
  localStorage.setItem("cyber-Cart", jsonData);
}
window.onload = function () {
  fetchProductsData();
  getCartDataFromLocal();
  sumTotalItems ()
};
// Hàm thay đổi số lượng sản phẩm
function handlQuantityChange(e, type, stock) {
  var parent = e.target.parentElement;
  var quantity = parent.querySelector(".js-count").value * 1;
  if (type == "minus") {
    quantity -= 1;
  } else {
    quantity += 1;
  }
  if (quantity > stock) alertMess("Vượt quá số lượng hàng hiện có");
  quantity > stock ? (quantity = stock) : quantity;
  quantity < 0 ? (quantity = 0) : quantity;
  parent.querySelector(".js-count").value = quantity;
}
function fetchProductsData() {
  var promise = axios({
    url: apiURL,
    method: "GET",
  });
  promise
    .then(function (response) {
      var getData = response.data;
      renderProduct(getData);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// renderProduct: Hiển thị danh sách sản phẩm cho khách hàng.
function renderProduct(data) {
  let htmlContent = "";
  for (let i = 0; i < data.length; i++) {
    htmlContent += `<div class="col-4 item">
        <div class="item__detail text-center">
        <img
            class="w-75 d-block mx-auto rounded-3"
            onerror="this.src='./img/error1-img.jpg'"
            src="${data[i].img}"
            alt="phone"
        />
        <div class="item__detail__color text-center">
            <a class="choosed-color color-1" href="#url"></a>
            <a class="choosed-color color-2" href="#url"></a>
            <a class="choosed-color color-3" href="#url"></a>
        </div>
        <div class="item__detail__actions">
            <a class="item-action" href="#url"
            ><i class="fa-regular fa-heart"></i></a
            ><a class="item-action" href="#url"
            ><i class="fa-solid fa-code-compare"></i></a
            ><a class="item-action" href="#url"
            ><i class="fa-solid fa-magnifying-glass"></i
            ></a>
        </div>
        </div>
        <div class="item__info">
        <h1 onclick="handleRenderModal(${data[i].id})" class="item__info__name">${data[i].name}</h1>
        <p class="item__info__price">${data[i].price} <span>đ</span></p>
        <div class="item__info__cart">
            <p class="my-0">
            Chọn mua<i class="ms-3 fa-solid fa-cart-shopping"></i>
            </p>
            <div class="add-to-cart d-flex w-100">
            <div class="cart__quantity d-flex">
                <button
                onclick="handlQuantityChange(event,'minus',${data[i].stock})"
                class="quantity-btn js-btn-minus"
                >
                -
                </button>
                <input
                class="px-1 text-center js-count"
                type="number"
                value="1"
                />
                <button
                onclick="handlQuantityChange(event,'plus',${data[i].stock})"
                class="quantity-btn js-btn-plus"
                >
                +
                </button>
            </div>
            <div class="cart__add">
                <button onclick="handleAddToCart(event,${data[i].id})" class="js-add-btn add__btn px-2">Thêm vào giỏ</button>
            </div>
            </div>
        </div>
        </div>
    </div>`;
  }
  document.getElementById("js-productsList").innerHTML = htmlContent;
}
// filterProduct: lọc sản phẩm
document.getElementById("js-filterInput").onchange = filterProduct;
function filterProduct() {
  // Lấy keywords
  let keywords = document
    .getElementById("js-filterInput")
    .value.trim()
    .toLowerCase();
  // Mảng sẽ chứa đối tượng được lọc ra
  let filteredData = [];
  let promise = axios({
    url: apiURL,
    method: "GET",
  });
  promise
    .then(function (response) {
      var totalData = response.data;
      for (let i = 0; i < totalData.length; i++) {
        if (totalData[i].type.includes(keywords)) {
          filteredData.push(totalData[i]);
        }
      }
      renderProduct(filteredData);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// handleAddToCart: thêm sản phẩm vào giỏ hàng
function handleAddToCart(e, id) {
  var cartItem = {};
  var cartIndex = -1;
  var take =
    e.target.parentElement.parentElement.querySelector(".js-count").value * 1;
  if (!take) return;
  axios({ url: apiURL + `/${id}`, method: "GET" })
    .then(function (response) {
      cartItem.product = response.data;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product["id"] == id) cartIndex = i;
      }
      if (cartIndex != -1) {
        cart[cartIndex].quantity += take;
        if (cart[cartIndex].quantity >= cart[cartIndex].inStock) {
          cart[cartIndex].quantity = cart[cartIndex].inStock;
        }
      } else {
        cartItem.product = response.data;
        cartItem.inStock = response.data.stock;
        take >= response.data.stock
          ? (cartItem.quantity = response.data.stock)
          : (cartItem.quantity = take);
        cart.push(cartItem);
      }
      saveCartDataToLocal();
      sumTotalItems ()
      arlertNotify();
      console.log(cart);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// Tổng số lượng hàng trong giỏ:
function sumTotalItems () {
  let sumItems = 0;
  for(let i= 0; i < cart.length; i++) {
    sumItems += cart[i].quantity;
  }
  document.getElementById('number-cart').innerHTML = sumItems;
}
// render giỏ hàng
function handleRenderCart() {
  getCartDataFromLocal();
  if (cart.length == 0) {
    document.querySelector(".js-total-bill").innerHTML = 0;
    document.getElementById(
      "listOfItems"
    ).innerHTML = `<div class="text-center">
    <p class="fs-4">Giỏ hàng đang trống</p>
    <img
      class="imgfluid w-25"
      src="https://cdn4.iconfinder.com/data/icons/e-commerce-and-online-shopping-outline/512/cancel_basket_empty_delete_cart_store-256.png"
      alt=""
    />
  </div>`;
    return;
  }
  let totalBill = 0;
  renderData = cart;
  let carthtml = "";
  for (let i = 0; i < renderData.length; i++) {
    totalBill += renderData[i].product.price * renderData[i].quantity;
    carthtml += `<section class="item__list">
                    <span onclick="handleDeleteItemInCart(${i})" class="js-item-remove item__remove">Xóa</span>
                    <div class="item__img">
                      <img
                        src="${renderData[i].product.img}"
                        alt="${renderData[i].product.name}"
                      />
                    </div>
                    <div class="item__info">
                      <h4 class="item__name">${renderData[i].product.name}</h4>
                      <p class="item__price">Đơn giá:<span>${
                        renderData[i].product.price
                      }đ</span></p>
                      <div class="item__count">
                        <p>Số lượng:</p>
                        <div class="item-control">
                          <span onclick="handleItemControl(event, 'minus', ${i})" class="js-item-minus ctrl-btn fw-bold">-</span>
                          <span class=""><input onchange = "handleChange(event, ${i})" class="js-item-quantity item-quantity fw-bolder text-center" type="text" value="${
      renderData[i].quantity
    }"></span>
                          <span onclick="handleItemControl(event, 'plus', ${i})" class="js-item-plus ctrl-btn fw-bold">+</span>
                        </div>
                      </div>
                      <p class="item__sum-price">Thành tiền:<span>${
                        renderData[i].product.price * renderData[i].quantity
                      } đ</span></p>
                    </div>
                  </section>
                  `;
  }
  document.getElementById("listOfItems").innerHTML = carthtml;
  document.querySelector(".js-total-bill").innerHTML = totalBill+" đ";
}
// xử lý từng Item trong giỏ hàng:
function handleItemControl(e, type, index) {
  let itemCount = e.target.parentElement.querySelector(".js-item-quantity");
  if (!itemCount.value) {
    cart.splice(index, 1);
    saveCartDataToLocal();
    return handleRenderCart();
  }
  if (type == "minus") {
    cart[index].quantity -= 1;
    cart[index].quantity == 0
      ? cart.splice(index, 1)
      : (itemCount.value = cart[index].quantity);
  }
  if (type == "plus") {
    cart[index].quantity += 1;
    if (cart[index].quantity >= cart[index].inStock) {
      cart[index].quantity = cart[index].inStock;
      alertMess("Vượt quá số lượng hiện có");
    } else {
      itemCount.value = cart[index].quantity;
    }
  }
  saveCartDataToLocal();
  sumTotalItems ();
  handleRenderCart();
}
// trường hợp người dùng tự nhập giá trị cho ô input ở giỏ hàng
function handleChange(e, index) {
  let buy = e.target.value * 1;
  if (!buy) {
    cart.splice(index, 1);
    saveCartDataToLocal();
    return handleRenderCart();
  }
  if (cart[index].inStock >= buy && buy > 0) {
    cart[index].quantity = buy;
  } else if (cart[index].inStock < buy && buy > 0) {
    cart[index].quantity = cart[index].inStock;
  }
  saveCartDataToLocal();
  sumTotalItems ();
  handleRenderCart();
}
// Xóa luôn item trong giỏ hàng.
function handleDeleteItemInCart(index) {
  cart.splice(index, 1);
  saveCartDataToLocal();
  sumTotalItems ()
  handleRenderCart();
}
// Xóa hết tất cả items trong giỏ hàng.
function handleEmptyCart() {
  cart = [];
  localStorage.setItem("cyber-Cart", cart);
  handleRenderCart();
  sumTotalItems ();
}
// arlert khi mua quá số lượng instock
function alertMess(data) {
  // data = "Vượt quá giới hạn số lượng";
  // data = "Đã thêm sản phẩm vào giỏ hàng";
  Swal.fire(data);
}
function arlertNotify() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Đã thêm sản phẩm vào giỏ",
    showConfirmButton: false,
    timer: 1000,
  });
}
// Modal
var iconClose = document.querySelector(".modal__content .closeModal");
var modal = document.querySelector(".itemModal");
iconClose.addEventListener("click", handleModal);
modal.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) handleModal();
});
function handleModal() {
  document.querySelector(".itemModal").classList.toggle("active");
  document.querySelector("body").classList.toggle("hide");
}
// render nội dung trong modal
function handleRenderModal(id) {
  handleModal();
  document.getElementById("itemModal").innerHTML = "";
  let promise = axios({ url: apiURL + `/${id}`, method: "GET" });
  promise
    .then(function (response) {
      var data = response.data;
      document.getElementById("itemModal").innerHTML = `
    <div class="modal__content w-75 mx-auto row justify-content-center">
      <p><i class="closeModal fa-regular fa-circle-xmark"></i></p>
      <div class="modal__content__img col-5">
        <img
          class="d-block w-100 mx-0 rounded-3"
          src="${data.img}"
          alt="image"
        />
        <p class="mt-2 text-center fs-4 text-warning">
          <span class="fs-5">Hiện có:</span> ${data.stock} <span class="fs-5">sp</span>
        </p>
      </div>
      <div class="modal__content__detail col-7">
        <div class="mb-4">
          <h1 class="modal__deltail__name">${data.name}</h1>
          <p class="modal__deltail__price">Giá: ${data.price}đ</p>
          <p class="mb-1 fs-4 text-decoration-underline">Thông tin chi tiết:</p>
          <div class="modal__deltail__des">
            <ul class="px-0">
              <li>Tên sản phẩm: <span>${data.name}</span></li>
              <li>Kích thước màn hình: <span>${data.screen} inch.</span></li>
              <li>Độ phân giải camera trước: <span>${data.frontCamera}  Megapixel.</span></li>
              <li>Độ phân giải camera sau: <span>${data.backCamera} Megapixel.</span></li>
              <li>Hãng sản xuất: <span>${data.type}.</span></li>
              <li>Chi tiết sản phẩm:</li>
              <li>
                <i>
                ${data.desc}</i
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer class="modal__footer">
        <h3>SOCIAL SHARE</h3>
        <div class="modal__footer__social">
          <a href="#url" class="bg-fb fa-brands fa-facebook-f"></a>
          <a href="#url" class="bg-tw fa-brands fa-twitter"></a>
          <a href="#url" class="bg-gg fa-brands fa-google-plus-g"></a>
        </div>
      </footer>
    </div>
    `;
      document
        .querySelector(".modal__content .closeModal")
        .addEventListener("click", handleModal);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// Cart
var cartOpen = document.querySelector(
  ".header .brand-name .container .icon .icon-2"
);
var cartCheckoutCloseBtn = document.querySelector(".js-close-cart"); // icon close
var cartBackground = document.querySelector(".js-cart-outer"); // cart modal bg
var cartCheckout = document.querySelector(".cart"); //cart display inner
var checkoutBtn = document.getElementById("moveToCheckout"); // nút checkout
function handleCart() {
  cartCheckout.classList.toggle("active");
  cartBackground.classList.toggle("show");
}
cartCheckoutCloseBtn.addEventListener("click", handleCart);
cartBackground.addEventListener("click", handleCart);
cartOpen.addEventListener("click", function () {
    handleCart();
    handleRenderCart();
});
checkoutBtn.addEventListener("click", function () {
  handleCart();
  if (!cart.length) return;
  open("../client/checkout.html",'_self');
});
