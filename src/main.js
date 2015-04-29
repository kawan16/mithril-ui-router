

var contactData = [
    {
        name: 'Alice',
        email: 'alice@wonderland.com'
    },
    {
        name: 'Bob',
        email: 'bob@sponge.com'
    }
];


var menu = {}
menu.view = function( controller ) {
    return [
        m( '.ui.menu' ,
            m( 'a' ,
                {
                    class: mx.route.current() === 'home' ? 'active item' : 'item',
                    onclick: function( ) { mx.route.go( 'main.home' ); }
                } ,
                'Home'
            ),
            m( 'a' ,
                {
                    class: mx.route.current() === 'contact' ? 'active item' : 'item',
                    onclick: function( ) { mx.route.go( 'main.contact' );  }
                } ,
                'Contacts'
            ),
            m( 'a' ,
                {
                    class:  mx.route.current() === 'about' ? 'active item' : 'item',
                    onclick: function( ) { mx.route.go( 'main.about' ); }
                } ,
                'About'
            )
        )
    ];
};

var state = {};
state.view = function() {
    return [
        m( '.ui.segment' ,
            m( '.ui.hidden.divider' ),
            m( 'h4' , 'State : ' + mx.route.current() ),
            m( '.ui.hidden.divider' )
        )
    ]
}


var main = {};
main.view = function( controller ) {
    return [
        m( '.ui.hidden.divider' ),
        m( '.ui.page.grid',
            menu.view( controller ),
            m( '.ui.hidden.divider' ),
            m( '.ui.segment', m( '#content' ) ),
            m( '.ui.hidden.divider' ),
            state.view( controller )
        ),

    ];
};


var home = {};
home.view = function() {
    return [
        m( '.ui.hidden.divider' ),
        m( 'h3' , 'Welcome to the Mithril UI Router' ),
        m( '.ui.hidden.divider' ),
        m( 'h5' , 'Use the above menu to navigate through the application state. Take a look below this area and see the state information.' ),
        m( '.ui.hidden.divider' )
    ]
}

var contact = {};
contact.view = function() {
    return [
        m( '.ui.hidden.divider' ),
        m( 'h3' , 'Contacts' ),
        m( '.ui.centered.grid',
            m( '.sixteen.wide.column'  ,
                m( '.ui.list' ,
                    contactData.map( function ( contact ) {
                        return [
                            m( '.item' ,
                                m( 'i' , { class: 'right triangle icon' } ),
                                m( '.content' ,
                                    m( 'a' , { class: 'header' }, contact.name )
                                )
                            )
                        ][0]
                    })

                )
            )
        ),
        m( '.ui.hidden.divider' )
    ]
}

var about = {};
about.view = function() {
    return [
        m( '.ui.hidden.divider' ),
        m( '.ui.centered.grid',
           m( '.twelve.wide.column'  ,
                m( 'h3' , 'About this application' )
           ),
           m( '.twelve.wide.column'  ,
               m( 'p' , 'This Mithril application shows Mithril Ui Router in action. Take a look at the source code to see how it works.' )
           )
        ),
        m( '.ui.hidden.divider' )
    ]
}


var app = {
    main:       main,
    home:       home,
    contact:    contact,
    about:      about
}

mx.route( app , 'main.home' , {
    'main' : {
        place:      'app',
        module:     'main'
    },
     'main.home' : {
        url:        '/home',
        place:      'content',
        module:     'home'
    },
    'main.contact' : {
        url:        '/contact',
        place:      'content',
        module:     'contact'
    },
    'main.about' : {
        url:        '/about',
        place:      'content',
        module:     'about'
    }
});
