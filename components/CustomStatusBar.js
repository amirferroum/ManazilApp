// statusbar.tsx
import React, {Fragment} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

export default function CustomStatusBar({
  children,
  statusBgColor = '#e32f45',
  barStyle = 'light-content',
  bgColor = '#fff',
}) {
  return (
    <Fragment>
      <StatusBar backgroundColor={statusBgColor} barStyle={barStyle} />
      <SafeAreaView style={{flex: 0, backgroundColor: statusBgColor}} />
      <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
        {children}
      </SafeAreaView>
    </Fragment>
  );
}   