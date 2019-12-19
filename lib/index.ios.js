import React from "react";
import { Platform, View, Animated, Modal, TouchableOpacity, Picker, StyleSheet, Dimensions, Text } from "react-native";
import PropTypes from "prop-types";

const BORDER_RADIUS = 13;
const BACKGROUND_COLOR_LIGHT = "white";
const BACKGROUND_COLOR_DARK = "#0E0E0E";
const BORDER_COLOR = "#d5d5d5";
const TITLE_FONT_SIZE = 20;
const TITLE_COLOR = "#8f8f8f";
const BUTTON_FONT_WEIGHT = "normal";
const BUTTON_FONT_COLOR = "#007ff9";
const BUTTON_FONT_SIZE = 20;
const HIGHLIGHT_COLOR = "#ebebeb";

class ReactNativePickerModule extends React.Component {
  state = {
    isVisible: false,
    animation: new Animated.Value(0),
    selectedValue: this.props.value
  };
  isIphoneX = () => {
    const dimen = Dimensions.get("window");
    return (
      Platform.OS === "ios" &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 || dimen.width === 812 || (dimen.height === 896 || dimen.width === 896))
    );
  };

  render() {
    const {
      value,
      items,
      title,
      onValueChange,
      pickerRef,
      ios,
      cancelButton,
      confirmButton,
      onCancel,
      onDismiss
    } = this.props;
    pickerRef({
      show: () => {
        this.setState(
          {
            isVisible: true,
            selectedValue: value === undefined ? null : value
          },
          () => {
            Animated.timing(this.state.animation, {
              toValue: 1,
              duration: ios.duration
            }).start();
          }
        );
      }
    });
    const styles = {
      container: {
        flex: 1,
        margin: 10,
        bottom: this.state.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-Dimensions.get("window").height, 0]
        }),
        justifyContent: "flex-end",
        zIndex: 999
      },
      content: {
        backgroundColor: "white",
        borderRadius: BORDER_RADIUS,
        marginBottom: 8,
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
      confirmButtonView: {
        borderBottomEndRadius: BORDER_RADIUS,
        borderBottomStartRadius: BORDER_RADIUS,
        borderColor: BORDER_COLOR,
        borderTopWidth: StyleSheet.hairlineWidth,
        backgroundColor: "transparent",
        height: 57,
        justifyContent: "center"
      },
      confirmButtonText: {
        textAlign: "center",
        color: BUTTON_FONT_COLOR,
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: BUTTON_FONT_WEIGHT,
        backgroundColor: "transparent"
      },
      cancelButton: {
        marginVertical: 0
      },
      cancelButtonView: {
        borderRadius: BORDER_RADIUS,
        height: 57,
        marginBottom: this.isIphoneX() ? 20 : 0,
        justifyContent: "center",
        backgroundColor: BACKGROUND_COLOR_LIGHT
      },
      cancelButtonText: {
        padding: 10,
        textAlign: "center",
        color: BUTTON_FONT_COLOR,
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: "600",
        backgroundColor: "transparent"
      },
      titleView: {
        // padding: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: "rgba(165,165,165,0.2)",
        borderBottomColor: BORDER_COLOR,
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 14,
        backgroundColor: "transparent"
      },
      titleText: {
        textAlign: "center",
        color: TITLE_COLOR,
        fontSize: TITLE_FONT_SIZE
      }
    };
    return (
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        visible={this.state.isVisible}
        animationType="none"
        transparent={true}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: this.state.animation.interpolate({
              inputRange: [0, 1],
              outputRange: ["transparent", ios.overlayColor]
            })
          }}>
          <Animated.View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.titleView}>
                <Text style={[styles.titleText, ios.titleStyle]}>{title}</Text>
              </View>
              <Picker
                selectedValue={this.state.selectedValue === null ? 0 : this.state.selectedValue}
                style={{ maxHeight: 200, overflow: "hidden" }}
                onValueChange={val => {
                  this.setState({
                    selectedValue: val
                  });
                }}>
                {items.map((val, index) => {
                  return <Picker.Item key={"item-" + index} label={val} value={index} />;
                })}
              </Picker>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (this.state.selectedValue === null || this.state.selectedValue !== this.props.value) {
                    const isNull = this.state.selectedValue === null;
                    const valueIndex = isNull ? 0 : this.state.selectedValue;
                    const valueText = isNull ? items[0] : items[valueIndex];
                    onValueChange(valueText, valueIndex);
                    onDismiss !== undefined && onDismiss();
                    Animated.timing(this.state.animation, {
                      toValue: 0,
                      duration: ios.duration
                    }).start(() => {
                      this.setState({
                        isVisible: false
                      });
                    });
                  }
                }}>
                <View
                  style={[
                    styles.confirmButtonView,
                    {
                      opacity:
                        this.state.selectedValue !== null
                          ? this.state.selectedValue !== this.props.value
                          ? 1
                          : 0.1
                          : 1
                    }
                  ]}>
                  <Text style={styles.confirmButtonText}>{confirmButton}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.cancelButton}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  Animated.timing(this.state.animation, {
                    toValue: 0,
                    duration: ios.duration
                  }).start(() => {
                    this.setState({
                      isVisible: false
                    });
                    // onCancel callback!
                    if (onCancel !== undefined) {
                      onCancel();
                    }
                  });
                }}>
                <View style={styles.cancelButtonView}>
                  <Text style={styles.cancelButtonText}>{cancelButton}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

ReactNativePickerModule.propTypes = {
  value: PropTypes.number,
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  ios: PropTypes.object,
  pickerRef: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onDismiss: PropTypes.func,
  cancelButton: PropTypes.string,
  confirmButton: PropTypes.string
};

ReactNativePickerModule.defaultProps = {
  ios: {
    duration: 330,
    overlayColor: "rgba(0,0,0,0.3)"
  },
  cancelButton: "Cancel",
  confirmButton: "Confirm"
};

export default ReactNativePickerModule;