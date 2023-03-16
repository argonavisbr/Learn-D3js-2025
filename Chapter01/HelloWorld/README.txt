#Chapter01/HelloWorld

Simple examples using D3 and HTML to test your installation.

##1) How to run these examples

You need to be connected to the Internet, since all examples download the D3 library from a CDN (see other ways to
load the library in the /Module-frontend folder).

You also need to have a local web server running. You can get one automatically if you use an IDE such as Visual Studio
Code (with the Live Preview extension), Brackets, Atom or WebStorm, which provide automatic preview through a Web server.

If you prefer you can also use your console terminal to install (if necessary) and run a command-line server. If you
have NPM installed, install a simple web server using:

   ```npm install http-server```

then move to the folder where your HTML files are stored (your document root) and run:

   ```http-server```

You can now preview your files using http://localhost:8080/

You can also cut and paste the examples in a cloud-based IDE such as CodePen or JSFiddle, but you will first need to
set up your environment to load the D3.js library.


##2) Description of each file

1-svg-circle.html
    Drawing a circle in a HTML page using SVG.

2-d3-append.html
    Dynamically drawing a circle in a HTML page using D3.

3-binding-data.html
    Binding a piece of data to the dynamically generated SVG code and drawing a circle using that data.

4-binding-data.html
    Binding an array of several elements to generate several circles in different places.

5-updating.html
    Updating the data and forcing the circles to be immediately repositioned according to the new data.

6-transition.html
    Animating the update so that the circles take one second to move to their new places.

7-multiple-updates.html [EXTRA EXAMPLE]
    Using a single function for many updates, allowing the amount of data to change.

8-enter-exit.html [EXTRA EXAMPLE]
    Same as previous example, breaking down the general update pattern (enter, exit and merge selections).

