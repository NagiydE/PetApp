var thumbUp = document.getElementsByClassName("fa-thumbs-up");

var trash = document.getElementsByClassName("fa-trash-o");
// Kept getting errors on the delete not working, had to google other ways to organzie my works in order to get it working.

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const post = this.parentNode;
    const postId = post.dataset.id; // Store the _id in a data attribute
    const thumbUp = parseInt(post.querySelector('span:nth-child(4)').innerText);

    fetch('/posts', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, thumbUp }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload();
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const post = this.parentNode;
    const postId = post.dataset.id;

    fetch('/posts', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    }).then(function (response) {
      if (response.ok) window.location.reload();
    });
  });
});

  // element.addEventListener('click', function () {
  //   const post = this.parentNode;
  //   const email = post.querySelector('span:nth-child(1)').innerText;
  //   const image = post.querySelector('img').src;
  //   const caption = post.querySelector('span:nth-child(3)').innerText;

  //   fetch('posts', {
  //     method: 'delete',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, image, caption }),
  //   }).then(function (response) {
  //     window.location.reload();
  //   });
//   });
// });


// // Array.from(thumbUp).forEach(function(element) {
// //       element.addEventListener('click', function(){
// //         const email = this.parentNode.parentNode.childNodes[1].innerText
// //         const image = this.parentNode.parentNode.childNodes[3].innerText
// //         const caption = this.parentNode.parentNode.childNodes[5].innerText
// //         const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
// //         fetch('posts', {
// //           method: 'put',
// //           headers: {'Content-Type': 'application/json'},
// //           body: JSON.stringify({
// //             'email': email,
// //             'image': image,
// //             'caption': caption,
// //             'thumbUp':thumbUp
// //           })
// //         })
// //         .then(response => {
// //           if (response.ok) return response.json()
// //         })
// //         .then(data => {
// //           console.log(data)
// //           window.location.reload(true)
// //         })
// //       });
// // });


// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const email = this.parentNode.parentNode.childNodes[1].innerText
//         const image = this.parentNode.parentNode.childNodes[3].innerText
//         const caption = this.parentNode.parentNode.childNodes[5].innerText
//         fetch('posts', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'email': email,
//             'image': image,
//             'caption': caption,
           
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });


