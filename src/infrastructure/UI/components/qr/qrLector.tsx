import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);
  const [permissionResponse, requestPermission] = BarCodeScanner.usePermissions();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  console.log(permissionResponse);
  const handleBarCodeScanned = () => {
    setScanned(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        type={BarCodeScanner.Constants.Type.back}
      />
      <View style={styles.scannerOverlay} />
      <Text></Text>
      {scanned && <Button title={'Presiona para escanear de nuevo'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 0,
    width: 260,
    height: 260,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
    width: 200,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'red',
    opacity: 0.5,
  },
});
