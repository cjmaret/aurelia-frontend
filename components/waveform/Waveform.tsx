import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import styled, { useTheme } from 'styled-components/native';

const { width } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

const AnimatedWave = ({
  animationProgress,
  opacity,
  arcHeightAdjuster,
  opacityAdjuster,
  xStart,
  xWidth,
  theme,
}: {
  animationProgress: Animated.SharedValue<number>;
  opacity: Animated.SharedValue<number>;
  arcHeightAdjuster: number;
  opacityAdjuster: number;
  xStart: number;
  xWidth: number;
  theme: any;
}) => {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const centerY = 150;
    const arcHeight = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -75 * arcHeightAdjuster]
    );
    const x0 = xStart;
    const x1 = xStart + xWidth * 0.25;
    const x2 = xStart + xWidth * 0.5;
    const x3 = xStart + xWidth * 0.75;
    const x4 = xStart + xWidth;

    // y positions
    const y0 = centerY;
    const y1 = centerY + arcHeight * 0.3; // concave, not as high as peak
    const y2 = centerY + arcHeight; // peak
    const y3 = centerY + arcHeight * 0.3; // concave, not as high as peak
    const y4 = centerY;

    const points = [
      [x0, y0],
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x4, y4],
    ];

    // helper to get midpoints
    const getMid = (p1: any[], p2: any[]) => [
      (p1[0] + p2[0]) / 2,
      (p1[1] + p2[1]) / 2,
    ];

    // start path
    let d = `M ${points[0][0]} ${points[0][1]}`;

    // for each segment, use the next point as the control for the previous midpoint
    for (let i = 0; i < points.length - 1; i++) {
      const mid = getMid(points[i], points[i + 1]);
      d += ` Q ${points[i][0]} ${points[i][1]}, ${mid[0]} ${mid[1]}`;
    }
    // line to the last point
    d += ` T ${points[points.length - 1][0]} ${points[points.length - 1][1]}`;

    return {
      d,
      opacity: interpolate(opacity.value, [0, 1], [0, opacityAdjuster]),
    };
  });

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      stroke={theme.colors.primary}
      strokeWidth={3}
      fill={theme.colors.primary}
    />
  );
};

export default function Waveform({ isRecording }: { isRecording: boolean }) {
  const theme: any = useTheme();
  const animationProgress1 = useSharedValue<number>(0);
  const animationProgress2 = useSharedValue<number>(0);
  const animationProgress3 = useSharedValue<number>(0);
  const opacity1 = useSharedValue<number>(1);
  const opacity2 = useSharedValue<number>(1);
  const opacity3 = useSharedValue<number>(1);
  const [xStart1, setXStart1] = useState(0);
  const [xStart2, setXStart2] = useState(0.3);
  const [xStart3, setXStart3] = useState(0.7);

  useEffect(() => {
    if (!isRecording) {
      animationProgress1.value = 0;
      opacity1.value = 1;
      animationProgress2.value = 0;
      opacity2.value = 1;
      animationProgress3.value = 0;
      opacity3.value = 1;
      return;
    }

    setXStart1(0);
    setXStart2(0.3);
    setXStart3(0.7);

    const startAnimation = (
      sharedValue: Animated.SharedValue<number>,
      duration: number
    ) => {
      sharedValue.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      );
    };

    const startOpacityAndXPlacement = (
      sharedValue: Animated.SharedValue<number>,
      duration: number,
      setRandomX: (x: number) => void,
      min: number,
      range: number
    ) => {
      sharedValue.value = withRepeat(
        withSequence(
          withTiming(0, { duration }, (finished) => {
            if (finished) {
              let randomX = min + Math.random() * range;
              runOnJS(setRandomX)(randomX);
            }
          }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      );
    };

    startAnimation(animationProgress1, 3500);
    startAnimation(animationProgress2, 4000);
    startAnimation(animationProgress3, 3000);

    startOpacityAndXPlacement(opacity1, 3500, setXStart1, -0.15, 0.48);
    startOpacityAndXPlacement(opacity2, 4000, setXStart2, 0.33, 0.33);
    startOpacityAndXPlacement(opacity3, 3000, setXStart3, 0.66, 0.19);

    return () => {
      animationProgress1.value = 0;
      opacity1.value = 1;
      animationProgress2.value = 0;
      opacity2.value = 1;
      animationProgress3.value = 0;
      opacity3.value = 1;
    };
  }, [isRecording]);

  return (
    <WaveformContainer>
      <Svg width={width} height={150}>
        <Path
          /* move to point (0, 150), draw line to (width, 150)*/
          d={`M 0 150 L ${width} 150`}
          stroke={theme.colors.primary}
          strokeWidth={5}
          fill={theme.colors.primary}
        />
        {[1, 1.5, 2].map((heightAdjuster, index) => (
          <AnimatedWave
            key={`wave1-${index}`}
            animationProgress={animationProgress1}
            opacity={opacity1}
            arcHeightAdjuster={heightAdjuster}
            opacityAdjuster={1 / (index + 1)}
            xStart={width * xStart1}
            xWidth={width * 0.3}
            theme={theme}
          />
        ))}
        {[2, 2.5, 3].map((heightAdjuster, index) => (
          <AnimatedWave
            key={`wave2-${index}`}
            animationProgress={animationProgress2}
            opacity={opacity2}
            arcHeightAdjuster={heightAdjuster}
            opacityAdjuster={1 / (index + 1)}
            xStart={width * xStart2}
            xWidth={width * 0.4}
            theme={theme}
          />
        ))}
        {[1, 1.5, 2].map((heightAdjuster, index) => (
          <AnimatedWave
            key={`wave3-${index}`}
            animationProgress={animationProgress3}
            opacity={opacity3}
            arcHeightAdjuster={heightAdjuster}
            opacityAdjuster={1 / (index + 1)}
            /*??? vvv*/
            xStart={width * xStart3}
            xWidth={width * 0.3}
            theme={theme}
          />
        ))}
      </Svg>
    </WaveformContainer>
  );
}

const WaveformContainer = styled.View`
  width: 100%;
`;
