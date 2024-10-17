// src/components/Timer.jsx
import { useState, useEffect, useRef } from 'react';
import { View } from '@tarojs/components';
import {StopCircleOutlined} from '@taroify/icons';

const Timer = ({ targetTime, onStop, setTimeLeft, timeLeft, elapsedTime, setElapsedTime }) => {
  const [isCounting, setIsCounting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsCounting(true);
    }

    return () => clearInterval(timerRef.current);
  }, [setTimeLeft, timeLeft]);

  useEffect(() => {
    if (isCounting) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [targetTime, isCounting, setElapsedTime]);

  const stopTimer = () => {
    setIsCounting(false);
    clearInterval(timerRef.current);
    onStop(elapsedTime);
  };

  return (
    <View>
      <StopCircleOutlined size={60} onClick={stopTimer} />
    </View>
  );
};

export default Timer;
