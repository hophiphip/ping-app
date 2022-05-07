## Quick start

Install [Node.js Foreign Function Interface for N-API](https://github.com/node-ffi-napi/node-ffi-napi)

```shell
npm install -g node-gyp
```

Start the app in the `dev` environment:

```shell
npm start
```

## Packaging for Production

To package apps for the local platform:

```shell
npm run package
```

## Reference

### Logging

- Application monitoring is done with [Sentry](https://sentry.io)
- Loggin library is [electron-log](https://github.com/megahertz/electron-log).
  By default, it writes logs to the following locations:

  - on Linux: `~/.config/ping-app/logs/{process type}.log`
  - on macOS: `~/Library/Logs/ping-app/{process type}.log`
  - on Windows: `%USERPROFILE%\AppData\Roaming\ping-app\logs\{process type}.log`
