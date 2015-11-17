# Twitter-list

## Objective :

Build an application to sort easily your followings into lists.

## Stack :

- AngularJS
- Hull.io
- Twitter API.

## Setup

Run the following command :

```
$ npm install
$ bower install
$ gulp // launch gulp (will be run by default on 8042 port)
```

## Mock

If you want to perform some tests without calling the Twitter API you can use json-server on the db.json mock file.

```
$ json-server --watch db.json // launch a mock server for test (will run by default on 3000 port)
```
... And in that case do not forget to turn isMock const to true in app.js ;-)

## Incoming features

See the github's wiki concerning the next todos and features.