# Form Collector

This is a simple Form Collector blocklet built on top of [formily](https://formilyjs.org/).

This blocklet can be used as a standalone app or as a component.

## Usage

### Use as a component

You can customize the builder with the following query parameters:

- `locale`: change the default locale of the form-collector
- `title`: the title on the top left corner
- `schemaKey`: the key used to query/save schema json, can be a string or a URL

### Use as a standalone App

Just install from blocklet store: https://test.store.blocklet.dev/blocklets/z8iZkQMJ1RTVeXbV9NtqCpfKExoVz378JbeYu

### Use as an npm package

```shell
yarn add @blocklet/form-collector
```

Then load and serve from any web server.
