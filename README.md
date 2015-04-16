Mithril UI Router [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
=================

Mithril UI router is a routing framework for MithrilJS, which allows you to organize your interface into a state machine in the similar way than [AngularUI Router](https://github.com/angular-ui/ui-router) does for AngularJS. So, unlike the `m.route` service in the which is organized around URL routes, Mithril UI router is organized around states, which may optionally have routes.

## Get Started

## How to use it

### The `mx.route` function

In order to define your state-based routing system, you need to specify the applicative variable into which you store your modules ( commonly a global `app` variable ), the name of your default state, and a key-value map of possible states.

The example below defines four root/nested states `home` , `dashboard`, `dashboard.widgetA` and `dashboard.widgetB`:

```js
  mx.route( app , 'home' , {
      'home': {
        url: '',
        module: 'home',
        place: 'app'
      },
      'dashboard': {
        url: '/dashboard',
        module: 'dashboard',
        place: 'main'
      },
      'dashboard.widgetA': {
        url: '/widgetA',
        module: 'dashboard.widgetA',
        place: 'widget'
      },
      'dashboard.widgetB': {
        url: '/widgetB',
        module: 'dashboard.widgetB',
        place: 'widget'
      }
   });
```

#### Simple state

The given state `home` is a simple state. It refers to the url root of the application and basically sets up, as initial state, the module `app.home` ( specifying by `module: 'home'` property) in the DOM element with identifier `app` ( given by `place: 'app'`) . 

Suppose the module `app.home`:
```js
 app.home = {
    view: function() { [ return m( 'h1' , 'Home ! ) , m( '.main' ) ] }
 }
```
and a body of `index.html`:
```html
  <div id="app"> </div>
```

By accessing to the `home` state, the document will become: 
```html
  <div id="app">
    <h1> Hello !</h1>
    <div id="main"></div>
  </div>
```

#### Nested state and view

The given state `dashboard.widgetA` is a nested state. Before setting up its configuration, the router sets up the state  `dashboard` ( if it has not already been active ). The url related to this state will be `BASE_URL/dashboard/widgetA`. The module `app.dashboard.widgetA` will be installed in the div element with id `widget`. 

Suppose the module `app.home`:
```js
 app.dashboard = {
    view: function() { [ return m( 'h2' , 'My dashboard' ) , m( '.widget' ) ] }
 }
 
 app.dashboard.widgetA = {
    view: function() { [ return m( 'h3' , 'My widget A' ) ] }
 }
```

Given the previous conditions; the resulting Html will be:

```html
  <div id="app">
    <h1> Hello !</h1>
    <div id="main">
      <h2> My dashboard </h2>
      <div id="widget">
         <h3> My widget A </h3>
       </div>
    </div>
  </div>
```


#### Multiple views

A state may have different views i.e. combinations of module/place. Given: 

```js
  var app = {};
  app.moduleA = { view: function() { return m( 'h1' , 'Module A'} );
  app.moduleB = { view: function() { return m( 'h1' , 'Module B'} );

  mx.route( app , 'main' , {
      'main': {
        url: '',
        places: {
          'placeA': 'moduleA',
          'placeB': 'moduleB',
        }
      }
   });
```

The activation of state `main` will produce the installation of the module `app.moduleA` in the element with id `placeA` while the module `app.moduleB` in the element with id `placeB`. That will output this kind of Html: 


```html
  <div id="placeA">
    <h1> Module A </h1>
  </div>
  <div id="placeB">
    <h1> Module B </h1>
  </div>
```

#### On enter, on exit

A state may have an `onEnter` ( respectively `onExit` ) function which will be called whenever one enters ( respectively leaves ) it. 

```js
  mx.route( app , 'main' , {
      'main': {
        url: '',
        module: 'main',
        place: 'main',
        onEnter: function() { /* On enter */ },
        onExit: function() { /* On exit */ }
      }
   });
```

### The `mx.route.go` function

### The `mx.route.param` function

### The `mx.route.current` function

## Roadmap


