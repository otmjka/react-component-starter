# react-component-starter

## Contributing

```
yarn
yarn watch:prepublish
```

Result check at `examples/simple/`

```
yarn
yarn start
```

## Install at App(private app):

```bash
cd your_app_folder

# install component external dependencies
# yarn add <ext deps>

# remove old component
yarn remove react-volume-component

# add the new one with specifying the tag
yarn add https://github.com/otmjka/react-volume-component.git#0.0.1
```

At entry point of app(index.html):

```html
<!--  fix timeline sizes calculation -->
<link rel="stylesheet" href="./main.css">

```

At component page

```javascript
import Volume from 'react-volume-component';

...

const httpHostPort = 'http://localhost:8090' // window.location.protocol + "//" + window.location.host;

return (
  <Volume />

)
...

```

## Examples

-

## Known problems

- 
