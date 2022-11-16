const theme = import('@eva-design/eva/themes/light.json');

type EvaTheme = Partial<Awaited<typeof theme>>;
