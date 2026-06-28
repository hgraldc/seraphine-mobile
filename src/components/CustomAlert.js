import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  runOnJS,
} from 'react-native-reanimated';

const CustomAlert = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Batal",
  confirmText = "OK",
}) => {
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
    }
  }, [visible]);

  const handleClose = (action) => {
    if (action) action();
  };

  if (!showModal && !visible) return null;

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="none"
      onRequestClose={() => handleClose(onCancel || onConfirm)}
    >
      <TouchableWithoutFeedback onPress={() => handleClose(onCancel)}>
        {visible ? (
          <Animated.View 
            style={styles.overlay}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200).withCallback(() => {
              runOnJS(setShowModal)(false);
            })}
          >
            <TouchableWithoutFeedback>
              <Animated.View 
                style={styles.alertBox}
                entering={ZoomIn.duration(300).springify()}
                exiting={ZoomOut.duration(200)}
              >
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {message ? <Text style={styles.message}>{message}</Text> : null}
                <View style={styles.buttonContainer}>
                  {onCancel && (
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => handleClose(onCancel)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cancelButtonText}>{cancelText}</Text>
                    </TouchableOpacity>
                  )}
                  {onConfirm && (
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton, !onCancel && styles.singleButton]}
                      onPress={() => handleClose(onConfirm)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.confirmButtonText}>{confirmText}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        ) : (
          <View style={styles.overlay} />
        )}
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  alertBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
    shadowColor: '#2C0A0A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontFamily: 'Playfair',
    fontSize: 20,
    color: '#1A0A0A',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#7A6A65',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleButton: {
    flex: 0,
    minWidth: 120,
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F3EF',
    borderWidth: 1,
    borderColor: '#E2D9D0',
  },
  confirmButton: {
    backgroundColor: '#8B1A1A',
  },
  cancelButtonText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: '#5C1A1A',
  },
  confirmButtonText: {
    fontFamily: 'PoppinsMedium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default CustomAlert;
