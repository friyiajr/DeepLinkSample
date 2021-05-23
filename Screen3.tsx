import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const App: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Screen 3</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
