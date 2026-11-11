---
order: 2
---

new instance
```
var aPoint = Point(x:2, y:3)
print("aPoint = \(aPoint.stringified)")
var anotherPoint = aPoint
aPoint.x = 12
print("anotherPoint = \(anotherPoint), aPoint = \(aPoint)")
```

```
class Person {
  let firstName : String
  let lastName : String
  var spouse : Person?

  init(first: String, last: String) {
      firstName = first
      lastName = last
  }
  deinit {
    print("\(firstName) is being deinitialized")
  }
}

var b = Person(first: "Brad", last: "Pitt")
var a = Person(first: "Angela", last: "Jolie")
b.spouse = angelina
a.spouse = brad
```


defining and calling methods on structs
```
 // ... still in struct Point ...
  func stringRep() -> String {
    return "(\(self.x),\(self.y))"
  }
  static func compare(left: Point, right: Point) -> Bool {
    return (left.x == right.x) && (left.y == right.y)
  }
var o = Point.ORIGIN
print(o.stringRep())
if Point.compare(left: o, right: Point.ORIGIN) {
  print("Yep, they point to the same place")
}
o.move(x: 3, y:5)
print(o.stringRep())
```

```
  init(x:Int32, y:Int32) {
    self.x = x
    self.y = y
  }
  init(x:Int32, y:Int32, name: String) {
    self.x = x
    self.y = y
    self.name = name
  }
  init(y: Int32, x: Int32) {
    self.x = x
    self.y = y
  }
  init(pt: Point, offsetX: Int32 = 0, offsetY : Int32 = 0) {
    self = pt
    self.move(x: offsetX, y:offsetY)
  }
}
```


###### Failable initializers

Use "init?"
	Return nil if constuction should fail
	Makes the receiving reference an optional

Use "init!"
	Return unwrapped optional
	Makes the receiving reference an optional


