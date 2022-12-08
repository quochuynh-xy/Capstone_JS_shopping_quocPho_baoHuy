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
};
// Hàm thay đổi số lượng sản phẩm
function handlQuantityChange(e, type, stock) {
  // stock: số lượng item tối đa:
  // parent của thẻ input, chứa các nút nhấn và nút tăng giảm số lượng sp
  var parent = e.target.parentElement;
  // chọn đến đối tượng ô input
  var quantity = parent.querySelector(".js-count").value * 1;
  //xử lý cộng trừ số lượng sp:
  //Nếu type = minus thì trừ, plus thì cộng.
  // quantity>=0 và <= stock
  if (type == "minus") {
    quantity -= 1;
  } else {
    quantity += 1;
  }
  // Sau khi cộng chán chê, kiểm tra lại số lượng.
  // Nếu > stock thì giới hạn là stock, nếu < 0 thì là 0
  if (quantity > stock) alert("Mua gì dữ anh trai. Hết hàng rồi.");
  quantity > stock ? (quantity = stock) : quantity;
  quantity < 0 ? (quantity = 0) : quantity;
  // Đưa số lượng quantity vào ô input
  parent.querySelector(".js-count").value = quantity;
}
// fetchProductsData: lấy data từ api
function fetchProductsData() {
  // lụm dữ liệu qua api
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
    htmlContent += `<div class="col-xl-4 item">
        <div class="item__detail text-center">
        <img
            class="w-75 d-block mx-auto rounded-3"
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
        <h1 class="item__info__name">${data[i].name}</h1>
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
                <button onclick="handleAddToCart(event, ${data[i].id})" class="js-add-btn add__btn px-2">Thêm vào giỏ</button>
            </div>
            </div>
        </div>
        </div>
    </div>`;
  }
  document.getElementById("js-productsList").innerHTML = htmlContent;
  // Gán chức năng mở modal
  assignFeature();
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
  // cart = [{product:{obj item}, quantity: 1-n}, {product:{obj item}, quantity: 1-n}]
  // cartItem = { product:{obj item}, count: 1-n, inStock: n}
  var cartItem = {};
  var cartIndex = -1;
  // Lấy số lượng hàng
  var take =
    e.target.parentElement.parentElement.querySelector(".js-count").value * 1;
  // Ngăn ngừa các cháu thêm số lượng < 0
  if (!take) return;
  axios({ url: apiURL + `/${id}`, method: "GET" })
    .then(function (response) {
      console.log(apiURL + `/${id}`);
      cartItem.product = response.data;
      // Kiểm tra sự tồn tại của sản phẩm trong giỏ hàng.
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product["id"] == id) cartIndex = i;
      }
      // Nếu có tồn tại thì cộng dồn số lượng muốn mua.
      if (cartIndex != -1) {
        cart[cartIndex].quantity += take; // số lượng items chọn mua
        // // Nếu số lượng hàng mua nhiều hơn inStock thì chỉ cho tối đa == inStock.
        if (cart[cartIndex].quantity >= cart[cartIndex].inStock) {
          cart[cartIndex].quantity = cart[cartIndex].inStock;
        }
      } else {
        // Nếu không có thì bỏ sản phẩm mới và số lượng muốn mua vào obj cartItem, rồi bỏ vào mảng giỏ hàng.
        cartItem.product = response.data;
        cartItem.inStock = response.data.stock;
        take >= response.data.stock
          ? (cartItem.quantity = response.data.stock)
          : (cartItem.quantity = take);
        cart.push(cartItem);
      }
      // Lưu mảng giỏ hàng xuống local.
      saveCartDataToLocal();
      console.log(cart);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// render giỏ hàng
function handleRenderCart() {
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
                      }đ</span></p>
                    </div>
                  </section>
                  `;
  }
  document.getElementById("listOfItems").innerHTML = carthtml;
  document.querySelector(".js-total-bill").innerHTML = totalBill;
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
    cart[index].quantity >= cart[index].inStock
      ? (cart[index].quantity = cart[index].inStock)
      : (itemCount.value = cart[index].quantity);
  }
  handleRenderCart();
  saveCartDataToLocal();
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
  handleRenderCart();
}
// Xóa luôn item trong giỏ hàng.
function handleDeleteItemInCart(index) {
  cart.splice(index, 1);
  saveCartDataToLocal();
  handleRenderCart();
}
// Gán chức năng cho tất cả các hàm sau khi load giao diện
function assignFeature() {
  // Gán chức năng cho nút thêm vào giỏ hàng cho tất cả các nút
  var addBtns = document.querySelectorAll(".js-add-btn");
  for (let i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener("click", handleAddToCart);
  }
  // Gán chức năng mở modal cho tất cả các items
  var openModal = document.querySelectorAll(".item .item__info__name");
  for (let i = 0; i < openModal.length; i++) {
    openModal[i].addEventListener("click", handleModal);
  }
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
// Cart
var cartOpen = document.querySelector(
  ".header .brand-name .container .icon .icon-2"
);
var cartCheckoutCloseBtn = document.querySelector(".js-close-cart");
var cartBackground = document.querySelector(".js-cart-outer");
var cartCheckout = document.querySelector(".cart");
function handleCart() {
  cartCheckout.classList.toggle("active");
  cartBackground.classList.toggle("show");
}
cartCheckoutCloseBtn.addEventListener("click", handleCart);
cartBackground.addEventListener("click", function (e) {
  handleCart();
});
cartOpen.addEventListener("click", () => {
  handleCart();
  handleRenderCart();
});
