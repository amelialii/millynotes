### Error handling

An example class:
```
struct Item {
    var price: Int
    var count: Int
}
class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Pretzels": Item(price: 7, count: 11)
    ]
    var coinsDeposited = 0
    func dispenseSnack(snack: String) {
        print("Dispensing \(snack)")
    }
	enum VendingMachineError: Error {
	    case InvalidSelection(desired: String)
	    case InsufficientFunds(coinsNeeded: Int)
	    case OutOfStock
	}
	
	// declare throws
	func vend(itemNamed name: String) throws -> String {
		guard var item = inventory[name] else {
            throw VendingMachineError.InvalidSelection(desired: name)
        }
        
        guard item.count > 0 else {
            throw VendingMachineError.OutOfStock
        }
        
        guard item.price <= coinsDeposited else {
            throw VendingMachineError.InsufficientFunds(coinsNeeded: item.price - coinsDeposited)
        }
        
        coinsDeposited -= item.price
        item.count -= 1
        inventory[name] = item
        dispenseSnack(snack: name)
        return name
    }
}
```

catch exceptions
```
let vm = VendingMachine()
do {
    vm.coinsDeposited = 12
    try vm.vend(itemNamed: "Diet Coke")
}
catch VendingMachineError.OutOfStock {
    print("I don't have any of that")
}
catch VendingMachineError.InsufficientFunds(let coinsReq) {
    print("You need more money: \(coinsReq), to be precise")
}
catch VendingMachineError.InvalidSelection(let desired) 
    where desired == "Diet Coke" {
    print("Sorry, we're a Pepsi place")
}
catch VendingMachineError.InvalidSelection(_) {
    print("We don't carry that")
}
catch {
    print("We really have no idea what went wrong")
}
```

