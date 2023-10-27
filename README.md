# off-cors
Tiny proxy server in NodeJS for preventing browser CORS checks

## Run
```
node cors_proxy.js
```

## Docker
```
docker run --name off-cors -p 4000:4000 -d fernetowac/off-cors:latest
```

## Usage

Prefix your GET or POST url with `http://localhost:4000/proxy?url=`

>See [example.http](/example.http)