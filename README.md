# gdlint

A linter for GDScript programming language. It enforces following the official style guide (http://docs.godotengine.org/en/3.0/getting_started/scripting/gdscript/gdscript_styleguide.html) + has some additional rules.
In active development. Use at your own risk!

# Installation

`yarn global add gdlint`

or

`npm install gdlint -g`

# Usage

First, you need to export the Abstract Syntax Tree for your GDscript files. It can be done with the related modified fork of godot gaming engine:

https://github.com/hedin-hiervard/godot

It's done like this:

`godot --script <your_script> --output-ast <ast_file>`

Then you can lint it with:

`gdlint <your_script> <your_ast>`

The output is targeted to be fully compatible with the output of `eslint`.

# Sample output

```
gdlint ~/Projects/DS/scripts/root.gd ~/Projects/DS/tmp/scripts/root.gd.json 
/Users/hedin/Projects/DS/scripts/root.gd
  57:1   error  block must not end with newline  no-padded-blocks
  112:1   error  block must not start with newline  no-padded-blocks
  163:1   error  block must not end with newline  no-padded-blocks
  178:5   error  block must not start with newline  no-padded-blocks
  181:5   error  block must not start with newline  no-padded-blocks
  184:5   error  block must not start with newline  no-padded-blocks
  190:1   error  block must not end with newline  no-padded-blocks
  156:5   error  usage of print() is discouraged, use a custom logger instead  no-print-call
  172:23   error  usage of print() is discouraged, use a custom logger instead  no-print-call
  97:16   error  one statement per line  one-statement-per-line
  172:21   error  one statement per line  one-statement-per-line

✖ 11 issues (11 errors; 0 warnings)
```
