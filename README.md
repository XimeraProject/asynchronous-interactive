# Asynchronous Interactive

A common desire for online math textbooks is to provide "interactive
figures," i.e., graphics that are, in some fashion, interactive so
that learners can explore a mathematical context, make discoveries,
form conjectures, etc.  A challenge is the format in which to store
such interactive graphics: there are platforms like
[Desmos](https://www.desmos.com/), but such platforms don't provide
the full power of JavaScript.

An "asynchronous interactive" is an interactive widget described via
JavaScript code stored in an [AMD
module](https://en.wikipedia.org/wiki/Asynchronous_module_definition).