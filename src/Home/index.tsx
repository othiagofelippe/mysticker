import { useState, useEffect, useRef } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PositionChoice } from "../components/PositionChoice";

import Retry from "../assets/retry.svg";
import RotateCamera from "../assets/rotateCamera.svg";
import { styles } from "./styles";
import { POSITIONS, PositionProps } from "../utils/positions";

export function Home() {
  const [photo, setPhotoURI] = useState<null | string>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );
  const [type, setType] = useState(CameraType.back);

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri);
  }

  async function shareScreenShot() {
    const screenShot = await captureRef(screenShotRef);
    await Sharing.shareAsync("file://" + screenShot);
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then((response) => {
      setHasCameraPermission(response.granted);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>
            {hasCameraPermission && !photo ? (
              <Camera ref={cameraRef} style={styles.camera} type={type}  />
            ) : (
              <Image
                source={{
                  uri: photo ? photo : "https://github.com/rodrigorgtic.png",
                }}
                style={styles.camera}
                onLoad={shareScreenShot}
              />
            )}

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <View style={styles.tools}>
          <TouchableOpacity onPress={() => setPhotoURI(null)}>
            <Retry />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleCameraType}>
            <RotateCamera />
          </TouchableOpacity>
        </View>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}
