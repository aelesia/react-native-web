/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type { PressResponderConfig } from '../../modules/PressResponder';
import type { ViewProps } from '../View';

import * as React from 'react';
import { useMemo, useRef } from 'react';
import pick from '../../modules/pick';
import setAndForwardRef from '../../modules/setAndForwardRef';
import usePressEvents from '../../modules/PressResponder/usePressEvents';

export type Props = $ReadOnly<{|
  accessibilityLabel?: $PropertyType<ViewProps, 'accessibilityLabel'>,
  accessibilityLiveRegion?: $PropertyType<ViewProps, 'accessibilityLiveRegion'>,
  accessibilityRole?: $PropertyType<ViewProps, 'accessibilityRole'>,
  accessibilityState?: $PropertyType<ViewProps, 'accessibilityState'>,
  accessibilityValue?: $PropertyType<ViewProps, 'accessibilityValue'>,
  accessible?: $PropertyType<ViewProps, 'accessible'>,
  children?: ?React.Node,
  delayLongPress?: ?number,
  delayPressIn?: ?number,
  delayPressOut?: ?number,
  disabled?: ?boolean,
  focusable?: ?boolean,
  hitSlop?: $PropertyType<ViewProps, 'hitSlop'>,
  importantForAccessibility?: $PropertyType<ViewProps, 'importantForAccessibility'>,
  nativeID?: $PropertyType<ViewProps, 'nativeID'>,
  onBlur?: $PropertyType<ViewProps, 'onBlur'>,
  onFocus?: $PropertyType<ViewProps, 'onFocus'>,
  onLayout?: $PropertyType<ViewProps, 'onLayout'>,
  onLongPress?: $PropertyType<PressResponderConfig, 'onLongPress'>,
  onPress?: $PropertyType<PressResponderConfig, 'onPress'>,
  onPressIn?: $PropertyType<PressResponderConfig, 'onPressStart'>,
  onPressOut?: $PropertyType<PressResponderConfig, 'onPressEnd'>,
  rejectResponderTermination?: ?boolean,
  testID?: $PropertyType<ViewProps, 'testID'>
|}>;

const forwardPropsList = {
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  accessible: true,
  children: true,
  disabled: true,
  focusable: true,
  hitSlop: true,
  importantForAccessibility: true,
  nativeID: true,
  onBlur: true,
  onFocus: true,
  onLayout: true,
  testID: true
};

const pickProps = props => pick(props, forwardPropsList);

function TouchableWithoutFeedback(props: Props, forwardedRef): React.Node {
  const {
    accessible,
    delayPressIn,
    delayPressOut,
    delayLongPress,
    disabled,
    focusable,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    rejectResponderTermination
  } = props;

  const hostRef = useRef(null);
  const setRef = setAndForwardRef({
    getForwardedRef: () => forwardedRef,
    setLocalRef: hostNode => {
      hostRef.current = hostNode;
    }
  });

  const pressConfig = useMemo(
    () => ({
      cancelable: !rejectResponderTermination,
      disabled,
      delayLongPress,
      delayPressStart: delayPressIn,
      delayPressEnd: delayPressOut,
      onLongPress,
      onPress,
      onPressStart: onPressIn,
      onPressEnd: onPressOut
    }),
    [
      disabled,
      delayPressIn,
      delayPressOut,
      delayLongPress,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      rejectResponderTermination
    ]
  );

  const pressEventHandlers = usePressEvents(hostRef, pressConfig);

  const element = React.Children.only(props.children);
  const children = [element.props.children];
  const supportedProps = pickProps(props);
  supportedProps.accessible = accessible !== false;
  supportedProps.accessibilityState = { disabled, ...props.accessibilityState };
  supportedProps.focusable = focusable !== false && onPress !== undefined;
  supportedProps.ref = setRef;

  const elementProps = Object.assign(supportedProps, pressEventHandlers);

  return React.cloneElement(element, elementProps, ...children);
}

const MemoedTouchableWithoutFeedback = React.memo(React.forwardRef(TouchableWithoutFeedback));
MemoedTouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback';

export default (MemoedTouchableWithoutFeedback: React.AbstractComponent<
  Props,
  React.ElementRef<any>
>);
