---
order: 7
---

"An automated piece of code that invokes a unit of work in the system and then checks a single assumption about the behavior of that unit of work."


#### "AAA" pattern of tests

Arrange
	establish a baseline
	this may require several steps
	may also require the use of "mock objects"
Act
	have the code under test do something
	typically keep it to "just one thing"
Assert
	examine the results
	compare against expected results


### XCUnitTest

XCTestCase: base class for unit test suite
	`setUp()`: run before each individual test
	`tearDown()`: run after each individual test
	write "test" methods
		accept no parameters
		return no value
		prefixed with "test" in the name
	write "performance test" methods
		use "self.measure { ... }" to mesaure time to execute

XCTAssert...: assertion functions
	XCTAssert: expression yields true
	XCTAssertTrue: boolean condition is true
	XCTAssertFalse: boolean condition is false
	XCTAssertNil: expression yields Nil
	XCTAssertEqual: two expressions are equal
	XCTAssertNotEqual: two expressions are inequal
	... and a few others
	all overloaded to take a trailing "message" argument
		this message is what's displayed when the test fails