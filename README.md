Slearch
=======

This extension add's a keyboard shortcut to Chrome. When pressing the `/` key Slearch will find the first search field it can on the page and focus it.

### Installing

This project has no dependencies so installation is simple, clone the project to a folder on your computer, tick `developer mode` and then follow the `load unpacked extension` process.

### Other shortcuts added

While the search bar is focused you can also pres `esc` which will un-focus the search bar.

### Known Issues

It does not always find a search bar if it is hidden behind a JavaScript method which does not trigger when the search bar is focused.

Non accessible search bars often don't work, this might be because the search input is not an input field but instead a general element such as a `<div>`.

Some web pages have multiple search bars performing the same function, for example one for the mobile another for the desktop layout the first input found by the extension will be used, which could be the hidden one.

If the search bar is inside a sticky header the extension will jump back to the top of the page as that's where the input is placed in the HTML.

There may be more in the [issues](https://github.com/tim545/slearch-chromeBrowserExtension/issues) section, or if not then feel free to add one.

### For Developers/Publishers

If you maintain a website and would like the extension to target a specific input on your page then you can hook into the selection by adding a `slearch` attribute to any `input` element, that input will then be used instead of any other search bars found.

### Contributing

If you would like to submit an update please send me a pull request.
