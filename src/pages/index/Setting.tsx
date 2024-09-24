import { View } from '@tarojs/components'
import { useState } from 'react'
import { FloatingBubble, Field, Input, Button, Popup, Flex, Radio } from '@taroify/core'
import { SettingOutlined, Plus, Minus} from '@taroify/icons'
import mock from './mock'
import { bgmList } from './config'

interface SettingProps {
  onCustomize: (table: typeof mock.table, selectedBgm: number) => void
}

export default function Setting({ onCustomize }: SettingProps) {
  const [showCustomize, setShowCustomize] = useState(false)
  const [customTable, setCustomTable] = useState(mock.table)
  const [selectedBgm, setSelectedBgm] = useState(1)

  const handleCustomize = () => {
    setShowCustomize(true)
  }

  const handleSaveCustomize = () => {
    setShowCustomize(false)
    onCustomize(customTable, selectedBgm)
  }

  const addRound = () => {
    setCustomTable([...customTable, { hold: 90, breathe: 60 }])
  }

  const removeRound = (index: number) => {
    const newTable = customTable.filter((_, i) => i !== index)
    setCustomTable(newTable)
  }

  return (
    <View>
      <FloatingBubble icon={<SettingOutlined />} onClick={handleCustomize} />

      <Popup open={showCustomize} onClose={() => setShowCustomize(false)} placement='bottom'>
        <View className='p-4'>
          <View className='text-l mb-4'>自定义设置</View>
          {customTable.map((item, index) => (
            <View key={index} className='mb-4'>
              <Flex justify='space-between' align='center'>
                <Field label='闭气'>
                  <Input
                    type='number'
                    value={item.hold.toString()}
                    onChange={(e) => {
                      const newTable = [...customTable]
                      newTable[index].hold = parseInt(e.detail.value) || 0
                      setCustomTable(newTable)
                    }}
                  />
                </Field>
                {index < customTable.length - 1 && (
                  <Field label='调息'>
                    <Input
                      type='number'
                      value={item.breathe.toString()}
                      onChange={(e) => {
                        const newTable = [...customTable]
                        newTable[index].breathe = parseInt(e.detail.value) || 0
                        setCustomTable(newTable)
                      }}
                    />
                  </Field>
                )}
                {customTable.length > 1 && (
                  <Button size='small' variant='text' color='danger' onClick={() => removeRound(index)}>
                    <Minus />
                  </Button>
                )}
              </Flex>
            </View>
          ))}
          <View className='mb-4'>
            <View className='text-m mb-2'>背景音乐</View>
            <Radio.Group value={selectedBgm} onChange={setSelectedBgm}>
              {bgmList.map((audio) => (
                <Radio key={audio.id} name={audio.id}>{audio.name}</Radio>
              ))}
            </Radio.Group>
          </View>
          <Flex justify='space-around'>
            <Button onClick={addRound} className='mb-4'>
              <Plus /> 添加新轮次
            </Button>
            <Button color='primary' onClick={handleSaveCustomize}>保存</Button>
          </Flex>
        </View>
      </Popup>
    </View>
  )
}
