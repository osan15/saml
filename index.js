const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const express = require('express');
const serveur = 'http://serveur.network-drian.ovh:8083';
var app = express();

passport.use(new SamlStrategy(
    {
        entryPoint: 'https://idp.ssocircle.com/sso/idpssoinit?metaAlias=%2Fpublicidp&spEntityID=http://serveur.network-drian.ovh:8083/metadata',
        issuer: serveur,
        callbackUrl: 'http://serveur.network-drian.ovh:8083/login/callback/',
    },
    function (profile, done) {
        console.log(profile);
        if (profile) {
            return done(null,
                {
                    id: profile.id,
                    email: profile.email,
                    // displayName: profile.cn,
                    //  firstName: profile.givenName,
                    // lastName: profile.sn,
                    sessionIndex: profile.sessionIndex,
                    saml: {
                        nameID: profile.nameID,
                        nameIDFormat: profile.nameIDFormat,
                        token: profile.getAssertionXml()
                    }
                });
        }
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