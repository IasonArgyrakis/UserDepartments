#  1 Install
```javascript
yarn
```

## 2 Start docker DB + run migrations
### ⚠️running this again deletes the db data ⚠️
```javascript
yarn db:dev:restart
```


### 3 Start ApI
```javascript
yarn start:dev
```

## 1 LINER 

###
```
yarn && yarn db:dev:up && sleep 1 && yarn prisma:dev:deploy && yarn start:dev
```

---
### Uninstall


```
db:dev:rm
```
