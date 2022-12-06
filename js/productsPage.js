var apiURL =
  "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products";
var productsList = [];
// Hàm thay đổi số lượng sản phẩm
function handlQuantityChange(e, type) {
  // parent của thẻ input, chứa các nút nhấn và nút tăng giảm số lượng sp
  var parent = e.target.parentElement;
  // chọn đến đối tượng ô input
  var quantity = parent.querySelector(".js-count").value * 1;
  //xử lý cộng trừ số lượng sp:
  //Nếu type = minus thì trừ, plus thì cộng.
  // quantity>=0 và <=10
  if (type == "minus") {
    quantity -= 1;
  } else {
    quantity += 1;
  }
  // Sau khi cộng chán chê, kiểm tra lại số lượng.
  // Nếu > 10 thì giới hạn là 10, nếu
  quantity > 10 ? (quantity = 10) : quantity;
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
                onclick="handlQuantityChange(event,'minus')"
                class="quantity-btn js-btn-minus"
                >
                -
                </button>
                <input
                class="px-1 text-center js-count"
                type="number"
                value="0"
                />
                <button
                onclick="handlQuantityChange(event,'plus')"
                class="quantity-btn js-btn-plus"
                >
                +
                </button>
            </div>
            <div class="cart__add">
                <button class="add__btn px-2">Thêm vào giỏ</button>
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
            filteredData.push(totalData[i])
        }
      }
      renderProduct(filteredData)
    })
    .catch(function (error) {
      console.log(error);
    });
}
