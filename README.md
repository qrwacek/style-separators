# Style Separators

Improve readability of your style files by adding separators to your style blocks with this vscode extension.

## Usage

Select `Add Style Separators` command from command prompt (`Cmd/Ctrl+Shift+P`)

## Features

Adds separators to style blocks keeping block indentation. Following blocks are supported

### Class names

Adds separators using class name as a title

```scss
.content {

}
```
becomes
```scss
// content
// ---------------------------------------------------------------------------------------------------------------------
.content {

}
```

### Class variants

Adds separators using variant name as a title

```scss
.content {
    &-large {

    }
}
```
becomes
```scss
// content
// ---------------------------------------------------------------------------------------------------------------------
.content {

    // variant large
    // -----------------------------------------------------------------------------------------------------------------
    &-large {

    }
}
```

### Class states

Adds separators using state name as a title

```scss
.content {
    &.is-active {

    }
}
```
becomes
```scss
// content
// ---------------------------------------------------------------------------------------------------------------------
.content {

    // state is-active
    // -----------------------------------------------------------------------------------------------------------------
    &.is-active {

    }
}
```

### Other blocks

Adds separators with empty title

```scss
@include something() {

}
```
becomes
```scss
// 
// ---------------------------------------------------------------------------------------------------------------------
@include something() {

}
```

## Settings

* `styleSeparators.lineWidth`: Maximum line width of the separator (defaults to `120`)
* `styleSeparators.lineCharacter`: Character used to create separator line (defaults to `-`)
* `styleSeparators.variantPrefix`: Prefix used to detect class variant (defaults to `&--`)
* `styleSeparators.variantTitle`: Template used for variant title. `{variant}` will be replaced with variant name (defaults to `variant {variant}`)
* `styleSeparators.statePrefix`: Prefix used to detect class state (defaults to `&.`)
* `styleSeparators.stateTitle`: Template used for state title. `{state}` will be replaced with state name (defaults to `state {state}`)

## Known issues

* currently supporting only single line block definitions
