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

    // Helper to get midpoints
    const getMid = (p1: any[], p2: any[]) => [
      (p1[0] + p2[0]) / 2,
      (p1[1] + p2[1]) / 2,
    ];

    // Start path
    let d = `M ${points[0][0]} ${points[0][1]}`;

    // For each segment, use the next point as the control for the previous midpoint
    for (let i = 0; i < points.length - 1; i++) {
      const mid = getMid(points[i], points[i + 1]);
      d += ` Q ${points[i][0]} ${points[i][1]}, ${mid[0]} ${mid[1]}`;
    }
    // And finally, line to the last point
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

export default function Waveform({ recording }: { recording: boolean }) {
  const theme: any = useTheme();
  const animationProgress1 = useSharedValue<number>(0);
  const opacity1 = useSharedValue<number>(1);
  const animationProgress2 = useSharedValue<number>(0);
  const opacity2 = useSharedValue<number>(1);
  const animationProgress3 = useSharedValue<number>(0);
  const opacity3 = useSharedValue<number>(1);
  const [randomX1, setRandomX1] = useState(Math.random());
  const [randomX2, setRandomX2] = useState(Math.random());
  const [randomX3, setRandomX3] = useState(Math.random());

  useEffect(() => {
    animationProgress1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
    animationProgress2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
    animationProgress3.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
    opacity1.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 3500 }, (finished) => {
          if (finished) {
            // between 0 and 0.35
            let randomX1 = Math.random() * 0.35;
            console.log('randomX1', randomX1);
            runOnJS(setRandomX1)(randomX1);
          }
        }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
    opacity2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 3000 }, (finished) => {
          if (finished) {
            // between 0.35 and 0.7
            let randomX2 = 0.35 + Math.random() * 0.35;
            console.log('randomX2', randomX2);
            runOnJS(setRandomX2)(randomX2);
          }
        }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
    opacity3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 3000 }, (finished) => {
          if (finished) {
            // between 0 and 0.7
            let randomX3 = Math.random() * 0.7;
            console.log('randomX3', randomX3);
            runOnJS(setRandomX3)(randomX3);
          }
        }),
        withTiming(1, { duration: 0 })
      ),
      -1,
      false
    );
    return () => {
      animationProgress1.value = 0;
      opacity1.value = 1;
      animationProgress2.value = 0;
      opacity2.value = 1;
      animationProgress3.value = 0;
      opacity3.value = 1;
    };
  }, []);

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
        {[2, 2.5, 3].map((heightAdjuster, index) => (
          <AnimatedWave
            key={`wave1-${index}`}
            animationProgress={animationProgress1}
            opacity={opacity1}
            arcHeightAdjuster={heightAdjuster}
            opacityAdjuster={1 / (index + 1)}
            xStart={width * randomX1}
            xWidth={width * 0.4}
            theme={theme}
          />
        ))}
        {[1, 1.5, 2].map((heightAdjuster, index) => (
          <AnimatedWave
            key={`wave2-${index}`}
            animationProgress={animationProgress2}
            opacity={opacity2}
            arcHeightAdjuster={heightAdjuster}
            opacityAdjuster={1 / (index + 1)}
            xStart={width * randomX2}
            xWidth={width * 0.3}
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
            xStart={(width - 0.25) * randomX3}
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
