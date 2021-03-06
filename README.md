# Sapir
Portable JavaScript renderer of swagger files (OpenAPI specification)

By adding a one-line comment to your swagger/OpenAPI specification file, you can turn it into a self-rendering html file.
**No tools/libs/npm/server required!**

1. Rename/copy `swagger.json` to `swagger.html`
2. Insert the following line at the top of your `swagger.html` file

   ```#<script src='https://rawgit.com/kristofferingemansson/sapir/master/sapir.js'></script><script type='application/json'>```
3. Open `swagger.html` in your browser
4. Enjoy your documentation in hurman readable form!

## Limitations
1. Currently only works with JSON, not with YAML
2. Styles does not work in all browsers, use Chrome or Firefox for now
3. Lacks support for parts of swagger/OpenAPI specification
4. Rendering of schema fields very rudimentary

![GA tracking](https://www.google-analytics.com/collect?v=1&tid=UA-4881464-7&dp=/)
