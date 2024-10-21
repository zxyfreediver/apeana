// src/components/Timer.jsx
import { useState, useEffect, useRef } from 'react';
import { View } from '@tarojs/components';
import {StopCircleOutlined} from '@taroify/icons';
import { createInnerAudioContext } from '@tarojs/taro'
import { audioList } from '../index/config'

const countDownSoundObj = audioList.find(item => item.id === 4)

const Timer = ({ targetTime, onStop, setTimeLeft, timeLeft, elapsedTime, setElapsedTime, breatheAudio }) => {
  const [isCounting, setIsCounting] = useState(false);
  const timerRef = useRef(null);
  const [countDownAudio, setCountDownAudio] = useState(null);

  useEffect(() => {
    const countDownSound = createInnerAudioContext();
    countDownSound.src = countDownSoundObj.url;
    setCountDownAudio(countDownSound);
  }, [])

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      if (timeLeft === 5 && countDownAudio) {
        countDownAudio.play();
      }
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setIsCounting(true);
    }

    return () => clearInterval(timerRef.current);
  }, [setTimeLeft, timeLeft]);

  useEffect(() => {
    if (isCounting) {
      if (breatheAudio) {
        breatheAudio.play();
      }
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
