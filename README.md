Mithril UI Router [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
=================

Mithril UI router is a routing framework for MithrilJS, which allows you to organize your interface into a state machine in the close way than [AngularUI Router](https://github.com/angular-ui/ui-router) does for AngularJS. So, unlike the `m.route` service in the which is organized around URL routes, Mithril UI router is organized around states, which may optionally have routes.

## Get Started

## Features

### The `mx.route` function

In order to define your state-based routing system, you need to specify the applicative variable into which you store your modules ( commonly a global `app` variable ), the name of your default state, and a key-value map of possible states.

The example below defines four root/nested states `home` , `dashboard`, `dashboard.widgetA` and `dashboard.widgetB`. We will explain the meaning step-by-step:

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

#### Nested state and view

#### Multiple views

#### On enter, on exit

### The `mx.route.go` function

### The `mx.route.param` function

### The `mx.route.current` function

## Roadmap


