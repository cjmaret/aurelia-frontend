import React, { useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { line, curveBasis } from 'd3-shape';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Waveform({ recording }: { recording: boolean }) {
  // controls the wave motion, goes from 0 to 1 and 0 again
  const animationProgress1 = useSharedValue<number>(0);
  // controls the fade-out effect
  const opacity1 = useSharedValue<number>(1);
  const animationProgress2 = useSharedValue<number>(0);
  const opacity2 = useSharedValue<number>(1);

  useEffect(() => {
    // if (recording) {
    animationProgress1.value = withRepeat(
      // runs animations one after another
      withSequence(
        // animates a value smoothly over time
        withTiming(1, { duration: 3000 })
      ),
      // repeat indefinitely, and without reversing
      -1, // Infinite loop
      false
    );
    animationProgress2.value = withRepeat(
      withSequence(withTiming(1, { duration: 2500 })),
      -1,
      false
    );
    opacity1.value = withRepeat(
      withSequence(withTiming(0, { duration: 3000 })),
      -1,
      false
    );
    opacity2.value = withRepeat(
      withSequence(withTiming(0, { duration: 2500 })),
      -1,
      false
    );
    return () => {
      animationProgress1.value = 0;
      opacity1.value = 1;
      animationProgress2.value = 0;
      opacity2.value = 1;
    };
    // }
  }, []);

  const generateWaveformPath = (
    animationProgress: Animated.SharedValue<number>,
    arcHeightAdjuster: number,
    xStart: number,
    xWidth: number
  ) => {
    const centerY = 150;
    const arcHeight = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -75 * arcHeightAdjuster]
    );

    const xPositions = [
      xStart,
      xStart + xWidth * 0.15,
      xStart + xWidth * 0.5,
      xStart + xWidth * 0.85,
      xStart + xWidth,
    ];

    const lineGenerator = line<number>()
      .x((_, i) => xPositions[i])
      .y((_, i) => {
        if (i === 2) return centerY + arcHeight;
        if (i === 1 || i === 3) return centerY + arcHeight / 10;
        return centerY;
      })
      .curve(curveBasis);

    return lineGenerator([0, 1, 2, 3, 4]) || '';
  };

  const arcProps = useMemo(
    () =>
      (
        animationProgress: Animated.SharedValue<number>,
        opacity: Animated.SharedValue<number>,
        arcHeightAdjuster: number,
        opacityAdjuster: number,
        xStart: number,
        xWidth: number
      ) =>
        useAnimatedProps(() => ({
          d: generateWaveformPath(
            animationProgress,
            arcHeightAdjuster,
            xStart,
            xWidth
          ),
          opacity: interpolate(opacity.value, [0, 1], [0, opacityAdjuster]),
        })),
    []
  );

  const renderWaveforms = ({
    xStart,
    xWidth,
    animationProgress,
    opacity,
  }: {
    xStart: number;
    xWidth: number;
    animationProgress: SharedValue<number>;
    opacity: SharedValue<number>;
  }) => {
    return [1, 1.5, 2].map((heightAdjuster, index) => (
      <AnimatedPath
        key={index}
        animatedProps={arcProps(
          animationProgress,
          opacity,
          heightAdjuster,
          1 / (index + 1),
          xStart,
          xWidth
        )}
        stroke="black"
        strokeWidth={3}
        fill="black"
      />
    ));
  };

  return (
    <WaveformContainer>
      <Svg width={width} height={150}>
        <Path
          // static baseline
          // (Move to (x 0, y 150), Line to (x width, y 150))
          d={`M 0 150 L ${width} 150`}
          stroke="black"
          strokeWidth={5}
          fill="black"
        />
        {renderWaveforms({
          xStart: width * 0.1,
          xWidth: width * 0.4,
          animationProgress: animationProgress1,
          opacity: opacity1,
        })}
        {renderWaveforms({
          xStart: width * 0.6,
          xWidth: width * 0.3,
          animationProgress: animationProgress2,
          opacity: opacity2,
        })}
      </Svg>
    </WaveformContainer>
  );
}

const WaveformContainer = styled.View`
  width: 100%;
`;
