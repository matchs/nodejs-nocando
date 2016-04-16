# NoCanDo

## Index

1. [Motivation/Inspiration]()
2. [Installation](#installation)
3. [Basic Usage](#basic usage)
4. [Examples](#examples)
    * 4.1. [NoCanDo + Express]()
    * 4.2. [NoCanDo + Koa]()
    * 4.3. [NoCanDo + Hapi]()
    * 4.4. [NoCanDo + Restify]()
5. [API](#api)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)


# 1. Motivation/Inspiratoin

NoCanDo is strongly inspired by [ryanb's CanCan](https://github.com/ryanb/cancan) and [jusbrasil's PyCan](https://github.com/jusbrasil/pycan).


# 2. Installation
```
    npm install --save nocando
```

# 3. Basic Usage
```javascript

var nocando = require('nocando');

var ruler = new nocando.Ruler();

ruler.can()
     .can();

var user = {

},
    does = 'POST',
    what = {

};

ruler
    .authorize(user, does, what)
    .then(() => {

    })
    .catch((e) => {

    });

```

# 4. Examples
## 4.1. NoCanDo + [Express](http://expressjs.com/)

## 4.2. NoCanDo + [Koa](http://koajs.com/)

## 4.3. NoCanDo + [Hapi](http://hapijs.com/)

## 4.4. NoCanDo + [Restify](http://restify.com/)
# 5. API

# 6. Testing
```
    npm test
```

# 7. Contributing


# 8. License
```
The MIT License (MIT)

Copyright (c) 2016 Mateus Chagas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
