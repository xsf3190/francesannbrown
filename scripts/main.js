function debounce(func){
  var timer;
  return function(event){
    if(timer) clearTimeout(timer);
    timer = setTimeout(func,300,event);
  };
}

function init() {
    
    const upload_email  = document.getElementById("upload-email"),
          upload_name   = document.getElementById("upload-name"),
          upload_button = document.getElementById("upload-button"),
          upload_photo  = document.getElementById("upload-photo"),
          contact_email = document.getElementById("contact-email"),
          contact_name  = document.getElementById("contact-name"),
          contact_photo = document.getElementById("contact-photo"),
          testimonial   = document.getElementById("testimonial");

    gsap.registerPlugin(ScrollTrigger);
    
    let images = gsap.utils.toArray("fieldset > figure > img");
    let captions = gsap.utils.toArray("fieldset > figure > figcaption");
    // always set the transforms directly via GSAP to ensure accuracy and speed
    gsap.set(images, {perspective: 1000, rotationY: -25});

    // loop through each image...
    images.forEach((image, i) => {
      // make an Array of the elements to the left and to the right of this image
      let siblingsLeft = images.slice(i+1),
          siblingsRight = images.slice(0, i);
        

      image.addEventListener("mouseenter", debounce(function(e){
        // animate the "hovered" image
        // <img src="https://res.cloudinary.com/doswrvsvp/image/upload/w_75,h_75,c_thumb,g_face,r_max,f_auto,q_auto/michelle_spirit_jdcynx">
        gsap.to(image, {rotationY: 0, scale: 1.15, duration: 0.3, overwrite: true})
        testimonial.innerHTML = captions[i].innerHTML
        gsap.to(testimonial,{opacity:1, overwrite:true, scale:1.2, duration: 0.5})
        // if there's anything to the left, animate it to the proper state in that direction
        if (siblingsLeft.length) {
          gsap.to(siblingsLeft, {x: "20%", rotationY: -25, duration: 0.3, scale: 1, overwrite: true});
        }
        // if there's anything to the left, animate it to the proper state in that direction
        if (siblingsRight.length) {
          gsap.to(siblingsRight, {x: "-20%",rotationY: -25, duration: 0.3, scale: 1, overwrite: true});
        }
      }));
      // when the mouse leaves, animate everything back to "normal".
      image.addEventListener("mouseleave", () => {
        gsap.to(images, {x: 0, rotationY: -25, scale: 1, duration: 0.3, overwrite: true});
        gsap.to(testimonial,{opacity:0, overwrite:true, scale:1, duration: 0.5})
        testimonial.innerHTML = null
      })
    });
    
    
    const cloudName = "doswrvsvp"
    const uploadPreset = "qdi8tfk0"
    
    var widget = cloudinary.createUploadWidget(
    {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        cropping: true, 
        croppingShowDimensions: true,
        croppingShowBackButton: true,
        multiple: false,
        sources: ["local", "url", "camera", "image_search", "google_drive", "facebook", "dropbox", "instagram", "shutterstock", 'unsplash'],
        defaultSource: "local",
        googleApiKey: "AIzaSyCUob7BOkIEqwI6ZeBgaTUd8mb_-r5kW0Y",
        dropboxAppKey: "7i2pqj2wc3p47by"
    },
    (error, result) => { 
        if (!error && result && result.event === "success") {
            console.log("result", result)
            contact_photo.value = "https://res.cloudinary.com/" + cloudName + "/f_auto,q_auto/" + result.info.public_id
            document.forms["fab_contact"].submit()
        }
    }
    );

    upload_email.addEventListener("input", e => {
        contact_email.value = upload_email.value  
    })
    
    upload_name.addEventListener("input", e => {
        contact_name.value = upload_name.value  
    })    
    
    upload_button.addEventListener("click", e => {
        /*
        const isValidEmail = upload_email.checkValidity()
        if (isValidEmail) {
            widget.open()
            widget.update({tags: ["fab", upload_email.value]});
        }
        */
       console.log("about to open widget")
        widget.open()
    })
    
    
    /* Create lightbox element */
    
    ScrollTrigger.matchMedia({
        // desktop
        "(min-width: 401px)": function() {
    
            const lightbox = document.getElementById('lightbox')
            dialogPolyfill.registerDialog(lightbox);
            
            const img = lightbox.querySelector('img')
            
            const images = gsap.utils.toArray("#gallery img")
            const nbImages = images.length
            const count = document.getElementById('lightbox-count')
            let previousElement = null;

            images.forEach((image,index) => {
                image.addEventListener("click", e => {
                    img.src = image.src
                    img.setAttribute('data-index',index)
                    let nb = index
                    count.innerHTML = ++nb + "/" + nbImages
                    previousElement = document.getElementById('upload-button')
                    lightbox.showModal()
                })
            })

            const close = document.getElementById('lightbox-close')
            close.addEventListener("click", e => {
                lightbox.close()
                previousElement.focus()
            })

            const next = document.getElementById('lightbox-next')
            next.addEventListener("click", e => {
                let imgIndex = img.dataset.index
                imgIndex++
                if (imgIndex>nbImages-1) {
                    imgIndex=0
                }
                let nb = imgIndex + 1
                count.innerHTML = nb + "/" + nbImages                
                img.src=images[imgIndex].src
                img.dataset.index = imgIndex
            })
            
            const prev = document.getElementById('lightbox-prev')
            prev.addEventListener("click", e => {
                let imgIndex = img.dataset.index
                imgIndex--
                if (imgIndex<0) {
                    imgIndex=nbImages-1
                }
                let nb = imgIndex + 1
                count.innerHTML = nb + "/" + nbImages
                img.src=images[imgIndex].src
                img.dataset.index = imgIndex
            })      
            
            document.addEventListener("keyup", (e) => {
                if (e.keyCode === 37 || e.keyCode === 39) { /* left arrow | right arrow */
                    if (e.keyCode === 37) {
                      prev.click();
                    } else {
                      next.click();
                    }
                }
            });            
            
        }
    })
}

init()
document.getElementById("img1").dispatchEvent(new Event('mouseenter', { 'bubbles': true }));
