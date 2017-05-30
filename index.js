const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const express = require('express');
const serveur = 'http://serveur.network-drian.ovh:8083';
var app = express();

passport.use(new SamlStrategy(
    {
        path: '/login/callback',
        entryPoint: 'https://idp.ssocircle.com/',
        issuer: serveur
    },
    function(profile, done) {
        console.log(profile);
        if(profile) done(null, {profile : profile});
    })
);

app.get('/metadata', function (req, res) {

        //Send custom metadata
        res.type('application/xml');
        res.sendfile(__dirname + "/metadata.xml");
    }
);

app.get("/login", passport.authenticate('saml',
    {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.post('/login/callback', passport.authenticate('saml',
    {
        failureRedirect: '/',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/');
    }
);

/*app.get('/logout', auth.requiresLogin, function (req, res) {

    req.user.nameID = req.user.saml.nameID;

    req.user.nameIDFormat = req.user.saml.nameIDFormat;

    samlStrategy.logout(req, function (err, request) {
        if (!err) {
            res.redirect(request);
        }
    });

});*/

const port = 8083;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});