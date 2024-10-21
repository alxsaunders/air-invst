'use client'

import React, { useState } from 'react'
import { ApifyData } from './ApifyData'

export const ZipCodeSearch: React.FC = () => {
  const [zipCode, setZipCode] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(false)

  const handleSearch = () => {
    if (zipCode) {
      setSearchTriggered(true)
    }
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Enter ZIP code"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {searchTriggered && <ApifyData zipCode={zipCode} />}
    </div>
  )
}