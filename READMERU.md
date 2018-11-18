Draft for Article

- [x] cсделал репозиторий react-dvr-calendar запихнул туда компонент попровал запустить из тесторовй сборки
- [x] вынес стрили в css файл
article1
article2

h2. два реакта

попытался встроить компонент dvr-player в вотчер, и там на одном ref dvr-player падал.

причина в том что в вотчере была различная версия react, react-dom.

решил попытаться сделать в dvr-player react, react-dom внешней зависимостью. как то надо было их получить при встраивании в вотчер.
ранее так уже пробовал.

валилась ошибка. dvr-player не мог найти react, react-dom. знаний не хватало понять как правильно сделать.

!!! не попробовал вариант когда react, react-dom и для watcher2 и для dvr-player внешние. но этот вариант налагает на все проекты куда будет встраиваться dvr-player какие то условия для сборки, например подключать react, react-dom ч/з скрипт.

время на попытку истелко, наименьшее зло: два реакта одинаковой версии.

<pre><code class="javascript">
"peerDependencies": {
    "react": "^16.6.0",
    "react-dom": "^16.6.0"
  },
</code></pre>

h2. поиски чего-то с Babel

h3. A guide to building a React component with webpack 4, publishing to npm, and deploying the demo to GitHub Pages

https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220

- делает component/src простой компонент со стилями
- делает component/examples/src - тестовое приложение, в нем делает импорт ../../src
- создает index.html для приложения #6948

- поднимает это все на вебпаковском веб дев сервере webpack.config.js

- и для консуминга этого пакета создает таск транспилинья

<pre><code class="javascript">
"main": "dist/index.js",
"scripts": {
...
  "transpile": "babel src -d dist --copy-files"
...
"prepublishOnly": "npm run transpile"
"peerDependencies": {
    "react": "^16.3.0",
    "react-dom": "^16.3.0"
  },
</code></pre>

- настройка .npmignore

(!!! не раскрыта тема как в один файл компиллировать, как резольвить стили. Babel просто делает ссылки на какие то переменные модуля. а не резольвит их никак. Куча маленьких файликов хелперов, нужен один файл, чтобы не компилировать и ничего не считать.)

h3. Distributing React components

http://krasimirtsonev.com/blog/article/distributing-react-components-babel-browserify-webpack-uglifyjs

react-place компонент:
рассказывает основы как стэндалон-бабелем компилировать код
рассказывает для чего babel-plugin-add-module-exports



h2. Переход на webpack 4


https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f

в прошлых попытках я смирился с тем что два реакта это самое быстрое решение. нашел эту статью где:
2. DON’T BUNDLE REACT. USE THE PARENT’S REACT AND REACT-DOM.
<pre><code class="javascript">
...
"peerDependencies": {      
    "react": ">=15.0.1",
    "react-dom": ">=15.0.1"
},
 "devDependencies": {      
    "react": ">=15.0.1",      
    "react-dom": ">=15.0.1"  
},  
...
</code></pre>

<pre><code class="javascript">
...
module.exports = {  
    ...  
    output: {      
        path: path.join(__dirname, './dist'),      
        filename: 'myUnflappableComponent.js',      
        library: libraryName,      
        libraryTarget: 'umd',      
        publicPath: '/dist/',      
        umdNamedDefine: true  
    },  
    plugins: {...},
    module: {...},  
    resolve: {...},  
    externals: {...}
}
</code></pre>

<pre><code class="javascript">
module.exports = {  
    output: {...},  
    plugins: {...},  
    module: {...},  
    resolve: {      
        alias: {          
            'react': path.resolve(__dirname, './node_modules/react'),
          'react-dom': path.resolve(__dirname, './node_modules/react-dom'),      
        }  
    },  
    externals: {      
        // Don't bundle react or react-dom      
        react: {          
            commonjs: "react",          
            commonjs2: "react",          
            amd: "React",          
            root: "React"      
        },      
        "react-dom": {          
            commonjs: "react-dom",          
            commonjs2: "react-dom",          
            amd: "ReactDOM",          
            root: "ReactDOM"      
        }  
    }
}
</code></pre>

- билдит один файл с помощью вебпака, только вебпак 4
5. EXTRACT OUT YOUR CSS FILES FOR USE
6. IMAGES IN CSS
7. MAKE SURE YOUR IMAGES ARE AVAILABLE OUTSIDE YOUR COMPONENT

На первый взгляд это решение меня всем удовлетворяло, потому что когда билдишь webpack есть нормальный контроль за формированием стилей.
И идея следующей попытки была. сделать простой компонент, например вытащить календарь из dvr-player и попробовать его заимпортить в примерах компонента и в приложение вставить, загрузив dvr-player как npm зависимость.

В результате родился репозиторий:

https://github.com/otmjka/react-calendar

30 oct
- проблема
<pre>
import {css} from './styles.css'
...
... className={css.proba} ...
</pre>

компилируется в
<pre>

...
...className = styles.defaults.proba и эта переменная никак не резолвится
</pre>

начал разбираться как можно
- вынести все стили из приложения в отдельный файл main.css
- вместо переменных `styles.defaults.proba` сразу подставлять 'proba' - имя класса

полез разбираться в статью
https://medium.com/@mattvagni/server-side-rendering-with-css-modules-6b02f1238eb1

mini-css-extract-plugin лоадер для извлечения всех стилей из javascript сырцов

описание, что есть css-loader для webpack:
> is extract the css & and the selectors and make them available to you in javascript in the form of a string and a mapping of selectors.

<pre>
{
  loader: 'css-loader',
  query: {
    localIdentName: '[hash:8]',
    modules: true
  }
}
</pre>

открытием стало

<pre>
/***/ function(module, exports, __webpack_require__) {

 exports = module.exports = __webpack_require__(1)();
// imports

 // module
exports.push([module.i, ".fe15fdc7 {\n    display: flex;\n}\n\n.ad030139 {\n    color: red;\n}\n\n.ad030139:hover {\n    color: green;\n}\n", ""]);

 // exports
exports.locals = {
 "wrapper": "fe15fdc7",
 "button": "ad030139"
};

/***/ },
</pre>

что при нормальном выводе бандла, можно увидеть, что имеется alias у css selectors

https://github.com/otmjka/react-calendar
переделал конфиги для вебпака

h3. republish

https://github.com/otmjka/react-calendar/commit/30e845a9942028137ea091c5491bb6e47379b3f7#diff-cea5c9585365ed8f3bf923c589edbf05

с учетом css modules, css-loader, MiniCssExtractPlugin.loader, компилирую общий файл для js и общий фалй для css

h3. webpack-dev-server

https://github.com/otmjka/react-calendar/commit/30e845a9942028137ea091c5491bb6e47379b3f7#diff-47ea6891092050a05504e8f4de4d5343

запускаю приложение в examples/src/index.js формирую index.html в скрптах импортирую компонент из ../../dist/index.js

h3. загрузка в приложение чз npm

подчистил ненужные файлы
создал пустой проект
загрузил ч/з импорт react-calendar
отобразился со стилями

h2. планы на будущие улучшения

проработать часть статьи "How does it work on the server?"
говорят, что вебпак круто, но громозкий и не эффективный(для задач серверного рендринга). И тип лучший спокоб, как оказалось, на их опыте, - это просто использовать Babel.

(Как достовать стили, если бабелем, вот главный вопрос ? У вебпака css-loader а у Babel что? )

Плагины для Babel!!!

 https://www.npmjs.com/package/babel-plugin-css-modules-transform

h3. .babelrc

<pre>
{
    "presets": [
        ["es2015"]
    ],
    "env": {
        "server": {
            "plugins": [
                [
                    "css-modules-transform", {
                        "generateScopedName": "[hash:8]",
                        "extensions": [".css"]
                    }
                ]
            ]
        }
    }
}
</pre>

(Будет ли компилить в один файл? Как компилить в один файл? resolve(ui, utils), hls.js FMsePlayer?)


-----


перенес код из wwwroot/dvr/src в папку репозитория
перенес билд-конфиги из react-calendar

при инсталировании зависимостей, f-dvr-player не делает prepublish скрипт
- разобраться, есть ли хук для установки
убрал из .gitignore папку dist
попытался обновить, yarn закешировал пакет, попытался очистить чз yarn cache clean fl-dvr-player не помогло
скопировал dist из репозитория(вариант когда можно ручками запихать в package.json)

мысль такая, что когда буду обновлять репозиторий, будут проблемы с установкой из-за закешированных версий, надо пробовать ч/з теги

после возни с dist
создал болванку-приложение, вставил быстро fl-dvr-player запустил
пришлось добавить в externals hls.js fl-mse-player и скопировать в дист, подключить в index.html


-----


<pre>

- разобраться с тегами в репозитории, чтобы не было проблем из-за кэша
- добавить в админку как внешний скрипт
- переделать embed(dvr=true)
- добавить в вотчер2
- добавить README.md, CHANGELOG.md
- починить стили
- разобраться с peerDependencies для react, react-dom, hls.js, fl-mse-player

- не забыть разобраться с формированием index.html из вебпака и как добавлять hash
- проверить что происходит в production

</pre>



h3. черновик

- понять как добавлять в админку. откуда будет браться скрипт dvr-player?
  ? устанавливать в node_modules корня(плохо тем что только yarn), потом gulp'ом копировать. так делается с fl-mse-player, но там открытый репозиторий
  после nom install делается хук, - запускается gulp. можно скачивать репозиторий в node_modules
- надо проверить как подключается чз скрипт. какую переменную передает в глобальную область видимости. найти статью, где это описывалось.


получается embed это приложение на react, которое рендрит dvr-player в какой-то див и сформировать/обрабатывает входные параметры.

- вставить в watcher
- нужно доделать стили. в предыдущем коментарии вложенные картинки, на них видно, что полезли стили из-за того, что не подключается react-dvr.css (чтоле?)
- сделать описание репозитория README.md
в котором описать как подключать dvr-player, детали для конфига. внешние зависимости. входные параметры.



-----

h2. Как сказать webpack-dev-server чтобы искать в node_modules

делаю пример в репозитории:
пришлось написать копирование hls.js FMsePlayer в папку dist
чтобы мочь в index.html добавить

<pre><code class="html">
<link rel="stylesheet" href="./main.css">
<script src="./hls.min.js"></script>
<script src="./FMsePlayer.js"></script>
</code></pre>

придумал лучше способ для webpack-dev-server

<pre><code class="javascript">
const devServerConfig = () => (merge([
  {
    devServer: {
      contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, './node_modules/fl-dvr-player/dist/')],
    }
  },{
    devServer: parts.statsConfig()
  }
]))
</code></pre>

будет искат <link rel="stylesheet" href="./main.css"> в path.join(__dirname, './node_modules/fl-dvr-player/dist/'


 ------


 + добавил чз yarn fl-dvr-player. попробовал определенную ветку установить *@"fl-dvr-player": ,@*
+ написал скрипт для gulp: *@./node_modules/.bin/gulp dvrplayer@.* копирует dist у fl-dvr-player в wwwroot/flu/dvr-player/component
+ добавил в админку *@var DvrPlayer = window['fl-dvr-player'].default;@*
- не может MsePlayer может hls.js
- стили ужасные


-----

output->library - название библиотеки, которое будет экспортироваться в глобалюную область видимости, когда подключается библиотека чз тег скрипт

----

приходится делать var DvrPlayer = window.DvrPlayer.default;
смотрю в сторону https://www.npmjs.com/package/babel-plugin-add-module-exports

update:

помогает именно этот плагин:
чтобы при подключении ч/з тег скрипт получать window.DvrPlayer, а не window.DvrPlayer.default нужно использовать  babel-plugin-add-module-exports

h3. .babelrc

<pre>
{
  "presets": ["flow", "env", "react"],
  "plugins": [
    "add-module-exports",
    "transform-class-properties",
    "transform-object-rest-spread",
  ],
}

</pre>


----

при подключении в админку не находил FMsePlayer, в fl-dvr-player сделал import @fl/fl-mse-player и в externals прописал '@fl/fl-mse-player': 'FMsePlayer'. "+" в админке должен компонент загружаться после загрузки @fl/fl-mse-player


-----

добавил тег

<pre>
git tag -a v18.11.1 -m 'version 18.11.1'
git push origin <tag name>
yarn add repo.git#18.11.1
</pre>

во флюсоннике даже с тегами проблема. удаляю кеш ярна, все равно не хочет обновлять пакет с версии 1.0.1 до 18.11.1


-----


рецепт
yarn chache clean
rm yarn.lock package-lock.json
rm -rf node_modules
yarn

все равно, говорит, что установил версию 1.0.1

проверил yarn.lock

<pre>
"fl-dvr-player@repo.git#18.11.1":
  version "1.0.1"
  resolved "repo.git#48820c31c2429c5ee9688113d18742ea27dd3aff"
  dependencies:
    classnames "^2.2.6"
    react-addons-update "^15.6.2"
</pre>

проверил

<pre>
repo.git#48820c31c2429c5ee9688113d18742ea27dd3aff
</pre>

там 18.11.1

предположение, что yarn изменяет в node_modules/fl-dvr-player/package.json version

проверил:

<pre>
cksum ./node_modules/fl-dvr-player/dist/index.js
2053127324 229838 ./node_modules/fl-dvr-player/dist/index.js
MacBook-Pro-TRIFONOV:admin5 trifonovdmitry$ cksum ../fl-dvr-player/dist/index.js
2053127324 229838 ../fl-dvr-player/dist/index.js
</pre>

во флюссонике так же


-----


я думаю, если в fl-dvr-player резолвить hls.js, fl-mse-player как react и react-dom, то процесс вставки может еще упроститься.


------
