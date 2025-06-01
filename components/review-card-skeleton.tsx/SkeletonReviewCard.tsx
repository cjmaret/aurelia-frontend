import { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SkeletonBar, SkeletonContainer } from './styledSkeletonReviewCard';

export default function ShimmerSkeletonReviewCard() {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const getShimmerStyle = () => ({
    transform: [
      {
        translateX: shimmerAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-150, 150],
        }),
      },
    ],
  });

  return (
    <SkeletonContainer>
      {[
        { w: '60%', h: 18 },
        { w: '80%', h: 14 },
        { w: '40%', h: 14 },
      ].map((bar, idx) => (
        <SkeletonBar key={idx} width={bar.w} height={bar.h}>
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                zIndex: 2,
              },
              getShimmerStyle(),
            ]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ width: 150, height: '100%' }}
            />
          </Animated.View>
        </SkeletonBar>
      ))}
    </SkeletonContainer>
  );
}
