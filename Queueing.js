/*\
 *  Queueing
\*/

function Queue () {
  return {
      add: function(fn) {
        var s = this._stack
        if (typeof fn == "function") {
          s.push(fn)
        }else{
          var a = fn
          s.push(function(next) {
            console.log(a)
            var args = Array.prototype.slice.call(arguments).slice(1)
            next.apply(null, args)
          })
        }
      }
    , _next: function() {
        if (!this._stack.length) return
        var args = Array.prototype.slice.call(arguments)
          , t = this
        args.unshift(function() { return t._next.apply(t, arguments); })
        this._stack.shift().apply(null, args)
      }
    , run: function() { this._next() }
    , _stack: []
  }
}

/*\
 *  Example and Demo
\*/

var q = new Queue

console.log("\n\nThis is a demo of Wizek's generic Queueing script.")

q.add(function(next) {
  console.log("\nYou usually want to pass a function to `new Queue.add()`, but...")
  next()
})

q.add("    non-functions can be passed too")

var msg = { even: 'Objects', or: [ 'Arrays', 'will', 'work' ] }
q.add(msg)

q.add(function(next) {
  console.log("\nnext() also supports...")
  next("    argument-forwarding!")
})

q.add(function(next, passedArgument) {
  console.log(passedArgument)
  next()
})

q.add(function(next) {
  console.log("\nEven if there are")
  next("    intersecting non-functions in one queue.")
})

q.add("    -- some,")
q.add("    or many --")

q.add(function(next, passedArgument) {
  console.log(passedArgument)
  process.exit()
})

q.run()

/*\
 * Outputs:
 *
 * This is a demo of Wizek's generic Queueing script.
 * 
 * You usually want to pass a function to `new Queue.add()`, but...
 *     non-functions can be passed too
 * { even: 'Objects', or: [ 'Arrays', 'will', 'work' ] }
 * 
 * next() also supports...
 *     argument-forwarding!
 * 
 * Even if there are
 *     -- some,
 *     or many --
 *     intersecting non-functions in one queue.
 *
\*/