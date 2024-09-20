import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Cell, Circle } from '@taroify/core'
import { PlayCircleOutlined, StopCircleOutlined } from '@taroify/icons'
import { useRef, useState, useMemo } from 'react'
import { Workflow, PreparationStep, TrainingStep} from './workflow'
import mock from './mock'

const formatTime = (time: number) => {
  return `${Math.floor(time / 60).toString().padStart(2, '0')}:${Math.floor(time % 60).toString().padStart(2, '0')}`
}

export default function Index () {
  const workflow = useRef<Workflow>()
  const [status, setStatus] = useState({name: '', duration: 0, index: -1, remaining: 0, status: 'pending'})
  const [key, setKey] = useState(0)

  useLoad(() => {
    workflow.current = new Workflow(setStatus);
  })


  const handleStart = () => {
    // 添加准备步骤
    workflow.current?.addStep(new PreparationStep(mock.prepare));
    // 添加训练步骤
    mock.table.forEach(item => {
      workflow.current?.addStep(new TrainingStep('闭气', item.hold));
      workflow.current?.addStep(new TrainingStep('调息', item.breathe));
    })

    workflow.current?.run();
  }

  // const handlePause = () => {
  //   workflow.current?.pause();
  // }

  const handleResume = () => {
    workflow.current?.resume();
  }

  const handleStop = () => {
    workflow.current?.stop();
    setKey(state => ++state)
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
  }, [status.status])

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
    if (status.remaining === status.duration) {
      return 0
    }
    return 100 / status.duration
  }, [status])

  // 根据状态控制表盘百分比
  const percent = useMemo(() => {
    if (status.status === 'pending') return 0
    return (1 - status.remaining / status.duration) * 100
  }, [status])


  return (
    <View>
      <View className='flex justify-center items-center relative'>
        <Circle key={key} size={250} speed={speed} percent={percent} layerColor='#000' color='orange' strokeWidth={120} />
        <View className='absolute flex justify-center items-center flex-col'>
          {texts}
        </View>
      </View>

      <View className='flex justify-center flex-col pt-2'>{mock.table.map((item, index) => {
        const isLast = index === mock.table.length - 1
        return <Cell style={{color: index === status.index ? 'orange' : ''}} key={index} title={`第${index + 1}轮`}>
          <View style={{color: index === status.index ? 'orange' : ''}}>{`${item.hold}s 闭气 ${!isLast ? `，${item.breathe}s 调息`  : ''}`}</View>
        </Cell>
      })}</View>
      <View className='flex justify-center py-4 fixed bottom-10 w-full'>{controlButton}</View>
    </View>
  )
}
