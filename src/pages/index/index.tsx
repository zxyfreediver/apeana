import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { Cell, Circle, Countdown } from '@taroify/core'
import { PlayCircleOutlined } from '@taroify/icons'
import { useRef, useState, useEffect } from 'react'
import { Workflow, PreparationStep, TrainingStep} from './workflow'
import mock from './mock'

export default function Index () {
  const workflow = useRef<Workflow>()
  const countdownRef = useRef()
  const [status, setStatus] = useState({name: '', duration: 0, index: -1, remaining: 0})
  const percent = (status.remaining / status.duration) * 100 || 0

  useLoad(() => {
    // console.log('Page loaded.')
    workflow.current = new Workflow();
  })

  const handleStart = () => {
    // 添加准备步骤
    workflow.current?.addStep(new PreparationStep(mock.prepare));
    // 添加训练步骤
    mock.table.forEach(item => {
      workflow.current?.addStep(new TrainingStep('闭气 ', item.hold));
      workflow.current?.addStep(new TrainingStep('调息', item.breathe));
    })

    workflow.current?.run(setStatus);
  }

  useEffect(() => {
    console.log(status.remaining, status.duration)
    if (status.remaining === status.duration) {
      countdownRef.current?.reset()
    }
  }, [status])

  return (
    <View>
      <View className='flex justify-center items-center relative'>
        <Circle size={250} percent={percent} strokeWidth={200} />
        <View className='absolute transform -translate-x-1/2 flex justify-center items-center flex-col'>
          <Countdown format='mm:ss' ref={countdownRef} value={status.remaining * 1000} />
          <View className='text-2xl'>{status.name}</View>
        </View>
      </View>
      <View className='flex justify-center py-4'><PlayCircleOutlined size={60} onClick={handleStart} /></View>
      <View className='flex justify-center flex-col pt-2'>{mock.table.map((item, index) => {
        return <Cell key={index} title={`第${index + 1}轮`}>{`${item.hold}s 闭气，${item.breathe}s 调息`}</Cell>
      })}</View>
    </View>
  )
}
