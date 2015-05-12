

var contactData = [
    {
        name: 'Alice',
        email: 'alice@wonderland.com',
        phone: '12 56 898 778'
    },
    {
        name: 'Bob',
        email: 'bob@sponge.com',
        phone: '78 96 458 587'
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
        m( '.ui.centered.grid',
           m( '.sixteen.wide.column'  ,
                  m( 'h3' , 'Welcome to the Mithril UI Router' )
           ),
           m( '.sixteen.wide.column'  ,
                m( 'p' , 'Use the above menu to navigate through the application state. Take a look below this area and see the state information.' )
           )
        ),
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
                    contactData.map( function ( contact , index ) {
                        return [
                            m( '.item' ,
                                m( 'i' , { class: 'right triangle icon' } ),
                                m( '.content' ,
                                    m( 'a' ,
                                        {
                                            class: 'header',
                                            onclick: function( ) { mx.route.go( 'main.contact.one' , { id: index } )}
                                        },
                                        contact.name
                                    )
                                )
                            )
                        ][0]
                    })

                )
            )
        ),
        m( '.ui.divider' ),
        m( '#one' )
    ]
}

var oneContact = {};
oneContact.controller = function( ) {
    this.contact = m.prop( contactData[ mx.route.param( 'id' ) ] );
}
oneContact.view = function( controller ) {
    return [
        m( '.ui.hidden.divider' ),
        m( '.ui.centered.grid',
            m( '.sixteen.wide.column'  ,
               m( 'h3' , controller.contact().name )
            ),
            m( '.one.wide.column'  , m( 'h5' , 'Email:' ) ),
            m( '.fifteen.wide.column'  , m( 'h5' , controller.contact().email ) ),
            m( '.one.wide.column'  , m( 'h5' , 'Phone:' ) ),
            m( '.fifteen.wide.column'  , m( 'h5' , controller.contact().phone ) )
        ),
        m( '.ui.hidden.divider' )

    ]
}

var about = {};
about.view = function() {
    return [
        m( '.ui.hidden.divider' ),
        m( '.ui.centered.grid',
           m( '.sixteen.wide.column'  ,
                m( 'h3' , 'About this application' )
           ),
           m( '.sixteen.wide.column'  ,
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
    oneContact: oneContact,
    about:      about
}

mx.route( app , 'main.home' , {
    'main' : {
        place:      '#app',
        module:     'main'
    },
     'main.home' : {
        url:        '/home',
        place:      '#content',
        module:     'home'
    },
    'main.contact' : {
        url:        '/contact',
        place:      '#content',
        module:     'contact'
    },
    'main.contact.one' : {
        url:        '/:id',
        place:      '#one',
        module:     'oneContact'
    },
    'main.about' : {
        url:        '/about',
        place:      '#content',
        module:     'about'
    }
});
