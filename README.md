Slearch
=======

This extension add's a keyboard shortcut to Chrome. When pressing the `/` key Slearch will find the first search field it can on the page and focus it.

### Installing

This project has no dependencies so installation is simple, clone the project to a folder on your computer, tick `developer mode` and then follow the `load unpacked extension` process.

### Known Issues

It does not work on all pages, this is because it sometimes fails to find a search bar it can use if it is hidden behind a JavaScript method which does not trigger when the search bar is focused or it's not accessible. Plus others in the [issues](https://github.com/tim545/slearch-chromeBrowserExtension/issues) section.

### Other shortcuts added

While the search bar is focused you can also pres `esc` which will un-focus the search bar.

### For Developers/Publishers

If you maintain a website and would like the plugin to target a specific input on your page then you can hook into the selection by adding a `slearch` attribute to any `input` element, that input will then be used instead of any other search bars found.

### Contributing

If you would like to submit an update please send me a pull request.