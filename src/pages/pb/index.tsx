// src/pages/index/index.jsx
import { useMemo, useState } from 'react';
import { View } from '@tarojs/components';
import { Circle, Flex } from '@taroify/core'
import {PlayCircleOutlined, Replay} from '@taroify/icons'
import Timer from './Timer';

const Index = () => {
  const [initialTime, setInitialTime] = useState(5); // 默认准备时间
  const [targetTime, setTargetTime] = useState(4); // 默认目标时间
  const [isStarted, setIsStarted] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleStop = (time) => {
    if (timeLeft > 0) {
      handleReset()
    } else {
      setFinalTime(time);
      setIsStarted(false);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setFinalTime(null);
    setTimeLeft(initialTime);
    setElapsedTime(0);
  }

  const timeCount = timeLeft > 0 ? `${timeLeft} 秒` : `${elapsedTime} 秒`;
  const timeText = timeLeft > 0 ? '调息时间' : '闭气';
  return (
    <View className='h-full'>
      <View className='flex justify-center items-center text-2xl flex-col h-64'>
        <View>{timeText}</View>
        <View>{timeCount}</View>
      </View>
      <View className='h-full flex justify-between items-center flex-col'>
        <View className='h-64 pt-10'>
          <View>
            <View>目标闭气时长：{targetTime} 秒</View>
            {finalTime && <View>最终闭气时长: {finalTime} 秒</View>}
          </View>
        </View>
        <View>
          {!isStarted ? (
            <Flex>
              {finalTime ? <Replay size={60} onClick={handleReset} /> : <PlayCircleOutlined size={60} onClick={handleStart} />}
            </Flex>
            ) : (
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} elapsedTime={elapsedTime}
                setElapsedTime={setElapsedTime} targetTime={targetTime} onStop={handleStop}
              />
          )}
        </View>
      </View>
    </View>
  );
};

export default Index;
