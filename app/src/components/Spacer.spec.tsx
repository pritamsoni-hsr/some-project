import React from 'react';
import renderer from 'react-test-renderer';
import { ReactTestRendererJSON } from 'react-test-renderer';

import Spacer from './Spacer';

it('test spacer component default', () => {
  const rendered = renderer.create(<Spacer />);
  expect((rendered.toJSON() as ReactTestRendererJSON).props.style).toEqual({ height: 15 });
});

it('test spacer component horizontal', () => {
  const rendered = renderer.create(<Spacer direction={'horizontal'} />);
  expect((rendered.toJSON() as ReactTestRendererJSON).props.style).toEqual({ width: 15 });
});

it('test spacer component both', () => {
  const rendered = renderer.create(<Spacer direction={'both'} />);
  expect((rendered.toJSON() as ReactTestRendererJSON).props.style).toEqual({ height: 15, width: 15 });
});

it('test spacer component fill', () => {
  const rendered = renderer.create(<Spacer direction={'fill'} />);
  expect((rendered.toJSON() as ReactTestRendererJSON).props.style).toEqual({ flex: 1 });
});
