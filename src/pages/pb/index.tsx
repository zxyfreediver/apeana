// src/pages/index/index.jsx
import { useState, useEffect } from 'react';
import { Input, View } from '@tarojs/components';
import { Flex, Button, FloatingBubble, Popup, Field, Radio } from '@taroify/core'
import { PlayCircleOutlined, Replay, Share, SettingOutlined } from '@taroify/icons'
import Timer from './Timer';
import { useShareAppMessage, switchTab, createInnerAudioContext } from '@tarojs/taro'
import { audioList, bgmList } from '../index/config'

const breatheSoundObj = audioList.find(item => item.id === 5)
const startSoundObj = audioList.find(item => item.id === 6)

const Index = () => {
  const [initialTime, setInitialTime] = useState(60); // 默认准备时间
  const [targetTime, setTargetTime] = useState(4 * 60); // 默认目标时间
  const [isStarted, setIsStarted] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [startAudio, setStartAudio] = useState(null);
  const [breatheAudio, setBreatheAudio] = useState(null);
  const [bgmAudio, setBgmAudio] = useState(null);
  const [currentBgmIndex, setCurrentBgmIndex] = useState(0);

  useEffect(() => {
    const startSound = createInnerAudioContext();
    startSound.src = startSoundObj.url; // 请确保这个路径是正确的
    setStartAudio(startSound);

    const breatheSound = createInnerAudioContext();
    breatheSound.src = breatheSoundObj.url; // 请确保这个路径是正确的
    setBreatheAudio(breatheSound);

    const bgm = createInnerAudioContext();
    bgm.src = bgmList[currentBgmIndex].url;
    bgm.loop = true;
    setBgmAudio(bgm);

    return () => {
      startSound.destroy();
      breatheSound.destroy();
      bgm.destroy();
    };
  }, [currentBgmIndex]);

  useShareAppMessage(() => {
    return {
      title: `我成功闭气 ${finalTime} 秒！`,
      path: '/pages/pb/index'
    }
  })

  const handleStart = () => {
    setIsStarted(true);
    if (startAudio) {
      startAudio.play();
    }
    if (bgmAudio) {
      bgmAudio.play(); // 开始播放背景音乐
    }
  };

  const handleStop = (time) => {
    if (timeLeft > 0) {
      handleReset()
    } else {
      setFinalTime(time);
      setIsStarted(false);
      if (breatheAudio) {
        breatheAudio.play();
      }
      if (bgmAudio) {
        bgmAudio.stop(); // 停止播放背景音乐
      }
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setFinalTime(null);
    setTimeLeft(initialTime);
    setElapsedTime(0);
    if (bgmAudio) {
      bgmAudio.stop(); // 确保重置时停止背景音乐
    }
  }

  const timeCount = timeLeft > 0 ? `${timeLeft} 秒` : `${elapsedTime} 秒`;
  const timeText = timeLeft > 0 ? '调息时间' : '闭气时间';

  const handleShare = () => {
    // 微信小程序会自动调用分享，这里可以添加一些额外的逻辑
    console.log('用户点击了分享按钮');
  }

  const handleGoToPractice = () => {
    switchTab({
      url: '/pages/index/index'
    })
  }

  const handleOpenSettings = () => {
    setShowSettings(true);
  }

  const handleCloseSettings = () => {
    setShowSettings(false);
  }

  const handleInitialTimeChange = (value) => {
    const newValue = parseInt(value) || 0;
    if (!isNaN(newValue)) {
      setInitialTime(newValue);
      setTimeLeft(newValue); // 添加这一行
    }
  }

  const handleTargetTimeChange = (value) => {
    const newValue = parseInt(value.name) || 0;
    if (!isNaN(newValue)) {
      setTargetTime(newValue);
    }
  }

  const handleBgmChange = (value) => {
    console.log(value)
    const newIndex = parseInt(value);
    setCurrentBgmIndex(newIndex);
    if (bgmAudio) {
      bgmAudio.stop();
      bgmAudio.src = bgmList[newIndex].url;
      if (isStarted) {
        bgmAudio.play();
      }
    }
  }

  return (
    <View className='h-full'>
      <View className='flex justify-center items-center text-2xl flex-col h-32'>
        <View>{timeText}</View>
        <View>{timeCount}</View>
      </View>
      <View className='h-full flex justify-between items-center flex-col'>
        <View className='h-96 pt-10 text-center'>
          <View>
            <View className='mb-2'>目标闭气时长：{targetTime} 秒</View>
            {finalTime && <View>最终闭气时长: {finalTime} 秒</View>}
          </View>
          <View className='mt-20'>
            {finalTime && (finalTime >= targetTime ? (
              <View className='text-xl text-green-500'>
                <View>恭喜你，闭气挑战成功！</View>
                <View className='mt-4'>
                  <Button
                    onClick={handleShare}
                    color="primary"
                    shape="round"
                    size="large"
                    className="flex items-center justify-center"
                  >
                    <Share className="mr-2" />
                    分享成绩
                  </Button>
                </View>
              </View>
            ) : (
              <View className='text-xl text-red-500 mt-4'>
                <View>再接再厉！</View>
                <View className='mt-4'>
                  <Button
                    onClick={handleGoToPractice}
                    color="success"
                    shape="round"
                    size="large"
                    className="flex items-center justify-center"
                  >
                    回去练习
                  </Button>
                </View>
              </View>
            ))}
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
      <FloatingBubble icon={<SettingOutlined />} onClick={handleOpenSettings} />

      <Popup open={showSettings} rounded placement="bottom" onClose={handleCloseSettings}>
        <Popup.Close />
        <View className="p-4">
          <View className="mb-4">
            <Field
              className='w-full'
              label="调息时间(秒)"
            >
              <Input
                type="number"
                value={initialTime.toString()} // 修改这里
                onInput={(e) => handleInitialTimeChange(e.detail.value)} // 修改这里
              />
            </Field>
          </View>
          <View className="mb-4">
            <Field
              className='w-screen'
              label='目标时间(秒)'
            >
              <Input
                type='number'
                value={targetTime.toString()} // 修改这里
                onInput={(e) => handleTargetTimeChange(e.detail.value)} // 修改这里
              />
            </Field>
          </View>
          <View className="mb-4 ml-4">
            <View className="mb-4">背景音乐</View>
            <Radio.Group onChange={handleBgmChange} value={currentBgmIndex}>
              {bgmList.map((bgm, index) => (
                <Radio key={index} name={index} className="mb-2">
                  {bgm.name}
                </Radio>
              ))}
            </Radio.Group>
          </View>
        </View>
      </Popup>
    </View>
  );
};

export default Index;
