/**
 * 滑动验证组件
 * reanimated的几个方法的解释：
 *  - cond: 条件判断。接收三个参数，第一个参数表示条件，第二个表示条件满足时执行的方法，第三个表示条件不满足时执行的方法
 *  - eq: 判断是否相等
 *  - add: 加法操作。
 *  - set: 赋值操作。把第二个参数赋值给第一个参数
 *  - call: 调用某个方法
 *  - event: 看下面的用法。把event左侧属性对应的值，赋给右侧的变量
 */
import React from 'react';
import Modal from 'react-native-modal';
import {
  PanGestureHandler,
  State,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import Animated, {
  cond,
  eq,
  event,
  Value,
  add,
  set,
  call,
  lessThan,
  greaterThan,
} from 'react-native-reanimated';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';

const imageSize = {
  puzzleWidth: 320,
  puzzleHeight: 160,
  puzzlePieceWidth: 50,
  puzzleMatchOffsetX: 85,
};

const SlideVerify: React.FC = () => {
  const dragX = new Value(0);
  const offsetX = new Value(0);
  const gestureState = new Value(-1);

  const addX = cond(
    lessThan(dragX, 0),
    0,
    cond(greaterThan(dragX, 270), 270, add(offsetX, dragX)),
  );
  const transX = cond(eq(gestureState, State.ACTIVE), addX, set(offsetX, addX));

  const onDrop = ([x]) => {
    // 一定的偏移量
    if (
      x >= imageSize.puzzleMatchOffsetX - 3 &&
      x <= imageSize.puzzleMatchOffsetX + 3
    ) {
      console.log('验证通过');
    } else {
      console.log('验证失败');
      dragX.setValue(0);
      offsetX.setValue(0);
      gestureState.setValue(-1);
    }
  };

  const handleGestureEvent = event([
    {
      nativeEvent: {
        translationX: dragX,
        state: gestureState,
      },
    },
  ]);

  const ModalContent = gestureHandlerRootHOC(() => (
    <>
      <Animated.Code>
        {() => cond(eq(gestureState, State.END), call([addX], onDrop))}
      </Animated.Code>
      <View
        style={{
          backgroundColor: 'white',
          width: imageSize.puzzleWidth + 20,
          height: 250,
          borderRadius: 6,
          padding: 10,
        }}>
        <View style={styles.container}>
          <Image
            source={require('./images/puzzle.jpg')}
            style={[
              StyleSheet.absoluteFill,
              {width: imageSize.puzzleWidth, height: imageSize.puzzleHeight},
            ]}
            resizeMode="cover"
          />
          <Animated.View
            style={[
              styles.piece,
              {
                transform: [
                  {
                    translateX: transX,
                  },
                ],
              },
            ]}>
            <Image
              source={require('./images/puzzlePiece.png')}
              style={[
                StyleSheet.absoluteFill,
                {
                  width: imageSize.puzzlePieceWidth,
                  height: imageSize.puzzleHeight,
                  zIndex: 3,
                },
              ]}
              resizeMode="cover"
            />
          </Animated.View>
          <View style={styles.slide}>
            <PanGestureHandler
              maxPointers={1}
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureEvent}>
              <Animated.View
                style={[
                  styles.cursor,
                  {
                    transform: [
                      {
                        translateX: transX,
                      },
                    ],
                  },
                ]}>
                <Animated.Text
                  style={{fontSize: 24, color: 'white', fontWeight: '500'}}>
                  |||
                </Animated.Text>
              </Animated.View>
            </PanGestureHandler>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
              }}>
              拖动左边滑块完成上方拼图
            </Text>
          </View>
        </View>
      </View>
    </>
  ));

  return (
    <Modal
      isVisible
      deviceWidth={Dimensions.get('window').width}
      deviceHeight={Dimensions.get('window').height}
      style={{
        margin: 0,
        marginLeft:
          (Dimensions.get('window').width - imageSize.puzzleWidth - 20) / 2,
      }}>
      <ModalContent />
    </Modal>
  );
};

export default SlideVerify;

const CIRCLE_SIZE = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'ghostwhite',
    marginTop: imageSize.puzzleHeight + 20,
    justifyContent: 'center',
    position: 'relative',
  },
  cursor: {
    backgroundColor: 'blue',
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  piece: {},
});
