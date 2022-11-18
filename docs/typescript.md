additional typings you might want to know.


- typing dimensions in percentage or px or rem

```ts
type StringWidth = `${number}%`;
const width: StringWidth = '122%';
const invalidWidth: StringWidth = '122';
console.log(width, invalidWidth);
```

```ts
type StringWidthDim = `${number}${'px'|'rem'|'em'}`;
const widthRem: StringWidthDim = '122rem';
const widthPx: StringWidthDim = '122px';
const widthEm: StringWidthDim = '122em';
const invalidWidthDim: StringWidthDim = '1222';
console.log(widthRem, widthPx, widthEm, invalidWidthDim);
```

![Screenshot 2022-11-18 at 23 44 37](https://user-images.githubusercontent.com/23050213/202774764-1845d741-e905-4315-af75-9a02c0ba8264.jpg)
