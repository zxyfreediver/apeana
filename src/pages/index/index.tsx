import { View } from '@tarojs/components'
import Taro, { useLoad, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { Cell, Circle } from '@taroify/core'
import { PlayCircleOutlined, StopCircleOutlined } from '@taroify/icons'
import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Workflow, PreparationStep, TrainingStep} from './workflow'
import Setting from './Setting'
import { bgmList, audioList } from './config'
import mock from './mock'

const formatTime = (time: number) => {
  return `${Math.floor(time / 60).toString().padStart(2, '0')}:${Math.floor(time % 60).toString().padStart(2, '0')}`
}

const countDownAudio = audioList[0].url
const startHoldAudio = audioList[1].url
const startBreatheAudio = audioList[2].url

export default function Index () {
  const workflow = useRef<Workflow>()
  const [status, setStatus] = useState({name: '', duration: 0, index: -1, remaining: 0, status: 'pending'})
  const [key, setKey] = useState(0)
  const audioContext = useRef<Taro.InnerAudioContext>()
  const audioContextCountDown = useRef<Taro.InnerAudioContext>()
  const audioContextStartHold = useRef<Taro.InnerAudioContext>()
  const audioContextStartBreathe = useRef<Taro.InnerAudioContext>()
  const [customTable, setCustomTable] = useState(mock.table)
  const [bgm, setBgm] = useState(1)

  const bgmUrl = useMemo(() => {
    return bgmList.find(item => item.id === bgm)?.url
  }, [bgm])

  useLoad(() => {
    workflow.current = new Workflow(setStatus);
    // 创建音频上下文
    audioContext.current = Taro.createInnerAudioContext()
    audioContext.current.loop = true // 设置循环播放
    audioContextCountDown.current = Taro.createInnerAudioContext()
    audioContextCountDown.current.src = countDownAudio
    audioContextStartHold.current = Taro.createInnerAudioContext()
    audioContextStartHold.current.src = startHoldAudio
    audioContextStartBreathe.current = Taro.createInnerAudioContext()
    audioContextStartBreathe.current.src = startBreatheAudio
  })

  useShareAppMessage(() => {
    return {
      title: '闭气练习',
      path: '/pages/index/index',
    }
  })

  useShareTimeline(() => {
    console.log('onShareTimeline')
  })

  const handleStart = useCallback(() => {
    workflow.current?.run();
    audioContext.current?.play() // 开始播放音频
  }, [])

  const handleResume = () => {
    workflow.current?.resume();
    audioContext.current?.play() // 开始播放音频
  }

  const handleStop = () => {
    workflow.current?.stop();
    setKey(state => ++state)
    audioContext.current?.stop() // 停止播放音频
  }

  const handleCustomize = (newTable, bgm) => {
    handleStop()
    setCustomTable(newTable)
    setBgm(bgm)
    // 如果需要，可以在这里重置 workflow
    workflow.current = new Workflow(setStatus);
  }


  const controlButton = useMemo(() => {
    if (status.status === 'running') {
      return <>
        {/* <PauseCircleOutlined size={60} onClick={handlePause} /> */}
        <StopCircleOutlined size={60} onClick={handleStop} />
      </>
    }
    if (status.status === 'paused') {
      return <>
        <PlayCircleOutlined size={60} onClick={handleResume} />
        <StopCircleOutlined size={60} onClick={handleStop} />
      </>
    }
    return <>
      <PlayCircleOutlined size={60} onClick={handleStart} />
    </>
  }, [handleStart, status.status])

  // 根据状态显示按钮
  const texts = useMemo(() => {
    if (['running', 'paused'].includes(status.status)) {
      return <>
        <View className='text-2xl'>{formatTime(status.remaining)}</View>
        <View className='text-2xl'>{status.name}</View>
      </>
    }
    return <View className='text-2xl'>{formatTime(status.remaining)}</View>

  }, [status])

  // 根据状态控制表盘速度
  const speed = useMemo(() => {
    if (status.remaining === status.duration || status.status === 'pending') {
      return 0
    }
    return 100 / status.duration
  }, [status])

  // 根据状态控制表盘百分比
  const percent = useMemo(() => {
    if (status.status === 'pending') return 0
    return (1 - status.remaining / status.duration) * 100
  }, [status])

  useEffect(() => {
    // 添加准备步骤
    workflow.current?.addStep(new PreparationStep(mock.prepare));
    // 添加训练步骤
    customTable.forEach(item => {
      workflow.current?.addStep(new TrainingStep('闭气', item.hold));
      workflow.current?.addStep(new TrainingStep('调息', item.breathe));
    })
  }, [customTable])

  useEffect(() => {
    if (bgmUrl && audioContext.current) {
      audioContext.current.src = bgmUrl
    }
  }, [bgmUrl])

  useEffect(() => {
    if (status.status === 'pending') {
      audioContext.current?.stop()
    }
  }, [status.status])

  useEffect(() => {
    if (status.duration === status.remaining) {
      if (status.name === '闭气') {
        audioContextStartHold.current?.play()
      }
      if (status.name === '调息' || status.name === '准备时间') {
        audioContextStartBreathe.current?.play()
      }
    }
    if (status.remaining === 5) {
      audioContextCountDown.current?.play()
    }
  }, [status])

  return (
    <View>
      <View className='flex justify-center items-center relative'>
        <Circle key={key} size={250} speed={speed} percent={percent} layerColor='#000' color='orange' strokeWidth={120} />
        <View className='absolute flex justify-center items-center flex-col'>
          {texts}
        </View>
      </View>

      <View className='flex justify-center flex-col pt-2'>
        {customTable.map((item, index) => {
          const isLast = index === customTable.length - 1
          return <Cell style={{color: index === status.index ? 'orange' : ''}} key={index} title={`第${index + 1}轮`}>
            <View style={{color: index === status.index ? 'orange' : ''}}>{`${item.hold}s 闭气 ${!isLast ? `，${item.breathe}s 调息`  : ''}`}</View>
          </Cell>
        })}
      </View>

      <View className='flex justify-center py-4 fixed bottom-10 w-full'>{controlButton}</View>
      <Setting onCustomize={handleCustomize} />
    </View>
  )
}
