var btnOpen = document.querySelector(".open-modal-btn")
var modal1 = document.querySelector(".modal1")
var headerIconClose = document.querySelector(".modal1__header i")
var btnClose = document.querySelector(".modal1__footer button")


function  toggleModal   () {
    modal1.classList.toggle("hide")
}


btnOpen.addEventListener('click',toggleModal )
modal1.addEventListener('click',function (e){
    if (e.target == e.currentTarget){
        toggleModal()
    }
} )
headerIconClose.addEventListener('click', toggleModal)
btnClose.addEventListener('click',toggleModal )

// function showInfo(id) {
//   axios({
//     url:
//       "https://6388b326a4bb27a7f78f1ccc.mockapi.io/api/BC38_API/products/" + id,
//     method: "GET",
//   })
//     .then(function (res) {
//       let infoItem = res.data;
//       let btnOpen = document.querySelectorAll(".open-modal-btn");
//       let modal1 = document.querySelector(".modal1");
//       let headerIconClose = document.querySelector(".modal1__header i");
//       let btnClose = document.querySelector(".modal1__footer button");
//       console.log(btnOpen, modal1, headerIconClose, btnClose);
//       function toggleModal() {
//         modal1.classList.toggle("hide");
//       }

//       btnOpen.addEventListener("click", toggleModal);
//       modal1.addEventListener("click", function (e) {
//         if (e.target == e.currentTarget) {
//           toggleModal();
//         }
//       });
//       headerIconClose.addEventListener("click", toggleModal);
//       btnClose.addEventListener("click", toggleModal);
//       document.getElementById("").innerHTML = `
//     <div class="modal1__body">
//             <div class="body__top">
//               <div class="info-img">
//                 <img src='${infoItem.id}' alt="" />
//               </div>
//               <div class="info-cont">
//                 <h1>'${infoItem.name}'</h1>
//                 <span>'${infoItem.price}'</span>
//                 <p>'${infoItem.stock}'</p>
//               </div>
//             </div>
//             <div class="body__bot">
//               <p>
//               '${infoItem.desc}'
//               </p>
//             </div>
//           </div> `;
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// }