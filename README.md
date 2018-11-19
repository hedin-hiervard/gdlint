# gdlint

A linter for GDScript programming language. It enforces following the official style guid (http://docs.godotengine.org/en/3.0/getting_started/scripting/gdscript/gdscript_styleguide.html) + has some additional rules.
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


