---
order: 5
---

#### Definitions

a "key" is a string that identifies a specific property
"key path" is dot-separated keys used to specify a sequence of object properties to traverse
keys or key paths can be runtime strings or compile-time constants
a "value" is the value stored in the property


```
class Person : NSObject {
  @objc dynamic var firstName = ""
  @objc dynamic var lastName = ""
  @objc dynamic var age = 0
}
let p = Person()
p.firstName = "Fred"
```

We can access the property by "key"

```
let pkeyPath = #keyPath(Person.firstName)
if let value = p.value(forKey: pkeyPath) {
  print(value)  // "Fred"
}
if let value = p.value(forKey: "firstName") {
  print(value)  // "Fred"
}
```


