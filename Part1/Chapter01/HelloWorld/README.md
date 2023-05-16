# Chapter01/HelloWorld

Simple examples using D3 and HTML to test your installation.

## 1) Description of each file in this folder

__`1-svg-circle.html`__

Drawing a circle in a HTML page using SVG.

__`2-d3-append.html`__
    
Dynamically drawing a circle in a HTML page using D3.

__`3-binding-data.html`__
    
Binding a piece of data to the dynamically generated SVG code and drawing a circle using that data.

__`4-binding-data.html`__
    
Binding an array of several elements to generate several circles in different places.

__`5-updating.html`__
    
Updating the data and forcing the circles to be immediately repositioned according to the new data.

__`6-transition.html`__
    
Animating the update so that the circles take one second to move to their new places.

__`7-multiple-updates.html`__ [EXTRA EXAMPLE]
    
Using a single function for many updates, allowing the amount of data to change.

__`8-enter-exit.html`__ [EXTRA EXAMPLE]
    
Same as previous example, breaking down the general update pattern (enter, exit and merge selections).

    

## 2) How to run these examples

Any IDE or code editor that you use to edit HTML files can be used.

You need to be connected to the Internet, since all examples download the D3 library from a CDN (see other ways to
load the library in the `/Module-frontend` folder).

You also need to serve the files through a local web server. Most examples won't work if you simply open the file in a
browser. You can get one automatically if you use an IDE such as Visual Studio Code (with the Live Preview extension),
Adobe Brackets, GitHub Atom or JetBrains WebStorm/IDEA. These are all very popular Web editors and they all provide
automatic preview through a Web server (some might require a plugin).

If you prefer you can also use your console terminal to install (if necessary) and run a command-line server. If you
have NPM installed, install a simple web server using:

   ```npm install http-server```

then move to the folder where your HTML files are stored (your document root) and run:

   ```http-server```

You can now preview your files using http://localhost:8080/


## 3) Using a cloud-based editor

You can also cut and paste the examples in a cloud-based IDE such as _CodePen_ or _JSFiddle_, which are popular, very
easy to use and require minimum configuration (you just need to configure it informing the CDN URL of the D3 library).
You can start by forking the following examples, which are already set up. They contain the code from
`Chapter01/HelloWorld/2-d3-append.html`:

- JSFiddle: https://jsfiddle.net/helderdarocha/93fty6zh/1/
- CodePen:  https://codepen.io/helderdarocha/pen/xxazVeN

These are great to experiment with the code as you learn. Both have a console that help with debugging. You can
modify the code as much as you want, save it and share it. External files, however, will need to be loaded via a
separate URL.

You can, of course, use any other cloud-based IDE or sandbox of your choice.

## 4) Observable notebooks

_Observable_ notebooks are a playground where you can run code interactively. You can use them to experiment with code
and see the results immediately. You can the examples from this chapter here:

https://observablehq.com/d/90d319473e8012ae




