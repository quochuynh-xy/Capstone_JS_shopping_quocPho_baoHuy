// Create
var itemList = [];
var mode = "create";
function checkMode() {
  if (mode === "create") createProduct();
  if (mode === "update") updateProduct();
}
function createProduct() {
  // if (!validateForm()) return;
  mode = "create";
  var name = document.getElementById("itemName").value;
  var price = document.getElementById("itemPrice").value;
  var screen = document.getElementById("itemScreen").value;
  var backCam = document.getElementById("itemBackCam").value;
  var frontCam = document.getElementById("itemFontCam").value;
  var img = document.getElementById("itemImg").value;
  var des = document.getElementById("itemDes").value;
  var type = document.getElementById("itemType").value;
  var stock = +document.getElementById("itemStock").value;

  var item = new Products(
    name,
    price,
    screen,
    backCam,
    frontCam,
    img,
    des,
    type,
    stock
  );
  axios({
    url: "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products",
    method: "POST",
    data: item,
  })
    .then(function (res) {
      alert("Item added success");
      fectchProduct(res);
    })
    .catch(function (err) {
      console.log(err);
    });
  document.getElementById("form-cont").reset();
}

function mapData(local) {
  var mappedData = [];
  for (var i = 0; i < local.length; i++) {
    var oldItem = local[i];
    var newItem = new Products(
      oldItem.name,
      oldItem.price,
      oldItem.screen,
      oldItem.backCamera,
      oldItem.frontCamera,
      oldItem.img,
      oldItem.desc,
      oldItem.type,
      oldItem.stock
    );
    newItem.id = local[i].id;
    mappedData.push(newItem);
  }
  return mappedData;
}
function renderHtml(data) {
  data = data || itemList;
  var html = "";
  for (var i = 0; i < data.length; i++) {
    data[i];
    html += ` <tr>
                <th>${data[i].id}</th>
                <td>${data[i].name}</td>
                <td>${data[i].price}</td>
                <td colspan="2"><img src="${data[i].img}" alt="" /></td>
                <td style="overflow:auto;height:200px; " class="p-2">${data[i].desc}</td>
                <td >
                <button onclick="getUpdate('${data[i].id}')" class="btn btn-info mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-regular fa-pen-to-square" ></i>
                </button>
                <button  class="btn btn-danger" onclick="deleteProduct('${data[i].id}')"><i class="fa-regular fa-trash-can"></i></button>
                <button onclick="showInfo('${data[i].id}')" class="open-modal-btn p-2  btn btn-success
                mt-2 rounded border border-0"><i class="fa-solid fa-circle-info fs-4"></i></button>
                </td>
                </tr> `;
  }
  document.getElementById("table-cont").innerHTML = html;
}

function fectchProduct() {
  itemList = [];
  renderHtml();
  axios({
    url: "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products",
    method: "GET",
  })
    .then(function (res) {
      itemList = mapData(res.data);
      renderHtml(res.data);
    })
    .catch(function (err) {
      console.log(err);
    });
}
window.onload = function () {
  fectchProduct();
};

function deleteProduct(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios({
        url:
          "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" +
          id,
        method: "DELETE",
      })
        .then(function (res) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          fectchProduct(res);
          renderHtml(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  });
}
function getUpdate(id) {
  axios({
    url:
      "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" + id,
    method: "GET",
  }).then(function (res) {
    var item = res.data;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemPrice").value = item.price;
    document.getElementById("itemScreen").value = item.screen;
    document.getElementById("itemBackCam").value = item.backCamera;
    document.getElementById("itemFontCam").value = item.frontCamera;
    document.getElementById("itemImg").value = item.img;
    document.getElementById("itemDes").value = item.desc;
    document.getElementById("itemType").value = item.type;
    document.getElementById("itemStock").value = item.stock;

    document.getElementById("btnClose").style.display = "none";
    document.getElementById("btnCreate").style.display = "none";

    mode = "update";
    // btnUpdate
    if (document.getElementById("btnUpdate")) return;
    var btnUpdate = document.createElement("button");
    btnUpdate.innerHTML = " Update";
    btnUpdate.id = "btnUpdate";
    btnUpdate.classList.add("btn", "btn-warning");
    document.getElementById("btnGroup").append(btnUpdate);
    document
      .getElementById("btnUpdate")
      .setAttribute("onclick", `updateProduct(${item.id})`);

    // btnCancel
    if (document.getElementById("btnCancel")) return;
    var btnCancel = document.createElement("button");
    btnCancel.innerHTML = "Cancel update";
    btnCancel.id = "btnCancel";
    btnCancel.classList.add("btn", "btn-danger");
    btnCancel.onclick = cancelUpdate;
    document.getElementById("btnGroup").appendChild(btnCancel);
  });
}
function updateProduct(id) {
  var name = document.getElementById("itemName").value;
  var price = document.getElementById("itemPrice").value;
  var screen = document.getElementById("itemScreen").value;
  var backCam = document.getElementById("itemBackCam").value;
  var frontCam = document.getElementById("itemFontCam").value;
  var img = document.getElementById("itemImg").value;
  var des = document.getElementById("itemDes").value;
  var type = document.getElementById("itemType").value;
  var stock = +document.getElementById("itemStock").value;

  var productUpdate = new Products(
    name,
    price,
    screen,
    backCam,
    frontCam,
    img,
    des,
    type,
    stock
  );

  axios({
    url:
      "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" + id,
    method: "PUT",
    data: productUpdate,
  })
    .then(function (res) {
      fectchProduct(res);
      alert("Update successfully");
      cancelUpdate();
    })
    .catch(function (err) {
      console.log(err);
    });
}
function cancelUpdate() {
  mode = "create";
  document.getElementById("btnClose").style.display = "block";
  document.getElementById("btnCreate").style.display = "block";
  document.getElementById("btnCreate").classList.remove("btn-warning");
  document.getElementById("btnCreate").classList.add("btn-primary");
  document.getElementById("form-cont").reset();
  var btnUpdate = document.getElementById("btnUpdate");
  btnUpdate.remove();
  var btnCancel = document.getElementById("btnCancel");
  btnCancel.remove();
}

function searchProduct(e) {
  axios({
    url: "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products",
    method: "GET",
  }).then(function (res) {
    var keyword = e.target.value.toLowerCase().trim();
    var result = [];
    for (var i = 0; i < res.data.length; i++) {
      var itemName = res.data[i].name;
      if (itemName.includes(keyword)) {
        result.push(res.data[i]);
      }
    }
    renderHtml(result);
  });
}
function showInfo(id) {
  console.log("hello");
  axios({
    url:
      "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" + id,
    method: "GET",
  })
    .then(function (res) {
      let infoItem = res.data;
      document.getElementById("modalDrop").innerHTML = `
      <div class="modal1  hide" id="modalInfo">
      <div class="modal1__inner ">
        <div class="modal1__header">
          <span>Item Infomation</span>
          <i class="fa-solid fa-xmark icon-close "></i>
        </div>
        <div class="modal1__body">
          <div class="body__top">
            <div class="info-img">
              <img src='${infoItem.img}' alt="" />
            </div>
            <div class="info-cont">
              <h1 >'${infoItem.name}'</h1>
              <span>'${infoItem.price}'</span>
              <p>'${infoItem.stock}'</p>
            </div>
          </div>
          <div class="body__bot">
            <p>
            '${infoItem.desc}'
            </p>
          </div>
        </div>
        <div class="modal1__footer">
          <button>Close</button>
        </div>
      </div>
    </div> `;
      handleModal();
    })
    .catch(function (err) {
      console.log(err);
    });
}
function toggleModal() {
  let modal1 = document.querySelector(".modal1");
  let headerIconClose = document.querySelector(".modal1__header i");
  let btnClose = document.querySelector(".modal1__footer button");
  modal1.classList.toggle("hide");
  modal1.addEventListener("click", function (e) {
    if (e.target == e.currentTarget) {
      toggleModal();
    }
  });
  headerIconClose.addEventListener("click", toggleModal);
  btnClose.addEventListener("click", toggleModal);
}
function handleModal() {
  let btnOpen = document.querySelectorAll(".open-modal-btn");
 
  for (let i = 0; i < btnOpen[i].length; i++) {
    btnOpen[i].addEventListener("click", toggleModal);
  }
  toggleModal();
}

/**-- Validation -- */
function required(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorId).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorId).innerHTML = "*Fill form or Die :)";
  return false;
}
function length(val, config) {
  if (val.length < config.min || val.length > config.max) {
    document.getElementById(
      config.errorId
    ).innerHTML = `Length must from ${config.min} to ${config.max}`;
    return false;
  }
  document.getElementById(config.errorId).innerHTML = "";
  return true;
}
function pattern(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorId).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorId).innerHTML = "Pattern must exactly ";
  return false;
}
function validateForm() {
  var name = document.getElementById("itemName").value;
  var price = document.getElementById("itemPrice").value;
  var screen = document.getElementById("itemScreen").value;
  var backCam = document.getElementById("itemBackCam").value;
  var frontCam = document.getElementById("itemFontCam").value;
  var img = document.getElementById("itemImg").value;
  var des = document.getElementById("itemDes").value;
  var type = document.getElementById("itemType").value;
  var stock = +document.getElementById("itemStock").value;
  var nameRegexp = /[A-z\s0-9]/g;
  var priceRegexp = /^\d{0,9}(\.\d{1,3})(\.\d{1,6})?VND/g;
  var screenRegexp = /^\d[0-9]{0,9}\sinch$/g;
  var cameraRegexp = /^\d[0-9]{0,9}\sMP$/g;
  var stockRegexp = /[0-9]/g;
  document.getElementById("nameError").style.display = "block";
  document.getElementById("priceError").style.display = "block";
  document.getElementById("screenError").style.display = "block";
  document.getElementById("backCamError").style.display = "block";
  document.getElementById("frontCamError").style.display = "block";
  document.getElementById("descError").style.display = "block";
  document.getElementById("typeError").style.display = "block";
  document.getElementById("stockError").style.display = "block";

  var nameValid =
    required(name, { errorId: "nameError" }) &&
    pattern(name, { errorId: "nameError", regexp: nameRegexp });

  var priceValid =
    required(price, { errorId: "priceError" }) &&
    length(price, { errorId: "priceError", min: 4, max: 15 }) &&
    pattern(price, { errorId: "priceError", regexp: priceRegexp });

  var screenValid =
    required(screen, { errorId: "screenError" }) &&
    pattern(screen, { errorId: "screenError", regexp: screenRegexp });

  var backCamValid =
    required(backCam, { errorId: "backCamError" }) &&
    pattern(backCam, { errorId: "backCamError", regexp: cameraRegexp });

  var frontCamValid =
    required(frontCam, { errorId: "frontCamError" }) &&
    pattern(frontCam, { errorId: "backCamError", regexp: cameraRegexp });
  var imgValid = required(img, { errorId: "imgError" });
  var desValid = required(des, { errorId: "descError" });

  var typeValid = required(type, { errorId: "typeError" });

  var stockValid =
    required(stock, { errorId: "stockError" }) &&
    pattern(stock, { errorId: "stockError", regexp: stockRegexp });

  var isFormValid =
    nameValid &&
    priceValid &&
    screenValid &&
    backCamValid &&
    frontCamValid &&
    desValid &&
    imgValid &&
    typeValid &&
    stockValid;

  return isFormValid;
}
