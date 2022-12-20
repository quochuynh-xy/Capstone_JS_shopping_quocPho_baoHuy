function getUpdate(id) {
    axios({
      url:
        "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" + id,
      method: "GET",
    })
      .then(function (res) {
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
        document.getElementById("btnCreate").innerHTML = "Update";
        document.getElementById("btnCreate").classList.remove("btn-primary")
        document.getElementById("btnCreate").classList.add("btn-warning")
        // document.getElementById("btnUpdate").setAttribute('onclick', `updateProduct(${item.id})`)
        mode = "update"
        // add cancle btn
        if (document.getElementById("btnCancel")) return;
        var btnCancel = document.createElement("button");
        btnCancel.innerHTML = "Cancel update";
        btnCancel.id = "btnCancel";
        btnCancel.classList.add("btn", "btn-danger");
        btnCancel.onclick = cancelUpdate;
        document.getElementById("btnGroup").appendChild(btnCancel);
      })
      .catch(function (err) {
        console.log(err);
      });
      return item.id 
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
    
    var productList = new Products(
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
      url :"https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" + id,
      method: "PUT",
      data : productList
    }).then(function(res){
      alert ("Update successfully")
      fectchProduct(res)
      cancelUpdate()
    }).catch(function(err){
      console.log(err)
    })
  }
  
  function cancelUpdate() {
  
    document.getElementById("btnClose").style.display = "block";
    document.getElementById("btnCreate").innerHTML = "Add item"
    document.getElementById("btnCreate").classList.remove("btn-warning")
    document.getElementById("btnCreate").classList.add("btn-primary")
    var btnCancel = document.getElementById("btnCancel");
    btnCancel.remove();
    document.getElementById("form-cont").reset();
  }