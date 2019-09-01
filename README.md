# Girls' Frontline New Tab
> A single page web application that displays high definition images of Girl's Frontline Themed backgrounds on your new tab! It comes with a Weather Feature set to Long Beach and Post it notes!

## Site is hosted on
https://lazer7.github.io/LazerFrontLine/


## Adding New Images
- Add your new images into the assets folder and rename it to <number>.extension
- Go to the css folder and in the main.css insert according to the number of images you have added
```
    .image<number> {
        background-image: url("../assets/<number>.extension");
        /* The image used */
        background-color: #cccccc;
        /* Used if the image is unavailable */
        background-repeat: no-repeat;
        /* Do not repeat the image */
        background-size: cover;
        /* Resize the background image to cover the entire container */
    }
```
- Go to the js folder and in main.js line 275
```  return "hero is-fullheight image" + Math.floor((Math.random() * 24) + 1);```
Change the number 24 to that + the number of images you have added