
Model-View-Controller

A way of organizing full stack web application code
	Model: Database and data representation
	View: How the data is displayed
	Controller: Connecting the model to the view
		Letting the view perform actions on the data
			For example, CRUD actions (Create, Read, Update, Delete)
	In our code:
		Model: Database, database connection and data organization definitions
		View: The client code in the public directory (html, css, js)
		Controller: The route handlers, allowing the view to perform operations on the model


#### Model

Database, [[MongoDB connection|database connection]] and data organizaitn definitions


#### Controllers

The route handlers, allowing the view to perform operations on the model


#### View

The client code in the "public directory" (html, css, js)


```
project-root/
│
├── public/              # View
│   ├── images/
│   ├── javascripts/
│   ├── stylesheets/
│   └── index.html
│
├── routes/              # Controller
│   └── api/v1/
│       ├── controllers/
│       │   └── users.js
│       ├── apiv1.js
│       └── index.js
│
├── models.js            # Model
│
├── app.js
├── package.json
├── package-lock.json
└── .gitignore
```

