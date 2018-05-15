# nys-chat
Real time chat app with Angular, Node and MongoDb using socket-io
## Quick Start
### Installation and usage

``` $ npm install``` <br />
``` $ npm start```

### Configuration

#### appSettings
<ul>
<li>By default, app is connecting to local mongo db. In order to connect to any cloud mongo make necessary changes.</li>
</ul>

```javascript
var config = {};

<!-- cloud mongo start  -->
<!-- config.MongoDb=''; -->
<!-- config.user=''; -->
<!-- config.password=''; -->
<!-- cloud mongo end  -->

<!-- local mongo start  -->
config.MongoDb="mongodb://localhost/mydb";
<!-- local mongo end  -->

module.exports = config;
```
