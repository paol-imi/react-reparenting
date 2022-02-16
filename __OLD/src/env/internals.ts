import React from 'react';

// The naming conventions chenged from React 16 to 17.
const oldConvention = React.version.startsWith('16');

export const Int = {
  // Prefix of the attribute that contains the fiber in a DOM node.
  nodePrefix: oldConvention
    ? // React 16.x.x
      '__reactInternalInstance$'
    : // React 17.x.x
      '__reactFiber$',
  // Attribute that contains the fiber in a class component.
  componentAttribute: oldConvention
    ? // React 16.x.x
      '_reactInternalFiber'
    : // React 17.x.x
      '_reactInternals',
};
