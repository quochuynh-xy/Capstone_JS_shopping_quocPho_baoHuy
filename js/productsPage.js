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
