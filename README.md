# nys-chat
Real time chat app with Angular, Node and MongoDb using socket-io
## Quick Start
### Installation and usage

``` $ npm install``` <br />
``` $ npm start```

### Configuration

#### appSettings

By default, app is set to connect to local mongo db. In order to connect to any cloud mongo make necessary changes.</li>

```javascript
var config = {};

<!-- cloud mongo start  -->
<!-- config.mongodb=''; -->
<!-- config.mongodb_username=''; -->
<!-- config.mongodb_password=''; -->
<!-- cloud mongo end  -->

<!-- local mongo start  -->
config.mongodb="mongodb://localhost/nyschat";
<!-- local mongo end  -->

module.exports = config;
```

#### environment

 Change serverIp to the IP of your server. Systems which are in same network can access the app through browser.

```javascript
export const environment = {
  production: false,
  serverIp: '172.16.30.16'
};
```

#### Cordova

<ul>
 <li>Require X-Code or Android SDK</li>
 <li><i>npm install -g cordova</i></li>
 <li>Go to nys-chat-mobile and do <i>npm install</i></li>
 <li><i>cordova add ios</i> or <i>cordova add android</i></li>
 <li>Go back to nys-chat and do <i>npm build --prod</i></li>
 <li>Copy all the contents in dist/nys-chat/ to www folder of nys-chat-mobile</li>
 <li>Change <strong> base href="/" </strong> index.html in www to <strong> base href="./" </strong></li>
 <li><i>node server</i> from server system.</li>
 <li>Go to nys-chat-mobile and do <i>cordova run ios<i> or cordova run android</li>
 </ul>
