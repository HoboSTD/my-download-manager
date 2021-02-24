# my-download-manager
Something Awesome project for COMP6841 - Extended Security Engineering. It is a malicious browser
extension (DO NOT USE). 

## File Injection Test

How to use:

```
$ cd file-injection-test
$ gcc payload.c -o payload
$ gcc injection.c -o injection
$ cat payload >> injection
$ ./injection
```

Running injection the first time executes the code in `injection.c` and then runs `payload`. On all
subsequent executions `injection` will execute the `payload` binary.

This might not work if gcc compiles an injection that has a different number of bytes. If that's the
case you'd have to edit the define yourself.
