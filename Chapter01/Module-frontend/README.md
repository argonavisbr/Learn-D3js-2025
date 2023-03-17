# Chapter01/Module-frontend

How to import the D3 library using frontend JavaScript or HTML.

## 2) Description of each file in this folder

`1-legacy-cdn.html`

    Loads D3 library from a CDN using the <script> tag. The type="module" attribute allows modern browsers to defer
    loading the script after rendering the page. Older browsers will ignore this.

`2-legacy-local.html`

    Loads D3 library from a local file using the <script> tag. The type="module" attribute allows modern browsers to
    defer loading the script after rendering the page. Older browsers will ignore this.

`3-import-cdn.html`

    Imports the D3 library as an ES module stored in a CDN. Only works in modern browsers.

`4-import-local.html`
 
   Imports the D3 library as an ES module stored locally. Only works in modern browsers.

See also examples in `Chapter16/` for importing modules using NPM.
