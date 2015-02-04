OAuth2 jQuery
=============

An example for using OAuth2 (Facebook Connect) with LDS Connect and jQuery

This is a template for gracefully handling the browser component of **server-side** OAuth2.

Although it does rely on a server, you can remove the server redirects so that you
provide your users with a seamless experience that doesn't disrupt their flow in
your application.

Screencast
==========

See <https://youtu.be/PSVsKcCnPF4>.

Zero-Config Install and Run
================

You can start working with test user data immediately.

1. Clone Backend
----------------

If you haven't already, clone a backend first

```bash
git clone git@github.com:LDSorg/passport-lds-connect-example.git

pushd passport-lds-connect-example

npm install
```

2. Clone Frontend
-----------------

You need to clone the frontend 

See [github.com/ldsorg](https://github.com/ldsorg?query=oauth2-) for a list of frontends examples / seed projects.

```bash
# The jQuery Example
git clone git@github.com:LDSorg/oauth2-jquery public
```

3. Run Server
-------------

```bash
node ./serve.js
```

4. Go to <https://local.ldsconnect.org:8043>
----------

**This domain points to YOUR computer**.

**DO NOT USE 127.0.0.1 or localhost**.

<https://local.ldsconnect.org:8043> uses a valid SSL certificate for
HTTPS and points to 127.0.0.1.

Even in development you should never be using insecure connections.
Welcome to 2015. [Get used to it](https://letsencrypt.org)!

The development test keys are already installed. Once you've fired up the server navigate to <https://local.ldsconnect.org:8043>.

**Note**:
It's important that you use `local.ldsconnect.org` rather than `localhost`
because the way that many OAuth2 implementations validate domains requires
having an actual domain. Also, you will be testing with **SSL on** so that
your development environment mirrors your production environment.

5. Login as dumbledore
-----------

You **cannot** login as a real lds.org user as a test application.
If you try, you will get an error.

The login you must use for test applications is `dumbledore` with the passphrase `secret`.

Create a Backend in your Favorite Language
=====

1. Create a backend in the language of your choice
2. Follow the API outlined below
3. Clone this project as your public folder
4. Run your server, serving the public folder staticly

And remember:

```bash
bower install
```

Implement this API
===

For this example **you must implement these endpoints** in your the server you create:

(replace `{{provider}}` with `facebook` or `ldsconnect` appropriately)

/auth/{{provider}}
--------------

Examples:

* /auth/facebook
* /auth/ldsconnect

The endpoint you create for these may set some options in your OAuth2 library and will then redirect to

  * (facebook) https://www.facebook.com/dialog/oauth
  * (ldsconnect) https://ldsconnect.org/dialog/authorize

/auth/{{provider}}/callback
-----------------------

Examples:

* /auth/facebook/callback
* /auth/ldsconnect/callback


This is the endpoint to which facebook (or lds connect) will respond with your
grant code (`https://example.com/auth/facebook/callback?code=xxxxxxxxxxxx`).

Old school style would be to set this endpoint as any arbitrary string and your server
would redirect to (hopefully) the page that your user was on with everything retemplated.

However, to make for a seamless user experience, you will instead send the contents
of `oauth-close.html` as the response (DO NOT REDIRECT) and jQuery will grab the
session info based on the success or failure indicated in the url
(i.e. it may be
`https://example.com/auth/facebook/callback?error=NOT_AUTHORIZED`
instead of having a code).

Use these API Tokens
----------

For convenience, we provider fully working test API keys that you can test with on localhost. Get your example working first with Facebook, then substite the appropriate strings with LDS Connect.

**Note**: These examples **will not work** with `127.0.0.1:3000` or `localhost:300` (even though they must run locally), you must use the appropriate domain name and port (which point to `127.0.0.1`).

### Facebook Connect

| OAuth2 Param     | Value                                         |
|:------           |:------                                        |
|Authorization URL | https://www.facebook.com/dialog/oauth         |
| Token URL        | https://graph.facebook.com/oauth/access_token |
| Profile URL      | https://graph.facebook.com/me                 |
| App ID           | 746913342088510                               |
| App Secret       | ad539732cbfbd60169f32336e257b37c              |
| Callback URL     | http://local.foobar3000.com:4080              |

### LDS Connect

OAuth2 URLs and API Keys

| OAuth2 Param     | Value                                         |
|:------           |:------                                        |
|Authorization URL | https://ldsconnect.org/dialog/authorize       |
| Token URL        | https://ldsconnect.org/oauth/token            |
| Profile URL      | https://ldsconnect.org/api/ldsconnect/me      |
| App ID           | 55c7-test-bd03                                |
| App Secret       | 6b2fc4f5-test-8126-64e0-b9aa0ce9a50d          |
| Callback URL     | https://local.ldsconnect.org:8043             |


Your LDS Account will not be able to login to test applications. You must use:

| test user  | passphrase |
|------------|------------|
| dumbledore | secret     |

You will need to use TLS/SSL with HTTPS in order to register your production app. Start by testing your app with these certificates. Then watch the video to see how to purchase your own.

| Certificate         | PEM File |
|:--------------------|:---------|
| intermediate ca public crt  | [intermediate.crt.pem](https://raw.githubusercontent.com/LDSorg/passport-lds-connect-example/master/certs/ca/intermediate.crt.pem) |
| server public crt   | [my-server.crt.pem](https://github.com/LDSorg/passport-lds-connect-example/blob/master/certs/server/my-server.crt.pem) |
| server private key  | [my-server.key.pem](https://github.com/LDSorg/passport-lds-connect-example/blob/master/certs/server/my-server.key.pem) |

Screencast: SSL Certificates
----------

[Getting SSL Certs with Name.com](https://www.youtube.com/watch?v=r92gqYHJc5c)

FIY: Server-Side vs Client-Only OAuth2
==============

Just an FYI for the curious...

Bottom Line: client-only oauth2 is convenient and seamless,
but can't be secured from spoofing by malicious clients
(hacked android apks, rooted iphones, non-standard browsers like curl, mechanize, phantom).

With server-side oauth2, you must provide your App ID and App Secret.
In client-only (browser, android, etc) oauth2, you only provide your App ID
and use some other means of authenticating - such as a username and password
or restricted access to a single TLS/SSL secured HTTPS domain.

With server-side oauth2 you generally get a token that lasts longer
(days instead of hours) and you may be able to request certain scopes
that are not allowed to be requested by client-only oauth2 strategies.
