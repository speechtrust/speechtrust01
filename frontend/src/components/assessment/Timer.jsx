import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function Timer  () {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={10}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
      size={250}
      trailStrokeWidth={20}
      strokeWidth={20}
      
      
    >
      {({ remainingTime }) => remainingTime}
    </CountdownCircleTimer>
  );
}