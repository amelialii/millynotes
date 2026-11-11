---
order: 0
---

#### variable types

```
bool
Int, UInt: size inferred by platform
Float, Double
Character, String
```


#### opereators

```
+ - * / (but not %)
+= -= *= /= (but not %= ++ or --)
```


#### variable declaration

constants: let
variables: var


#### control flow

###### if

```
var temperatureInFahrenheit = 30
if temperatureInFahrenheit <= 32 {
  print("It's very cold. Consider wearing a scarf.")
}
else if temperatureInFahrenheit > 80 {
  print("Holy crud! It's hot!")
}
else {
  print("Quit yer whinin'.")
}
```


###### switch

```
let temp = 30
switch temp {
  case 0:
    print("Brr! Freezing!")
  case 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
       11, 12, 13, 14, 15, 16, 17, 18:
    print("Still damn cold!")
  default:
    print("Meh")
}
```


###### while & repeat while

```
var index : Int = 0
while index < 5 {
  print("This is the \(index)th time I've said this")
  index += 1
}

var anotherIndex : Int = 0
repeat {
  print("This is the \(index)th time I've said this")
  anotherIndex += 1
} while anotherIndex < 5
```


#### composite types

###### arrays

```
var shoppingList : [String] =
  ["catfish", "water", "tulips", "blue paint"]
shoppingList[1] = "bottle of water"
print("I bought a \(shoppingList[1])")
print("She bought \(shoppingList)")
    
// Use for-in over an array
let names = ["Alice", "Bob", "Mallory", "Eve", "Trent"]
for name in names {
  print("Hello, \(name)!")
}
```


###### dictionaries

```
var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
let malJob = occupations["Malcolm"]
print("Mal is the \(malJob)")
print("People work as \(occupations)")
    
var explore = [ 4.5 : "StringValue" ]
print("Can we key by doubles? \(explore[4.5])")
    
// Use for-in over dictionaries
for (key, value) in occupations {
  print("\(key) is the \(value)")
}
```


###### enums

```
enum CompassPoint {
    case North
    case South
    case East
    case West
}
enum Planet {
    case Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
}
    
var direction = CompassPoint.North
switch direction {
    case .North: print("Brrr cold")
    case .South: print("Watch out for penguins")
    case .West : print("Where rises the Sun")
    case .East : print("Where sets the Sun")
}
```


###### tuples

unnamed grouping of values
```
var city = ("Seattle", "Washington", 5000000)
var person = ("Teresa", "Nguyen", 39)
var ssi = city
ssi = person
    // Structurally typed!
print(ssi)
print(ssi.0)
```


#### functions

```
func sayHello(personName : String) -> String {
    return "Hello, \(personName)"
}
print(sayHello(personName: "Fred"))
```


###### nested functions

```
func chooseStepFunction(backwards: Bool) -> (Int) -> Int {
    func stepForward(input: Int) -> Int { return input + 1 }
    func stepBackward(input: Int) -> Int { return input - 1 }
    return backwards ? stepBackward : stepForward
}
var currentValue = -2
let moveNearerToZero = chooseStepFunction(backwards: currentValue > 0)
while currentValue != 0 {
    print("\(currentValue)... ")
    currentValue = moveNearerToZero(currentValue)
}
print("zero!")
// -2...
// -1...
// zero!
```