'use client';

import { ActivityIndicator } from 'react-native';
import React from 'react';

const Spinner = React.forwardRef((props, ref) => {
  const {
    color,
    focusable = false,
    'aria-label': ariaLabel = 'loading',
    style,
    ...restProps
  } = props;

  return (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      color={color}
      style={style}
      {...restProps}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };