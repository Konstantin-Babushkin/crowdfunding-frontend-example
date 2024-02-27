import React, { ChangeEvent, useState } from 'react'

interface Props {
  type: string
  label?: string,
  placeholder?: string,
  onChangeCallback: (newVal: any) => void,
}

export const Input = ({ type, label, onChangeCallback, placeholder }: Props) => {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    onChangeCallback(event.target.value)
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
      {label && <label htmlFor="inputField" style={{ flex: '0 0 auto' }}>{label}</label>}
      <input
        type={type}
        min={type === 'number' ? '0' : undefined}
        id="inputField"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        style={{ flex: 1 }}
      />
    </div>
  )
}
