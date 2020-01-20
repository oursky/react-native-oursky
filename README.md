# react-native-oursky

## How to install

```sh
yarn add --exact @oursky/react-native-oursky
```

## How to use

Read source code or [index.d.ts](./index.d.ts)

## How to migrate from 0.x to 1.x

In 1.x, we [removed most of the UI components](https://github.com/oursky/react-native-oursky/commit/8d5d76b9c8a83069469310098c991549fac39c4d).

This allows us to remove many third party dependencies. If you want to upgrade to 1.x and your project is using the removed components,
please copy them to your project.

## How to install from GitHub

```sh
yarn build
git add --force dist/
git commit
git push <your-remote> <your-branch>
```

## How to Run Example Project in iOS

After cloning the proejct fresh, run :

```sh
yarn install
cd example
yarn install
```

Then in `/example/node_modules/react-native/React/Base/RCTModuleMethod.mm`, find method `RCTParseUnused`
add the line :`RCTReadString(input, "__attribute__((__unused__))") ||` after `return RCTReadString(input, "__unused") ||`
the method should become:

```
static BOOL RCTParseUnused(const char **input)
{
  return RCTReadString(input, "__unused") ||
         RCTReadString(input, "__attribute__((__unused__))") ||
         RCTReadString(input, "__attribute__((unused))");
}
```

then the example project can be compiled.

## Principle

- Written in TypeScript
- Hand-written high quality TypeScript type definitions
