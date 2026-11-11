---
order: 17
---

### NON-automated testing

- Click around and try things yourself!
- Manual testing (team): usually has a list of things to click through
- User (research) testing: give users your site and let them click around


### Automated Testing of Code

- Definition: Automated tests are additional code that tests the code of a project
	- This includes how things should go correctly AND incorrectly
- Types of Tests
	- [[Unit Testing|Unit tests]]: test ONE thing
	- Integration Tests: isolate and test code that calls other code, for example, is this code connecting to the db?
	- System Tests/E2E Tests: test the overall system; E2E is the flow end-to-end, System is in the context of a prod-like environment
	- Stress Tests: test what happens when parts of the system fail
- Strategies:
	- Running Tests: Continuous Integration Testing
	- How do we know our tests are right?
		- Code Coverage
		- We don’t know (Skype/postmortems/rollbacks)
	- Best practices:
		- When something breaks in prod, the fix should include a test that would have caught that change/error
		- CI/CD testing: on PR, if something new is broken, block merge

<br>
`npm install --save-dev <package>`
- Installs the package as a **development dependency**.
- Adds it to the `"devDependencies"` section in `package.json`.
- Used when the package is **only needed during development** (e.g. for testing, building, or linting).

`npm test` run test in project
<br>
app.test.js
```
import { assert } from 'chai'
import request from 'supertest'

import app from '../app.js'

describe('Static server', () => {
    it('should return index.html if it is requested', async () => {
        const res = await request(app).get('/index.html')

        assert.equal(res.statusCode, 200)

        assert.include(
            res.text,
            '<script src="javascripts/index.js"></script>',
            "body has html code we recognize from index.html"
        )
    })

    it("should return 404 for a non-existing file", async() => {
        const res = await request(app).get("/fdmaifodamsf.html")
        assert.equal(res.statusCode, 404)
    })
})
```

example.test.js
```
import assert from 'assert'

describe('DemoTest', () => {
    it('should say 2+2 = 4', () => {
        assert.equal(2+2, 4)
    })

    it("should say 4+4 = 8", () => {
        assert.equal(4+4, 8)
    })

        it("should say 1+1 = 3", () => {
        assert.equal(1+1, 3)
    })
})
```

items.test.js
```
import { assert } from 'chai'
import request from 'supertest'

import app from '../app.js'

describe('Items integration test (with database)', () => {
    it('should get items from the db for GET items', async () => {
        const res = await request(app).get('/items')

        assert.equal(res.statusCode, 200)
        assert.equal(res.type, 'application/json')

        assert.isArray(res.body)
        assert.include(res.body[0], {
            name: "apple", 
            price: 2.99
        })
    })
})
```

package.json
```
{
  "name": "express-starter",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node ./bin/www",
    "test": "mocha"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "^4.19.2",
    "express-session": "^1.17.2",
    "mongoose": "^6.0.11",
    "morgan": "~1.9.1",
    "stripe": "^9.0.0"
  },
  "devDependencies": {
    "mocha": "^11.4.0"
  }
}
```