window.onload = function () {
  handleRenderBill();
};
function clearCart() {
  localStorage.setItem("cyber-Cart", JSON.stringify([]));
  sweetarlert()
  setTimeout(close, 5000)
}
function sweetarlert() {
  Swal.fire({
    title: "Cảm ơn đã quý khách đã lựa chọn AstroZeneca",
    text: "Đơn hàng của quý khách đã được tiếp nhận và chờ xử lý. Mọi chi tiết xin liên hệ: (0928)-000-001",
    imageUrl: "https://cdn2.iconfinder.com/data/icons/a-collection-of-virtual-gifts/100/thank_you-256.png",
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "Custom image",
  });
}
function handleRenderBill() {
  var data = JSON.parse(localStorage.getItem("cyber-Cart"));
  var html = "";
  var cash = 0;
  for (let i = 0; i < data.length; i++) {
    html += `<div class="single-row">
        <div class="img">
        <img src="${data[i].product.img}" alt="iphone">
        <span class="qty">${data[i].quantity}</span>
        </div>
        <div  class="item-detail">
        <div class="item-name">
            <h5>${data[i].product.name}</h5>
        </div>
        <div class="brand">
            <h5>Đơn giá:</h5>
        </div>
        <div>
            <p>${data[i].product.price} <span>đ</span></p>
        </div>
        </div>
        <div class="price">
            <h5>Thành Tiền</h5>
            <p class="total text-danger">${
              data[i].product.price * data[i].quantity
            } đ</p>
        </div>
    </div>`;
    cash += data[i].product.price * data[i].quantity;
  }
  document.getElementById("billDetail").innerHTML = html;
  document.getElementById("cash").innerHTML = cash + " đ";
  document.getElementById("totalCash").innerHTML = cash + " đ";
}
