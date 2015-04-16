Mithril UI Router [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
=================

Mithril UI router is a routing framework for MithrilJS, which allows you to organize your interface into a state machine in the close way than [AngularUI Router](https://github.com/angular-ui/ui-router) does for AngularJS. So, unlike the `m.route` service in the which is organized around URL routes, Mithril UI router is organized around states, which may optionally have routes.

## Get Started

## Features

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
    view: function() { return m( 'h1' , 'Home ! ) }
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
  </div>
```

#### Nested state and view

#### Multiple views

#### On enter, on exit

### The `mx.route.go` function

### The `mx.route.param` function

### The `mx.route.current` function

## Roadmap


